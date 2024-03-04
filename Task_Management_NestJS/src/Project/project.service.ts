import { isInt, isString } from 'class-validator';
import { TaskHistory } from '../Entity/Task_History';
import { ProjectHistory } from './../Entity/Project_history';
import { PinnedProjectView } from './../views/view';
import {
  PIN_STATUS,
  PROJECT_HISTORY_ACTION,
  NOTIFICATION_ENUM,
  TASK_HISTORY_ACTION,
  SERVICE_EXCEPTION,
  HISTORY_TYPE,
} from './../Enum/Enums.enum';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '../Entity/User';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '../Entity/Project';
import { ProjectResourceAllocation } from '../Entity/Project_resource_allocation';
import { Status } from '../Entity/Status';
import { ErrorStatus } from '../ErrorStatus';
import { CustomValidation } from '../Util/custom-validation.schema';
import { Repository } from 'typeorm';
import { ProjectAddDetails, ProjectUpdateDetails } from './Project.type';
import { Request, Response } from 'express';
const fs = require('fs');
import {
  STATUS,
  ALLOCATION_STATUS,
  TASK_STATUS,
  FOLDER_TYPE,
  ROLE_AUTHORITY,
  NOTIFCATION_STATUS,
} from '../Enum/Enums.enum';
import {
  AllocateUserDto,
  EditAllocateUserDto,
  PinProjectDto,
} from './Project.dto';
import { Task } from '../Entity/Task';
import { ProjectStatus, AllocatedUsersList } from '../views/view';
import { Notifications } from '../Entity/Notifications';
import { Env } from '../environment';
import { Folders } from '../Entity/Folders';
import { Roles } from '../Entity/Roles';
import { ProjectRole, Role } from '../Enum/Role.enum';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Files } from '../Entity/Files';
import { PinProject } from '../Entity/Pin_project';
import { Category } from '../Entity/Category';
import { BatchUpdateDto } from '../Task/task.dto';
import { RecentlyViewed } from '../Entity/Recently_viewed';
import { TaskRelationship } from '../Entity/TaskRelationship';

const todayDate = new Date().toISOString().slice(0, 10);
const currentDate = new Date(todayDate);
let timestamp = (new Date().valueOf() / 1000).toString();

@Injectable()
export class ProjectService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectRepository(ProjectResourceAllocation)
    private projectResourceAllocationRepository: Repository<ProjectResourceAllocation>,
    @InjectRepository(Project) private projectRepository: Repository<Project>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Task) private taskRepo: Repository<Task>,
    @InjectRepository(Folders) private folderRepo: Repository<Folders>,
    @InjectRepository(Files) private fileRepo: Repository<Files>,
    @InjectRepository(Roles) private roleRepo: Repository<Roles>,
    @InjectRepository(PinProject)
    private pinProjectRepo: Repository<PinProject>,
    @InjectRepository(Notifications)
    private notificatioRepo: Repository<Notifications>,
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
    private mailService: MailerService,
    @InjectRepository(ProjectHistory)
    private projectHistoryRepo: Repository<ProjectHistory>,
    @InjectRepository(TaskHistory)
    private taskHistoryRepo: Repository<TaskHistory>,
    @InjectRepository(RecentlyViewed)
    private recentlyViewedRepo: Repository<RecentlyViewed>,
    @InjectRepository(TaskRelationship)
    private taskRelationRepo: Repository<TaskRelationship>,
  ) {}

  async addProjectService(
    addProjectDetails: ProjectAddDetails,
    req: Request,
    res: Response,
  ) {
    try {
      let start_date = new Date(addProjectDetails.start_date);

      let end_date = new Date(addProjectDetails.end_date);
      let str_start_date = start_date.toISOString().slice(0, 10).toString();

      let str_end_date = end_date.toISOString().slice(0, 10).toString();
      if (str_start_date != addProjectDetails.start_date.toString()) {
        return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage: 'Invalid start date',
          statusCode: 3001,
        });
      }
      if (str_end_date != addProjectDetails.end_date.toString()) {
        return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage: 'Invalid end date',
          statusCode: 3002,
        });
      }

      if (currentDate > start_date) {
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(
            new CustomValidation(
              '"start_date" must be greater than or equal to "now"',
            ),
          );
      } else if (currentDate > end_date) {
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(
            new CustomValidation(
              '"end_date" must be greater than or equal to "now"',
            ),
          );
      } else if (end_date < start_date) {
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('end_date is smaller than start date'));
      }
      if (
        !addProjectDetails.project_name.match(
          /^(?! )(?!\s)(?!.* {2})[\s\S]*(?<!\s)(?! )$/,
        )
      ) {
        return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage:
            'project name must contain only alphabets,numbers and single space',
          statusCode: 1601,
        });
      }
      if (
        !addProjectDetails.project_code.match(
          /^(?! )(?!\s)(?!.* )[\s\S]*(?<!\s)(?! )$/,
        )
      ) {
        return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage: 'invalid project code',
          statusCode: 3772,
        });
      }
      let projectCodeExist = await this.projectRepository.findOne({
        where: {
          project_code: addProjectDetails.project_code,
        },
      });

      if (projectCodeExist) {
        let responseObj = new CustomValidation('project code already exists');
        return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send(responseObj);
      } else {
        let project = this.projectRepository.create({
          project_code: addProjectDetails.project_code.trim(),
          project_name: addProjectDetails.project_name.trim(),
          project_description: addProjectDetails.project_description.trim(),
          status: Status.ACTIVE,
          created_date: new Date(),
          updated_date: new Date(),
          start_date: addProjectDetails.start_date,
          end_date: addProjectDetails.end_date,
          project_created_by: req['currentUser'],
          project_updated_by: req['currentUser'],
        });
        let newProject = await this.projectRepository.save(project);
        if (newProject) {
          await this.allocatAdminsProject(newProject, req, addProjectDetails);
        }

        let folderCreate = await this.projectFolder(
          newProject,
          req,
          addProjectDetails,
        );

        newProject.project_folder = folderCreate;
        await this.projectRepository.save(newProject);

        return res.status(SERVICE_EXCEPTION.SUCCESS_RESPONSE).send({
          successMessage: 'Project created',
          statusCode: ErrorStatus.SUCCESS,
        });
      }
    } catch (error) {
      this.logger.error('add project in project service   , ' + error);
      return res
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }
  async allocatAdminsProject(
    newProject: any,
    req: Request,
    addProjectDetails: ProjectAddDetails,
  ) {
    let admins = await this.userRepo
      .createQueryBuilder('user')
      .where('user.role = :role', { role: Role.ADMIN })
      .andWhere('user.status = :status', {
        status: STATUS.ACTIVE,
      })
      .getMany();

    let roleAdmin = await this.roleRepo.findOne({
      where: { role_id: ProjectRole.PROJECT_ADMIN },
    });

    Promise.all(
      admins.map(async (value) => {
        let _allocate = await this.projectResourceAllocationRepository.save(
          this.projectResourceAllocationRepository.create({
            allocated_user: value,
            project_id_resource_alloc: newProject,
            created_date: new Date(),
            updated_date: new Date(),
            status: Status.ACTIVE,
            allocation_status: ALLOCATION_STATUS.ALLOCATED,
            from_date: addProjectDetails.start_date,
            to_date: addProjectDetails.end_date,
            role: roleAdmin,
            pin_status: 0,
            pin_order: 0,
          }),
        );
        if (_allocate) {
          let allocatedUser = await this.userRepo.findOne({
            where: { user_id: value.user_id },
          });
          allocatedUser.active_projects = allocatedUser.active_projects + 1;
          newProject.total_resource = newProject.total_resource + 1;
          await this.projectRepository.save(newProject);
          await this.userRepo.save(allocatedUser);
        }
      }),
    );
  }
  async projectFolder(
    newProject: any,
    req: Request,
    addProjectDetails: ProjectAddDetails,
  ) {
    let foldername = newProject.project_code + '_' + timestamp;
    let dirPath = Env.FOLDER_PATH + '/' + foldername;
    // fs.mkdir(
    //   dirPath,
    //   {
    //     recursive: true,
    //   },
    //   (err) => {
    //     if (err) {
    //       throw err;
    //     }
    //   },
    // );

    const folder = this.folderRepo.create({
      folder_name: newProject.project_code,
      directory: 'dirPath',
      project_id_folders: newProject,
      status: Status.ACTIVE,
      created_date: new Date(),
      updated_date: new Date(),
      folder_type: FOLDER_TYPE.PROJECT_FOLDER,
      created_by_folders: req['currentUser'],
      updated_by_folders: req['currentUser'],
    });
    return this.folderRepo.save(folder);
  }
  async updateProjectService(
    id: number,
    updateProjectDetails: ProjectUpdateDetails,
    req: Request,
    response: Response,
  ) {
    try {
      if (
        !updateProjectDetails.project_name.match(
          /^(?! )(?!\s)(?!.* {2})[\s\S]*(?<!\s)(?! )$/,
        )
      ) {
        return response.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage:
            'project name must contain only alphabet,numbers and single space',
          statusCode: 1601,
        });
      }
      const project = await this.projectRepository.findOne({
        where: { project_id: id, status: Status.ACTIVE },
      });
      if (!project) {
        let responseObj = new CustomValidation('project not found');
        return response
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(responseObj);
      }

      if (
        project.project_name == updateProjectDetails.project_name &&
        project.project_description ==
          updateProjectDetails.project_description &&
        project.start_date.toLocaleString() ==
          updateProjectDetails.start_date &&
        project.end_date.toLocaleString() == updateProjectDetails.end_date
      ) {
        return response.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage: 'no changes made',
          statusCode: 1050,
        });
      }
      let start_date = new Date(updateProjectDetails.start_date);
      let end_date = new Date(updateProjectDetails.end_date);

      let str_start_date = start_date.toISOString().slice(0, 10).toString();
      let str_end_date = end_date.toISOString().slice(0, 10).toString();
      if (str_start_date != updateProjectDetails.start_date.toString()) {
        return response.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage: 'Invalid start date',
          statusCode: 3001,
        });
      }
      if (str_end_date != updateProjectDetails.end_date.toString()) {
        return response.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage: 'Invalid end date',
          statusCode: 3002,
        });
      }

      let roleAccess = await this.projectResourceAllocationRepository.findOne({
        relations: ['role'],
        where: {
          project_id_resource_alloc: project,
          allocated_user: req['currentUser'],
        },
      });

      if (!roleAccess) {
        return response
          .status(SERVICE_EXCEPTION.UN_AUTHORIZED)
          .send({ errorMessage: 'Unauthorized access', statusCode: 399 });
      }
      if (roleAccess.role.role_id != ProjectRole.PROJECT_ADMIN) {
        return response
          .status(SERVICE_EXCEPTION.UN_AUTHORIZED)
          .send({ errorMessage: 'Unauthorized access', statusCode: 399 });
      }

      if (
        updateProjectDetails.start_date ==
          project.start_date.toLocaleString() &&
        updateProjectDetails.end_date == project.end_date.toLocaleString()
      ) {
        await this.updateProjectSubService(updateProjectDetails, project, req);
        return response.status(SERVICE_EXCEPTION.SUCCESS_RESPONSE).send({
          successMessage: 'Project Updated',
          statusCode: ErrorStatus.SUCCESS,
        });
      } else {
        const currentStart_Date = new Date(project.start_date);

        let value = await this.validateProject(
          currentStart_Date,
          start_date,
          end_date,
        );
        switch (value) {
          case 1:
            return response
              .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
              .send(
                new CustomValidation(
                  '"start_date" must be greater than or equal to "now"',
                ),
              );

          case 2:
            return response.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
              errorMessage: 'end date must be greater than start date',
              statusCode: 2091,
            });
          case 3:
            return response
              .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
              .send(
                new CustomValidation(
                  '"end_date" must be greater than or equal to "now"',
                ),
              );
          case 4:
            return response
              .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
              .send(
                new CustomValidation('end_date is smaller than start date'),
              );
          default:
            await this.updateProjectSubService(
              updateProjectDetails,
              project,
              req,
            );

            return response.status(SERVICE_EXCEPTION.SUCCESS_RESPONSE).send({
              successMessage: 'Project Updated',
              statusCode: ErrorStatus.SUCCESS,
            });
        }
      }
    } catch (error) {
      console.log(error);

      this.logger.error('update project  in project service  , ' + error);
      return response
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }
  async validateProject(currentStart_Date, start_date, end_date) {
    if (currentDate > start_date) {
      return 1;
    } else if (currentStart_Date > end_date) {
      return 2;
    } else if (currentDate > end_date) {
      return 3;
    } else if (end_date < start_date) {
      return 4;
    }
  }
  async updateProjectSubService(
    updateProjectDetails: ProjectUpdateDetails,
    project: any,
    req: Request,
  ) {
    await this.projectRepository.update(
      { project_id: project.project_id },
      {
        project_name: updateProjectDetails.project_name.trim(),
        project_description: updateProjectDetails.project_description.trim(),
        start_date: updateProjectDetails.start_date,
        end_date: updateProjectDetails.end_date,
        updated_date: new Date(),
        project_updated_by: req['currentUser'],
      },
    );
  }
  // Allocate users to project
  async allocateUsers(
    allocateUserDto: AllocateUserDto,
    req: Request,
    project_id: number,
    response: Response,
  ) {
    
    try {
      this.logger.debug(
        'hit the api --- project id:' +
          project_id +
          ' users: ' +
          allocateUserDto.users +
          ' Time: ' +
          new Date(),
      );
      let start_date = new Date(allocateUserDto.from_date);
      let end_date = new Date(allocateUserDto.to_date);
      let validatedStartDate = await this.validateDate(
        allocateUserDto.from_date,
      );
      this.logger.debug(
        'Validated the frm date --- project id:' +
          project_id +
          ' users: ' +
          allocateUserDto.users +
          ' Time: ' +
          new Date(),
      );
      if (!validatedStartDate) {
        this.logger.debug(
          'Invalid dtr date --- project id:' +
            project_id +
            ' users: ' +
            allocateUserDto.users +
            ' Time: ' +
            new Date(),
        );
        return response
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('invalid from date'));
      }
      let validatedEndDate = await this.validateDate(allocateUserDto.to_date);
      this.logger.debug(
        'validate end date --- project id:' +
          project_id +
          ' users: ' +
          allocateUserDto.users +
          ' Time: ' +
          new Date(),
      );

      if (!validatedEndDate) {
        this.logger.debug(
          'invalid end date --- project id:' +
            project_id +
            ' users: ' +
            allocateUserDto.users +
            ' Time: ' +
            new Date(),
        );

        return response
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('invalid to date'));
      }
      let validationResult = await this.validateDateAllocateUser(
        start_date,
        end_date,
      );
      this.logger.debug(
        'after validateDateAllocateUser --- project id:' +
          project_id +
          ' users: ' +
          allocateUserDto.users +
          ' Time: ' +
          new Date(),
      );

      switch (validationResult) {
        case 1:
          return response
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(
              new CustomValidation(
                '"start_date" must be greater than or equal to "now"',
              ),
            );
        case 2:
          return response
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(
              new CustomValidation(
                '"end_date" must be greater than or equal to "now"',
              ),
            );
        case 3:
          return response
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('end_date is smaller than start date'));
      }
      this.logger.debug(
        'after catch --- project id:' +
          project_id +
          ' users: ' +
          allocateUserDto.users +
          ' Time: ' +
          new Date(),
      );

      let project = await this.projectRepository.findOne({
        where: { project_id, status: STATUS.ACTIVE },
      });
      if (!project) {
        this.logger.debug(
          'project not found --- project id:' +
            project_id +
            ' users: ' +
            allocateUserDto.users +
            ' Time: ' +
            new Date(),
        );

        return response
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('project not found'));
      }
      let projectEndDate = new Date(project.end_date);
      let projectStartDate = new Date(project.start_date);
      let validationWithProjectDate = await this.validateWithProjectDate(
        end_date,
        projectEndDate,
        start_date,
        projectStartDate,
      );
      switch (validationWithProjectDate) {
        case 1:
          this.logger.debug(
            'validationWithProjectDate 1 --- project id:' +
              project_id +
              ' users: ' +
              allocateUserDto.users +
              ' Time: ' +
              new Date(),
          );
          return response
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(
              new CustomValidation('end_date is larger than proj end date'),
            );
        case 2:
          this.logger.debug(
            'validationWithProjectDate 2 --- project id:' +
              project_id +
              ' users: ' +
              allocateUserDto.users +
              ' Time: ' +
              new Date(),
          );

          return response
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('start is larger than proj end date'));
        default:
      }
      let userArray = allocateUserDto.users;
      let userValidationRes = await this.validateUserAllocateUser(userArray);
      if (userValidationRes == 2) {
        this.logger.debug(
          'validateUserAllocateUser 1 --- project id:' +
            project_id +
            ' users: ' +
            allocateUserDto.users +
            ' Time: ' +
            new Date(),
        );

        return response.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage: 'Duplication in user',
          statusCode: 82,
        });
      } else if (isString(userValidationRes)) {
        this.logger.debug(
          'validateUserAllocateUser 2 --- project id:' +
            project_id +
            ' users: ' +
            allocateUserDto.users +
            ' Time: ' +
            new Date(),
        );

        return response.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage: 'Invalid user id at index ' + userValidationRes,
          statusCode: 78,
        });
      }

      let project_endDate = new Date(project.end_date);
      if (end_date > project_endDate) {
        this.logger.debug(
          'end_date > project_endDate --- project id:' +
            project_id +
            ' users: ' +
            allocateUserDto.users +
            ' Time: ' +
            new Date(),
        );

        return response
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(
            new CustomValidation('end_date is smaller than projects end date'),
          );
      }
      let roleAccess = await this.projectResourceAllocationRepository.findOne({
        relations: ['role'],
        where: {
          project_id_resource_alloc: project,
          allocated_user: req['currentUser'],
          allocation_status: ALLOCATION_STATUS.ALLOCATED,
        },
      });
      if (!roleAccess) {
        this.logger.debug(
          'role access not found --- project id:' +
            project_id +
            ' users: ' +
            allocateUserDto.users +
            ' Time: ' +
            new Date(),
        );

        return response
          .status(SERVICE_EXCEPTION.UN_AUTHORIZED)
          .send({ errorMessage: 'Unauthorized access', statusCode: 399 });
      }
      if (
        roleAccess.role.role_id == ProjectRole.PROJECT_ADMIN ||
        roleAccess.role.role_id == ProjectRole.PROJECT_MANAGER ||
        req['currentUser'].role.role_id == 1
      ) {
        return await this.allocateUserSub(
          roleAccess,
          project,
          allocateUserDto,
          req,
          response,
        );
      } else {
        this.logger.debug(
          'un authorized --- project id:' +
            project_id +
            ' users: ' +
            allocateUserDto.users +
            ' Time: ' +
            new Date(),
        );
        return response
          .status(SERVICE_EXCEPTION.UN_AUTHORIZED)
          .send({ errorMessage: 'Unauthorized access', statusCode: 399 });
      }
    } catch (error) {
      console.log(error);
      this.logger.error('allocate user, ', error);
      return response
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }


  async validateWithProjectDate(
    end_date,
    projectEndDate,
    start_date,
    projectStartDate,
  ) {
    this.logger.debug('hit validateWithProjectDate' + ' Time: ' + new Date());

    if (end_date > projectEndDate) {
      return 1;
    } else if (start_date < projectStartDate) {
      return 2;
    }
  }

  async validateDateAllocateUser(start_date, end_date) {
    this.logger.debug(
      'hit validate date api --- start date:' +
        start_date +
        ' end date: ' +
        end_date +
        ' Time: ' +
        new Date(),
    );

    if (currentDate > start_date) {
      this.logger.debug('1' + ' Time: ' + new Date());

      return 1;
    } else if (currentDate > end_date) {
      this.logger.debug('2' + ' Time: ' + new Date());

      return 2;
    } else if (end_date < start_date) {
      this.logger.debug('3' + ' Time: ' + new Date());

      return 3;
    }
  }

  async validateUserAllocateUser(userArray: any) {
    this.logger.debug(
      'validateUserAllocateUser --- userArray :' +
        userArray +
        ' Time: ' +
        new Date(),
    );

    for (let i in userArray) {
      let count = 0;
      for (let j in userArray) {
        if (userArray[i] == userArray[j]) {
          count = count + 1;
        }
      }
      if (typeof userArray[i] != typeof 1 || userArray[i] < 1) {
        return i;
      }
      if (count > 1) {
        return 2;
      }
    }
  }

  async allocateUserSub(
    roleAccess: any,
    project: any,
    allocateUserDto: AllocateUserDto,
    req: Request,
    response: Response,
  ) {
    this.logger.debug(
      'allocateUserSub hit --- project id:' +
        project.project_id +
        ' users: ' +
        allocateUserDto.users +
        ' Time: ' +
        new Date(),
    );

    let rejectedUsers = [];
    if (roleAccess.role.role_id == 4 && allocateUserDto.role == 3) {
      this.logger.debug(
        'un-authorized --- project id:' +
          project.project_id +
          ' users: ' +
          allocateUserDto.users +
          ' Time: ' +
          new Date(),
      );

      return response
        .status(SERVICE_EXCEPTION.UN_AUTHORIZED)
        .send(new CustomValidation('unauthorized access'));
    }

    const roleExist = await this.roleRepo.findOne({
      where: {
        role_id: allocateUserDto.role,
        authority: ROLE_AUTHORITY.MEDIUM_LEVEL,
      },
    });
    this.logger.debug(
      'dto role exist --- project id:' +
        project.project_id +
        ' users: ' +
        allocateUserDto.users +
        ' Time: ' +
        new Date(),
    );

    let users = allocateUserDto.users;
    rejectedUsers = await this.allocate(
      users,
      project,
      allocateUserDto,
      roleExist,
      req,
    );
    this.logger.debug(
      'after allocate --- project id:' +
        project.project_id +
        ' users: ' +
        allocateUserDto.users +
        ' Time: ' +
        new Date(),
    );
    const projectMemberList =
      await this.projectResourceAllocationRepository.find({
        relations: ['allocated_user'],
        where: {
          project_id_resource_alloc: project,
          status: ALLOCATION_STATUS.ALLOCATED,
        },
      });
    this.logger.debug(
      'projectMemberList taken --- project id:' +
        project.project_id +
        ' users: ' +
        allocateUserDto.users +
        ' Time: ' +
        new Date(),
    );

    response
    .status(SERVICE_EXCEPTION.SUCCESS_RESPONSE)
    .send(rejectedUsers);
    
    const notifications = rejectedUsers
      .filter((user) => user.code === 2)
      .flatMap((user) =>
        projectMemberList.map((member) => ({
          content: user.user_name + ' allocated to',
          user_id_notification: member.allocated_user,
          project_id_notification: project,
          status: STATUS.ACTIVE,
          view_status: NOTIFCATION_STATUS.NOTVIEWED,
          created_date: new Date(),
          updated_date: new Date(),
          user_created_notification: req['currentUser'],
          action: NOTIFICATION_ENUM.ALLOCATION,
        })),
      );

    await Promise.all(
      notifications.map((notification) =>
        this.notificatioRepo.save(notification),
      ),
    );
    this.logger.debug(
      'notification sent success --- project id:' +
        project.project_id +
        ' users: ' +
        allocateUserDto.users +
        ' Time: ' +
        new Date(),
    );
  }

  async allocate(users, project, allocateUserDto, roleExist, req) {
    let rejectedUsers = [];
    this.logger.debug(
      'allocate hit --- project id:' +
        project.project_id +
        ' users: ' +
        allocateUserDto.users +
        ' Time: ' +
        new Date(),
    );

    await Promise.all(
      users.map(async (user) => {
        let userToBeAllocated = await this.userRepo.findOne({
          where: {
            user_id: user,
            status: STATUS.ACTIVE,
          },
        });
        if (userToBeAllocated) {
          let checkAllocation =
            await this.projectResourceAllocationRepository.findOne({
              where: {
                allocated_user: userToBeAllocated,
                status: STATUS.ACTIVE,
                allocation_status: ALLOCATION_STATUS.ALLOCATED,
                project_id_resource_alloc: project,
              },
            });

          if (checkAllocation) {
            rejectedUsers.push({
              user_id: user,
              user_name: userToBeAllocated.user_name,
              reason: 'User is already allocated in the project',
              code: 1,
            });
          } else {
            let resource = await this.projectResourceAllocationRepository.save(
              this.projectResourceAllocationRepository.create({
                from_date: new Date(allocateUserDto.from_date),
                to_date: new Date(allocateUserDto.to_date),
                allocation_status: ALLOCATION_STATUS.ALLOCATED,
                status: STATUS.ACTIVE,
                created_date: new Date(),
                updated_date: new Date(),
                project_id_resource_alloc: project,
                allocated_user: userToBeAllocated,
                role: roleExist,
                allocation_assigned_by: req['currentUser'],
                pin_order: 0,
                pin_status: 0,
              }),
            );
            if (resource) {
              rejectedUsers.push({
                user_id: user,
                user_name: userToBeAllocated.user_name,
                reason: 'User is allocated successfully',
                code: 2,
              });
              let allocationHistory = this.taskHistoryRepo.create({
                task_history_status: STATUS.ACTIVE,
                resource_allocation_status: resource.allocation_status,
                allocation_data: resource,
                created_date: new Date(),
                updated_date: new Date(),
                action: PROJECT_HISTORY_ACTION.ALLOCATE_USER,
                created_by_history: req['currentUser'],
                updated_by_history: req['currentUser'],
                task_history: project,
                history_type: HISTORY_TYPE.PROJECT_HISTORY,
              });
              await this.taskHistoryRepo.save(allocationHistory);
              project.total_resource = project.total_resource + 1;
              await this.projectRepository.save(project);
              userToBeAllocated.active_projects =
                userToBeAllocated.active_projects + 1;
              this.userRepo.save(userToBeAllocated);
              if (userToBeAllocated.new_user == 0) {
                await this.newUserEmail(resource);
                userToBeAllocated.new_user = 2;
                await this.userRepo.save(userToBeAllocated);
              }
              await this.assignToProject(resource);
            }
          }
        } else {
          rejectedUsers.push({
            user_id: user,
            user_name: 'Not a user',
            reason: 'User not found',
            code: 0,
          });
        }
      }),
    );
    this.logger.debug(
      'allocate hit --- project id:' +
        project.project_id +
        ' users: ' +
        allocateUserDto.users +
        'rejectedUsers: ' +
        rejectedUsers +
        ' Time: ' +
        new Date(),
    );

    return rejectedUsers;
  }
  async assignToProject(project) {
    // await this.mailService.sendMail({
    //   to: project.allocated_user.email,
    //   from: 'taskmanagementdev@gmail.com',
    //   subject: 'You are allocated to project',
    //   text: 'xxxxxxxxxxxx',
    //   template: 'assign_to_project',
    //   context: {
    //     assign_to_project: {
    //       project_name: project.project_id_resource_alloc.project_name,
    //       project_code: project.project_id_resource_alloc.project_code,
    //       from_date: project.from_date.toString().slice(0, 15),
    //       to_date: project.to_date.toString().slice(0, 15),
    //       assigned_by: project.allocation_assigned_by.user_name,
    //     },
    //   },
    // });
  }

  async newUserEmail(project) {
    // await this.mailService.sendMail({
    //   to: project.allocated_user.email,
    //   from: 'taskmanagementdev@gmail.com',
    //   subject: 'Your login credentials to access Task Management',
    //   text: 'xxxxxxxxxxxx',
    //   template: 'sample',
    //   context: {
    //     sample: {},
    //   },
    // });
  }

  // get currentUser allocated projectList
  async getProjectById(req: Request, res: Response) {
    try {
      let user = req['currentUser'];
      let validateProjectMemberListPaginationRes =
        await this.validateProjectListPagination(req);
      switch (validateProjectMemberListPaginationRes) {
        case 1:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('invalid limit'));
        case 2:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('invalid last data'));
        case 3:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('invalid last id'));
        case 4:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('last id missing'));
        case 5:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('last data missing'));
        case 6:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('no record exist on given data'));
        case 7:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(
              new CustomValidation(
                'both page and last data or last id will not be accepted',
              ),
            );
        case 8:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('invalid page'));
        case 9:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('limit must not be greater than 3000'));
        default:
      }
      let lastData = req.query.last_data || null;
      const page = Number(req.query.page) || 1;
      let limit = Number(req.query.limit) || null;
      let lastId = Number(req.query.last_id) || null;
      let startIndex = (page - 1) * limit;
      let hasNext;

      let _projectListQuery = this.projectResourceAllocationRepository
        .createQueryBuilder('project_resource')
        .addSelect('project_resource.project_id_resource_alloc', 'project')
        .leftJoinAndSelect(
          'project_resource.project_id_resource_alloc',
          'project_id_resource_alloc',
        )
        .leftJoinAndSelect('project_resource.allocated_user', 'allocated_user')
        .leftJoinAndSelect('project_resource.role', 'role')
        .where('project_resource.allocation_status =:allocation_status', {
          allocation_status: ALLOCATION_STATUS.ALLOCATED,
        })
        .andWhere('project_resource.allocated_user =:allocated_user', {
          allocated_user: user.user_id,
        })
        .andWhere('project_resource.status =:status', { status: STATUS.ACTIVE })
        .orderBy('project_resource.pin_order', 'DESC')
        .addOrderBy('project_resource.project_resource_allocation_id', 'DESC');

      let _projectListSubQuery = this.projectResourceAllocationRepository
        .createQueryBuilder('project_resource')
        .addSelect('project_resource.project_id_resource_alloc', 'project')
        .leftJoinAndSelect(
          'project_resource.project_id_resource_alloc',
          'project_id_resource_alloc',
        )
        .leftJoinAndSelect('project_resource.allocated_user', 'allocated_user')
        .leftJoinAndSelect('project_resource.role', 'role')
        .where('project_resource.allocation_status =:allocation_status', {
          allocation_status: ALLOCATION_STATUS.ALLOCATED,
        })
        .andWhere('project_resource.allocated_user =:allocated_user', {
          allocated_user: user.user_id,
        })
        .andWhere('project_resource.status =:status', { status: STATUS.ACTIVE })
        .orderBy('project_resource.pin_order', 'DESC')
        .addOrderBy('project_resource.project_resource_allocation_id', 'DESC');

      if (req.query.searchKey) {
        let searchName = req.query.searchKey
          .toString()
          .trim()
          .replace(/[_+%]/g, '\\$&');
        _projectListQuery.andWhere(
          'project_id_resource_alloc.project_name LIKE:searchName',
          {
            searchName: `%${searchName}%`,
          },
        );
        _projectListSubQuery.andWhere(
          'project_id_resource_alloc.project_name LIKE:searchName',
          {
            searchName: `%${searchName}%`,
          },
        );
      }

      let total = await _projectListSubQuery.getCount();
      if (!limit) {
        limit = total;
      }
      if (req.query.page) {
        if (startIndex > total) {
          startIndex = total + 1;
        }
        _projectListQuery.offset(startIndex).limit(limit);
        hasNext = total > limit + startIndex;
      } else if (lastData) {
        _projectListQuery
          .andWhere(
            '(project_resource.pin_order < :pin_order OR (project_resource.pin_order = :pin_order AND project_resource.project_resource_allocation_id < :project_resource_allocation_id) )',
            { project_resource_allocation_id: lastId, pin_order: lastData },
          )
          .limit(limit);
      } else {
        _projectListQuery.offset(startIndex).limit(limit);
        hasNext = total > limit;
      }
      let result = await _projectListQuery.getMany();
      let listView = new PinnedProjectView(result).projects;
      const dataCount = listView.length;

      return res
        .status(SERVICE_EXCEPTION.SUCCESS_RESPONSE)
        .send({ total, dataCount, hasNext, listView });
    } catch (error) {
      this.logger.error('get a project by id in project service  , ', error);
      return res
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }

  async validateProjectListPagination(req) {
    if (req.query.limit) {
      let limitPerPage = Number(req.query.limit);
      if (isNaN(limitPerPage) || !isInt(limitPerPage) || limitPerPage < 1) {
        return 1;
      }
      if (limitPerPage > 3000) {
        return 9;
      }
    }
    if (
      (req.query.page && req.query.last_data) ||
      (req.query.page && req.query.last_id)
    ) {
      return 7;
    }
    if (req.query.page) {
      let pageNo = Number(req.query.page);
      if (isNaN(pageNo) || !isInt(pageNo) || pageNo < 1) {
        return 8;
      }
    }

    return this.lastRecordProjectExist(req);
  }
  async lastRecordProjectExist(req) {
    if (req.query.last_data) {
      if (!isString(req.query.last_data)) {
        return 2;
      }
    }
    if (req.query.last_id) {
      let lastDataId = Number(req.query.last_id);
      if (isNaN(lastDataId) || !isInt(lastDataId)) {
        return 3;
      }
    }
    if (req.query.last_data && !req.query.last_id) {
      return 4;
    } else if (req.query.last_id && !req.query.last_data) {
      return 5;
    } else if (!req.query.last_data && !req.query.last_id) {
      return;
    }

    let user = req['currentUser'];
    let offsetQueryValidate = await this.projectResourceAllocationRepository
      .createQueryBuilder('project_resource')
      .leftJoinAndSelect('project_resource.allocated_user', 'allocated_user')
      .leftJoinAndSelect(
        'project_resource.project_id_resource_alloc',
        'project_id_resource_alloc',
      )
      .leftJoinAndSelect('project_resource.role', 'role')
      .where('project_resource.allocation_status =:allocation_status', {
        allocation_status: ALLOCATION_STATUS.ALLOCATED,
      })
      .andWhere('project_resource.allocated_user =:allocated_user', {
        allocated_user: user.user_id,
      })
      .andWhere('project_resource.status =:status', { status: STATUS.ACTIVE })
      .orderBy('project_resource.pin_order', 'DESC')
      .andWhere('project_resource.project_resource_allocation_id =:id', {
        id: req.query.last_id,
      })
      .andWhere('project_resource.pin_order =:last_data', {
        last_data: req.query.last_data,
      })
      .getOne();

    if (!offsetQueryValidate) {
      return 6;
    }
  }
  //get project overall status
  async overallProjectStatus(req: Request, id: number, res: Response) {
    try {
      let user = req['currentUser'];
      const project = await this.projectRepository.findOne({
        where: {
          project_id: id,
          status: Status.ACTIVE,
        },
      });
      const projects = await this.projectResourceAllocationRepository.find({
        relations: ['project_id_resource_alloc', 'role'],
        where: {
          allocated_user: user,
          status: STATUS.ACTIVE,
          allocation_status: ALLOCATION_STATUS.ALLOCATED,
          project_id_resource_alloc: project,
        },
      });
      if (projects.length == 0 && user.role.role_id != 1) {
        return res
          .status(SERVICE_EXCEPTION.UN_AUTHORIZED)
          .send({ errorMessage: 'Unauthorized access', statusCode: 399 });
      }
      if (!project) {
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('project not found'));
      } else {
        let total_task = project.total_task;
        let category = await this.categoryRepo.find({
          where: {
            status: Status.ACTIVE,
          },
        });

        let categoryArray = [];
        let categoryTotal = [];
        let categoryClosed = [];
        let categoryOpen = [];
        let categoryInprogress = [];
        let categoryResolved = [];

        for (let i in category) {
          let bug = await this.taskRepo
            .createQueryBuilder('task')
            .where('task.project_id = :project_id', { project_id: id })
            .andWhere('task.task_category = :category', {
              category: category[i].category_id,
            })
            .andWhere('task.status = :status', { status: STATUS.ACTIVE })
            .getMany();
          categoryArray.push(bug);

          this.logger.debug(categoryArray.length + 'project status');

          let total = await this.taskRepo
            .createQueryBuilder('task')
            .where('task.project_id = :project_id', { project_id: id })
            .andWhere('task.task_category = :category', {
              category: category[i].category_id,
            })
            .andWhere('task.status = :status', { status: STATUS.ACTIVE })
            .getCount();
          categoryTotal.push(total);

          let closed = await this.taskRepo
            .createQueryBuilder('task')
            .where('task.project_id = :project_id', { project_id: id })
            .andWhere('task.task_category = :category', {
              category: category[i].category_id,
            })
            .andWhere('task.task_status = :task_status', {
              task_status: TASK_STATUS.CLOSED,
            })
            .andWhere('task.status = :status', { status: STATUS.ACTIVE })
            .getCount();
          categoryClosed.push(closed);
          let open = await this.taskRepo
            .createQueryBuilder('task')
            .where('task.project_id = :project_id', { project_id: id })
            .andWhere('task.task_category = :category', {
              category: category[i].category_id,
            })
            .andWhere('task.task_status = :task_status', {
              task_status: TASK_STATUS.OPEN,
            })
            .andWhere('task.status = :status', { status: STATUS.ACTIVE })
            .getCount();
          categoryOpen.push(open);
          let inProgress = await this.taskRepo
            .createQueryBuilder('task')
            .where('task.project_id = :project_id', { project_id: id })
            .andWhere('task.task_category = :category', {
              category: category[i].category_id,
            })
            .andWhere('task.task_status = :task_status', {
              task_status: TASK_STATUS.INPROGRESS,
            })
            .andWhere('task.status = :status', { status: STATUS.ACTIVE })
            .getCount();
          categoryInprogress.push(inProgress);
          let resolved = await this.taskRepo
            .createQueryBuilder('task')
            .where('task.project_id = :project_id', { project_id: id })
            .andWhere('task.task_category = :category', {
              category: category[i].category_id,
            })
            .andWhere('task.task_status = :task_status', {
              task_status: TASK_STATUS.RESOLVED,
            })
            .andWhere('task.status = :status', { status: STATUS.ACTIVE })
            .getCount();
          categoryResolved.push(resolved);
        }

        let categoryPercentage = [];
        for (let i = 0; i < categoryTotal.length; i++) {
          let fieldName = category[i].category_name;
          if (categoryTotal[i] == 0) {
            categoryPercentage[i] = {
              category: fieldName,
              categoryTotal: 0,
              categoryClosed: 0,
              categoryOpen: 0,
              categoryInprogress: 0,
              categoryResolved: 0,
            };
          } else {
            categoryPercentage[i] = {
              category: fieldName,
              closedPercent: Math.round(
                (categoryClosed[i] / categoryTotal[i]) * 100,
              ),
              openPercent: Math.round(
                (categoryOpen[i] / categoryTotal[i]) * 100,
              ),
              inprogressPercent: Math.round(
                (categoryInprogress[i] / categoryTotal[i]) * 100,
              ),
              resolvedPercent: Math.round(
                (categoryResolved[i] / categoryTotal[i]) * 100,
              ),
            };
          }
        }
        let openTask = await this.taskRepo
          .createQueryBuilder('task')
          .where('task.project_id = :project_id', { project_id: id })
          .andWhere('task.task_status = :task_status', {
            task_status: TASK_STATUS.OPEN,
          })
          .andWhere('task.status = :status', { status: STATUS.ACTIVE })
          .getCount();

        let inprogressTask = await this.taskRepo
          .createQueryBuilder('task')
          .where('task.project_id = :project_id', { project_id: id })
          .andWhere('task.task_status = :task_status', {
            task_status: TASK_STATUS.INPROGRESS,
          })
          .andWhere('task.status = :status', { status: STATUS.ACTIVE })
          .getCount();
        let closedTask = await this.taskRepo
          .createQueryBuilder('task')
          .where('task.project_id = :project_id', { project_id: id })
          .andWhere('task.task_status = :task_status', {
            task_status: TASK_STATUS.CLOSED,
          })
          .andWhere('task.status = :status', { status: STATUS.ACTIVE })
          .getCount();
        let resolvedTask = await this.taskRepo
          .createQueryBuilder('task')
          .where('task.project_id = :project_id', { project_id: id })
          .andWhere('task.task_status = :task_status', {
            task_status: TASK_STATUS.RESOLVED,
          })
          .andWhere('task.status = :status', { status: STATUS.ACTIVE })
          .getCount();
        return res
          .status(SERVICE_EXCEPTION.SUCCESS_RESPONSE)
          .send(
            new ProjectStatus(
              project,
              total_task,
              openTask,
              inprogressTask,
              resolvedTask,
              closedTask,
              categoryPercentage,
            ),
          );
      }
    } catch (error) {
      this.logger.error(
        'overall  project status in project service  , ' + error,
      );
      return res
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }

  //project delete
  async deleteProject(id: number, req: Request, res: Response) {
    try {
      let currentUser = req['currentUser'];
      const project = await this.projectRepository.findOne({
        where: { project_id: id, status: Status.ACTIVE },
      });
      if (!project) {
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('project not found'));
      }
      const projectAlloc =
        await this.projectResourceAllocationRepository.findOne({
          relations: ['role', 'allocated_user', 'project_id_resource_alloc'],
          where: {
            project_id_resource_alloc: project,
            allocated_user: currentUser,
            status: STATUS.ACTIVE,
            allocation_status: ALLOCATION_STATUS.ALLOCATED,
          },
        });

      if (!projectAlloc) {
        return res
          .status(SERVICE_EXCEPTION.UN_AUTHORIZED)
          .send({ errorMessage: 'Unauthorized access', statusCode: 399 });
      }
      if (projectAlloc.project_id_resource_alloc.project_id != id) {
        return res
          .status(SERVICE_EXCEPTION.UN_AUTHORIZED)
          .send({ errorMessage: 'Unauthorized access', statusCode: 399 });
      }
      if (projectAlloc.role.role_id != 3 && currentUser.role.role_id != 1) {
        return res
          .status(SERVICE_EXCEPTION.UN_AUTHORIZED)
          .send({ errorMessage: 'Unauthorized access', statusCode: 399 });
      } else {
        let oldData = Object.assign({}, project);
        const isUserAllocated =
          await this.projectResourceAllocationRepository.find({
            relations: ['allocated_user'],
            where: {
              project_id_resource_alloc: oldData,
              allocation_status: ALLOCATION_STATUS.ALLOCATED,
              status: Status.ACTIVE,
            },
          });
        project.status = STATUS.INACTIVE;

        this.projectRepository.save(project);
        if (project.status == 1) {
          return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
            errorMessage: 'Project  not deleted ',
            statusCode: 1500,
          });
        } else {
          await Promise.all(
            isUserAllocated.map(async (resource) => {
              resource.allocation_status = ALLOCATION_STATUS.UNALLOCATED;
              resource.status = STATUS.INACTIVE;
              resource.pin_order = 0;
              resource.pin_status = PIN_STATUS.UNPIN;
              let user = await this.userRepo.findOne({
                where: { user_id: resource.allocated_user.user_id },
              });

              if (user.active_projects > 0) {
                user.active_projects = user.active_projects - 1;
              }
              await this.userRepo.save(user);
              await this.projectResourceAllocationRepository.save(resource);
            }),
          );
          await this.recentlyViewedRepo.update(
            { project_recently_viewed: project },
            { status: STATUS.INACTIVE },
          );

          await this.taskRelationRepo.update(
            { project_id_task_relationship: project },
            { status: STATUS.INACTIVE },
          );
          await this.taskRepo.update(
            { project_id: project },
            { status: STATUS.INACTIVE },
          );
          await this.fileRepo.update(
            { project_id_file: project },
            { status: STATUS.INACTIVE },
          );
          await this.folderRepo.update(
            { project_id_folders: project },
            { status: STATUS.INACTIVE },
          );
          return res.status(SERVICE_EXCEPTION.SUCCESS_RESPONSE).send({
            successMessage: 'Project deleted successfully',
            statusCode: ErrorStatus.SUCCESS,
          });
        }
      }
    } catch (error) {
      this.logger.error('delete project in project service  , ' + error);
      return res
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }
  async unallocatedUserService(id: number, req: Request, response: Response) {
    try {
      let _projectId = req.query.project_id;

      let userExists = await this.userRepo.findOne({
        relations: ['role'],
        where: { user_id: id, status: STATUS.ACTIVE },
      });

      if (_projectId == null) {
        return response.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage: 'project id required',
          statusCode: 2501,
        });
      }
      if (!_projectId.toString().match(/^\d*$/)) {
        return response.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage: 'project id must be a number',
          statusCode: 2502,
        });
      }
      let projectId = Number(_projectId);

      if (!userExists) {
        return response
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('user not found'));
      }

      if (req['currentUser'].user_id == userExists.user_id) {
        return response
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('cannot remove them self'));
      }
      let projectExits = await this.projectRepository.findOne({
        where: { project_id: projectId, status: STATUS.ACTIVE },
      });

      if (!projectExits) {
        return response
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('project not found'));
      }
      let roleAccess = await this.projectResourceAllocationRepository.findOne({
        relations: ['role'],
        where: {
          project_id_resource_alloc: projectExits,
          allocated_user: req['currentUser'],
          allocation_status: ALLOCATION_STATUS.ALLOCATED,
        },
      });
      if (!roleAccess) {
        return response
          .status(SERVICE_EXCEPTION.UN_AUTHORIZED)
          .send({ errorMessage: 'Unauthorized access', statusCode: 399 });
      }

      if (
        roleAccess.role.role_id == ProjectRole.PROJECT_ADMIN ||
        roleAccess.role.role_id == ProjectRole.PROJECT_MANAGER
      ) {
        let user = await this.projectResourceAllocationRepository.findOne({
          relations: ['allocated_user', 'role'],
          where: {
            project_id_resource_alloc: projectExits,
            allocated_user: userExists,
            allocation_status: ALLOCATION_STATUS.ALLOCATED,
          },
        });

        if (!user || user == null) {
          this.logger.error(user, '????');
          return response
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('user not found'));
        }
        this.logger.debug(
          user.allocated_user.user_id,
          'user_id',
          new Date(),
          'time of before allocxated',
        );
        user.allocation_status = ALLOCATION_STATUS.UNALLOCATED;
        user.status = STATUS.INACTIVE;
        user.updated_date = new Date();
        user.pin_order = 0;
        user.pin_status = PIN_STATUS.UNPIN;
        userExists.active_projects = userExists.active_projects - 1;
        await this.userRepo.save(userExists);
        this.logger.debug(
          user.allocated_user.user_id,
          'user_id',
          new Date(),
          'time of allocated',
        );
        await this.projectResourceAllocationRepository.save(user);
        projectExits.total_resource = projectExits.total_resource - 1;
        await this.projectRepository.save(projectExits);

        let _notifications = await this.notificatioRepo
          .createQueryBuilder('notify')
          .where('notify.user_id =:user_id', {
            user_id: user.allocated_user.user_id,
          })
          .andWhere('notify.project_id =:project_id', {
            project_id: projectExits.project_id,
          })
          .getMany();

        await Promise.all(
          _notifications.map(async (notificationObj) => {
            notificationObj.action = NOTIFICATION_ENUM.UNN_ALLOCATION;
            await this.notificatioRepo.save(notificationObj);
          }),
        );
        let allocationHistory = this.taskHistoryRepo.create({
          task_history_status: STATUS.ACTIVE,
          resource_allocation_status: user.allocation_status,
          allocation_data: user,

          created_date: new Date(),
          updated_date: new Date(),
          action: PROJECT_HISTORY_ACTION.UN_ALLOCATE,
          created_by_history: req['currentUser'],
          updated_by_history: req['currentUser'],
          task_history: projectExits,
          history_type: HISTORY_TYPE.PROJECT_HISTORY,
        });
        await this.taskHistoryRepo.save(allocationHistory);
        let notification = this.notificatioRepo.create({
          content: user.allocated_user.user_name + ' unallocated from ',
          user_id_notification: user.allocated_user,
          project_id_notification: projectExits,
          status: STATUS.ACTIVE,
          view_status: NOTIFCATION_STATUS.NOTVIEWED,
          created_date: new Date(),
          updated_date: new Date(),
          user_created_notification: req['currentUser'],
          action: NOTIFICATION_ENUM.UNN_ALLOCATION,
        });
        await this.notificatioRepo.save(notification);
        return response.status(SERVICE_EXCEPTION.SUCCESS_RESPONSE).send({
          successMessage:
            user.allocated_user.user_name + ' unallocated successfully',
          statusCode: ErrorStatus.SUCCESS,
        });
      } else {
        return response
          .status(SERVICE_EXCEPTION.UN_AUTHORIZED)
          .send({ errorMessage: 'Unauthorized access', statusCode: 399 });
      }
    } catch (error) {
      this.logger.error(
        'un allocated a user from project in project service  , ' + error,
      );

      return response
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }

  async getUnAllocatedUsers(project_id, req: Request, response: Response) {
    try {
      let project = await this.projectRepository.findOne({
        where: { project_id, status: STATUS.ACTIVE },
      });
      if (!project) {
        return response
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('project not found'));
      }
      let roleAccess = await this.projectResourceAllocationRepository.findOne({
        relations: ['role'],
        where: {
          project_id_resource_alloc: project,
          allocated_user: req['currentUser'],
          allocation_status: ALLOCATION_STATUS.ALLOCATED,
        },
      });
      if (roleAccess) {
        if (
          roleAccess.role.role_id == ProjectRole.PROJECT_ADMIN ||
          roleAccess.role.role_id == ProjectRole.PROJECT_MANAGER
        ) {
          let allocatedUserArray = [];
          let userData = [];
          let allocatedUsers =
            await this.projectResourceAllocationRepository.find({
              relations: ['allocated_user'],
              where: {
                project_id_resource_alloc: project,
                allocation_status: ALLOCATION_STATUS.ALLOCATED,
                status: STATUS.ACTIVE,
              },
            });
          await Promise.all(
            allocatedUsers.map(async (user) => {
              allocatedUserArray.push(user.allocated_user.user_id);
            }),
          );
          let unallocatedUsers = await this.userRepo.find({
            where: { status: STATUS.ACTIVE },
          });
          for (let user in unallocatedUsers) {
            if (!allocatedUserArray.includes(unallocatedUsers[user].user_id)) {
              userData.push(unallocatedUsers[user]);
            }
          }
          const sortedList = [...userData].sort((a, b) =>
            a.user_name.localeCompare(b.user_name),
          );

          return response
            .status(SERVICE_EXCEPTION.SUCCESS_RESPONSE)
            .send(sortedList);
        } else {
          return response
            .status(SERVICE_EXCEPTION.UN_AUTHORIZED)
            .send({ errorMessage: 'Unauthorized access', statusCode: 399 });
        }
      } else {
        return response
          .status(SERVICE_EXCEPTION.UN_AUTHORIZED)
          .send({ errorMessage: 'Unauthorized access', statusCode: 399 });
      }
    } catch (error) {
      this.logger.error('getUnAllocatedUsers in project service  , ' + error);
      return response
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }

  async getUserProjectRole(
    project_id: number,
    req: Request,
    response: Response,
  ) {
    try {
      let project = await this.projectRepository.find({
        where: { project_id, status: STATUS.ACTIVE },
      });
      if (project[0]) {
        let user = req['currentUser'];
        let allocation = await this.projectResourceAllocationRepository
          .createQueryBuilder('allocation')
          .leftJoinAndSelect('allocation.role', 'project_role')
          .where('allocation.project_id = :project_id', {
            project_id: project_id,
          })
          .andWhere('allocation.user_id = :user_id', { user_id: user.user_id })
          .andWhere('allocation.project_id = :project_id', {
            project_id: project_id,
          })
          .andWhere('allocation.allocation_status = :allocation_status', {
            allocation_status: ALLOCATION_STATUS.ALLOCATED,
          })
          .getOne();
        if (allocation) {
          return response
            .status(SERVICE_EXCEPTION.SUCCESS_RESPONSE)
            .send({ project_role: allocation.role.role_id });
        } else {
          return response.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
            errorMessage: 'User is not allocated to this project',
            errorCode: 240,
          });
        }
      } else {
        return response
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('project not found'));
      }
    } catch (error) {
      this.logger.error('get project role in project service  , ' + error);
      return response
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }

  // Pin a project
  async pinProject(
    pinProject: PinProjectDto,
    req: Request,
    response: Response,
  ) {
    try {
      let project = await this.projectRepository.findOne({
        where: { project_id: pinProject.project_id, status: STATUS.ACTIVE },
      });
      if (!project) {
        return response
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('project not found'));
      }
      let partOfProject =
        await this.projectResourceAllocationRepository.findOne({
          where: {
            project_id_resource_alloc: project,
            allocated_user: req['currentUser'],
            allocation_status: ALLOCATION_STATUS.ALLOCATED,
          },
        });
      if (!partOfProject) {
        return response
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('project not found'));
      }

      if (partOfProject.pin_status == PIN_STATUS.PIN) {
        return this.pinProjectPinnedSub(partOfProject, req, response);
      } else {
        let order = 1;
        let pinnedProject = await this.projectResourceAllocationRepository.find(
          {
            order: { pin_order: 'DESC' },
            where: {
              allocated_user: req['currentUser'],
              pin_status: PIN_STATUS.PIN,
              status: STATUS.ACTIVE,
              allocation_status: ALLOCATION_STATUS.ALLOCATED,
            },
          },
        );
        this.logger.debug(
          'Pin project: Took pinned projects, Length is ' +
            pinnedProject.length +
            ', User: ' +
            req['currentUser'].user_name,
        );
        if (pinnedProject.length > 0) {
          let lastOrder = pinnedProject[0].pin_order;
          order = lastOrder + 1;
          this.logger.debug(
            'Pin project: New project pinned and order is fixed, User: ' +
              req['currentUser'].user_name,
          );
        }
        partOfProject.pin_status = PIN_STATUS.PIN;
        partOfProject.pin_order = order;
        let newPinnedProject =
          await this.projectResourceAllocationRepository.save(partOfProject);
        if (newPinnedProject) {
          this.logger.debug(
            'Pin project: New project pinned, User: ' +
              req['currentUser'].user_name,
          );
          return response.status(SERVICE_EXCEPTION.SUCCESS_RESPONSE).send({
            successMessage: 'Project pinned successfully',
            statusCode: 200,
          });
        }
      }
    } catch (error) {
      this.logger.error('Pin project  , ' + error);
      return response
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }

  async pinProjectPinnedSub(
    partOfProject: any,
    req: Request,
    response: Response,
  ) {
    if (partOfProject.pin_status == PIN_STATUS.PIN) {
      this.logger.debug(
        'Pin project: Project is pinned already, User: ' +
          req['currentUser'].user_name,
      );
      partOfProject.pin_status = PIN_STATUS.UNPIN;
      partOfProject.pin_order = 0;
      await this.projectResourceAllocationRepository.save(partOfProject);
      this.logger.debug(
        'Pin project: Project unpinned, User: ' + req['currentUser'].user_name,
      );
      let pinnedProject = await this.projectResourceAllocationRepository.find({
        order: { pin_order: 'ASC' },
        where: {
          allocated_user: req['currentUser'],
          pin_status: PIN_STATUS.PIN,
          status: STATUS.ACTIVE,
          allocation_status: ALLOCATION_STATUS.ALLOCATED,
        },
      });
      let order = 1;
      for (const value of pinnedProject) {
        value.pin_order = order;
        await this.projectResourceAllocationRepository.save(value);
        order = order + 1;
      }
      this.logger.debug(
        'Pin project: Re ordered pinned project, User: ' +
          req['currentUser'].user_name,
      );
      return response.status(SERVICE_EXCEPTION.SUCCESS_RESPONSE).send({
        successMessage: 'Project unpinned successfully',
        statusCode: 201,
      });
    }
  }

  //project member list search and role filter(old api name- allocatedUsersList)
  async getProjectMemberList(project_id, req: Request, res: Response) {
    let searchKey: any;
    try {
      let roleFilter = req.body.roleFilter;
      let user = req['currentUser'];

      if (roleFilter) {
        if (typeof roleFilter != typeof 1) {
          return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
            errorMessage: 'Accepts data in type number only',
            statusCode: 2515,
          });
        }
      }
      if (req.query.searchKey) {
        searchKey =
          req.query.searchKey.toString().trim().replace(/[_+%]/g, '\\$&') || '';
      }
      const activeRole = await this.roleRepo
        .createQueryBuilder('role')
        .orderBy('role.role_id', 'DESC')
        .where('role.status = :status', {
          status: STATUS.ACTIVE,
        })
        .getOne();

      if (activeRole.role_id < roleFilter) {
        return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage: 'Project_Role not found',
          statusCode: 648,
        });
      }

      let roleExist = await this.roleRepo.findOne({
        where: { status: Status.ACTIVE, role_id: roleFilter },
      });
      if (!roleExist) {
        return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage: 'Project_Role not found',
          statusCode: 648,
        });
      }
      let project = await this.projectRepository.findOne({
        where: { project_id: project_id, status: STATUS.ACTIVE },
      });
      if (!project) {
        return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage: 'project not found',
          statusCode: 50,
        });
      }
      let projectAlloc = await this.projectResourceAllocationRepository.findOne(
        {
          where: {
            allocated_user: user,
            project_id_resource_alloc: project,
            status: Status.ACTIVE,
            allocation_status: ALLOCATION_STATUS.ALLOCATED,
          },
        },
      );
      if (!projectAlloc && user.role.role_id != 1) {
        return res
          .status(SERVICE_EXCEPTION.UN_AUTHORIZED)
          .send({ errorMessage: 'Unauthorized access', statusCode: 399 });
      }
      return await this.subProjectMemberList(
        project_id,
        searchKey,
        roleFilter,
        roleExist,
        res,
        req,
      );
    } catch (error) {
      this.logger.error('project memberslist in project service  ,   ' + error);
      return res
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }
  //sub function project memberlist

  async subProjectMemberList(
    project_id,
    searchKey,
    roleFilter,
    roleExist,
    res,
    req,
  ) {
    let hasNext;
    let validateProjectMemberListPaginationRes =
      await this.validateProjectMemberListPagination(req);
    switch (validateProjectMemberListPaginationRes) {
      case 1:
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('invalid limit'));
      case 2:
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('invalid last data'));
      case 3:
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('invalid last id'));
      case 4:
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('last id missing'));
      case 5:
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('last data missing'));
      case 6:
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('no record exist on given data'));
      case 7:
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(
            new CustomValidation(
              'both page and last data or last id will not be accepted',
            ),
          );
      case 8:
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('invalid page'));
      case 9:
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('limit must not be greater than 3000'));
      default:
    }
    let lastData = req.query.last_data || null;
    const page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || null;
    let lastId = Number(req.query.last_id) || null;
    let startIndex = (page - 1) * limit;

    let offsetQuery = this.projectResourceAllocationRepository
      .createQueryBuilder('allocation')
      .addSelect('allocation.allocated_user', 'abcd')
      .leftJoinAndSelect('allocation.allocated_user', 'allocated_user')
      .leftJoinAndSelect('allocated_user.role', 'abcd')
      .leftJoinAndSelect('allocation.role', 'role')
      .where('allocation.status = :status', {
        status: STATUS.ACTIVE,
      })
      .andWhere('allocation.allocation_status = :allocation_status', {
        allocation_status: ALLOCATION_STATUS.ALLOCATED,
      })
      .andWhere('allocation.project_id = :project_id', {
        project_id: project_id,
      });

    let query = this.projectResourceAllocationRepository
      .createQueryBuilder('allocation')
      .addSelect('allocation.allocated_user', 'abcd')
      .leftJoinAndSelect('allocation.allocated_user', 'allocated_user')
      .leftJoinAndSelect('allocated_user.role', 'abcd')
      .leftJoinAndSelect('allocation.role', 'role')
      .where('allocation.status = :status', {
        status: STATUS.ACTIVE,
      })
      .andWhere('allocation.allocation_status = :allocation_status', {
        allocation_status: ALLOCATION_STATUS.ALLOCATED,
      })
      .andWhere('allocation.project_id = :project_id', {
        project_id: project_id,
      });

    if (searchKey) {
      query.andWhere('allocated_user.user_name LIKE:searchKey', {
        searchKey: `%${searchKey}%`,
      });
      offsetQuery.andWhere('allocated_user.user_name LIKE:searchKey', {
        searchKey: `%${searchKey}%`,
      });
    }

    if (roleFilter) {
      query.andWhere('allocation.role = :role', {
        role: roleExist.role_id,
      });
      offsetQuery.andWhere('allocation.role = :role', {
        role: roleExist.role_id,
      });
    }
    query
      .orderBy('allocated_user.user_name', 'ASC')
      .addOrderBy('allocated_user.user_id', 'DESC');
    offsetQuery
      .orderBy('allocated_user.user_name', 'ASC')
      .addOrderBy('allocated_user.user_id', 'DESC');

    let total = await query.getCount();
    if (!limit) {
      limit = total;
    }
    if (req.query.page) {
      if (startIndex > total) {
        startIndex = total + 1;
      }
      query.offset(startIndex).limit(limit);
      hasNext = total > limit + startIndex;
    } else if (lastData) {
      query
        .andWhere(
          '(allocated_user.user_name > :userName OR (allocated_user.user_name = :userName AND allocated_user.user_id < :userId))',
          { userName: lastData, userId: lastId },
        )
        .limit(limit);
    } else {
      query.offset(startIndex).limit(limit);
      hasNext = total > limit;
    }
    let result = await query.getMany();

    let listView = new AllocatedUsersList(result).userlist;
    const dataCount = Object.keys(listView).length;

    return res
      .status(SERVICE_EXCEPTION.SUCCESS_RESPONSE)
      .send({ total, dataCount, hasNext, listView });
  }

  async validateProjectMemberListPagination(req) {
    if (req.query.limit) {
      let limitPerPage = Number(req.query.limit);
      if (isNaN(limitPerPage) || !isInt(limitPerPage) || limitPerPage < 1) {
        return 1;
      }
      if (limitPerPage > 3000) {
        return 9;
      }
    }
    if (
      (req.query.page && req.query.last_data) ||
      (req.query.page && req.query.last_id)
    ) {
      return 7;
    }
    if (req.query.page) {
      let pageNo = Number(req.query.page);
      if (isNaN(pageNo) || !isInt(pageNo) || pageNo < 1) {
        return 8;
      }
    }

    return this.lastRecordExist(req);
  }

  async lastRecordExist(req) {
    if (req.query.last_data) {
      if (!isString(req.query.last_data)) {
        return 2;
      }
    }
    if (req.query.last_id) {
      let lastDataId = Number(req.query.last_id);
      if (isNaN(lastDataId) || !isInt(lastDataId)) {
        return 3;
      }
    }
    if (req.query.last_data && !req.query.last_id) {
      return 4;
    } else if (req.query.last_id && !req.query.last_data) {
      return 5;
    } else if (!req.query.last_data && !req.query.last_id) {
      return;
    }
    let offsetQueryValidate = this.projectResourceAllocationRepository
      .createQueryBuilder('allocation')
      .addSelect('allocation.allocated_user', 'abcd')
      .leftJoinAndSelect('allocation.allocated_user', 'allocated_user');
    let lastValue = await offsetQueryValidate
      .andWhere('allocated_user.user_name =:user_name', {
        user_name: req.query.last_data,
      })
      .andWhere('allocated_user.user_id =:user_id', {
        user_id: req.query.last_id,
      })
      .andWhere('allocation.allocation_status =:status', {
        status: ALLOCATION_STATUS.ALLOCATED,
      })
      .getOne();

    if (!lastValue) {
      return 6;
    }
  }
  async batchUpdateService(
    project_id: number,
    batchUpdateDto: BatchUpdateDto,
    req: Request,
    response: Response,
  ) {
    try {
      let _notFoundTask = new Array();
      let _taskExist = new Array();
      let _assignData = new Array();
      let _commentData = new Array();
      let statusData = new Array();

      let _projectExist = await this.projectRepository.findOne({
        where: {
          project_id: project_id,
          status: Status.ACTIVE,
        },
      });
      if (!_projectExist) {
        return response
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('project not found'));
      }
      this.logger.debug('inside the  project');
      let roleAccess = await this.projectResourceAllocationRepository.findOne({
        relations: ['role'],
        where: {
          project_id_resource_alloc: _projectExist,
          allocated_user: req['currentUser'],
          allocation_status: ALLOCATION_STATUS.ALLOCATED,
        },
      });
      let roleAccessArray = [
        ProjectRole.PROJECT_MANAGER,
        ProjectRole.PROJECT_ADMIN,
        ProjectRole.GUEST,
        ProjectRole.REPORTER,
        ProjectRole.DEVELOPER,
      ];
      if (!roleAccess || !roleAccessArray.includes(roleAccess.role.role_id)) {
        return response
          .status(SERVICE_EXCEPTION.UN_AUTHORIZED)
          .send({ errorMessage: 'Unauthorized access', statusCode: 399 });
      }

      if (batchUpdateDto.tasks.length < 1) {
        return response.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage: 'atleast one task requied',
          statusCode: 3513,
        });
      }
      this.logger.debug('in the role');

      await this.validateProjectInBatchUpdate(
        batchUpdateDto,
        _projectExist,
        _notFoundTask,
        _taskExist,
      );

      this.logger.debug('inside task valid?');

      if (_notFoundTask.length > 0) {
        return response.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage: _notFoundTask + ' not found',
          statusCode: 777,
        });
      }
      if (batchUpdateDto.assigne) {
        let value = await this.assigneValid(
          batchUpdateDto,
          _projectExist,
          _assignData,
        );

        if (value == 1) {
          return response
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('user not found'));
        }
      }

      await this.validateStatusAndComment(
        batchUpdateDto,
        _commentData,
        statusData,
      );

      let success = await Promise.all(
        _taskExist.map(async (task) => {
          let _task_History = this.taskHistoryRepo.create({
            status: STATUS.ACTIVE,
            task_id: task,
            task_history_status: STATUS.ACTIVE,
            action: TASK_HISTORY_ACTION.UPDATE_TASK,
            created_date: new Date(),
            updated_date: new Date(),
            created_by_history: req['currentUser'],
            updated_by_history: req['currentUser'],
            task_history: _projectExist,
            task_name: task.task_name,
            task_description: task.task_description,
            task_created_date: task.created_date,
            history_type: HISTORY_TYPE.TASK_HISTORY,
          });

          await this.validateSuccessBatchUpdate(
            task,
            _task_History,
            _projectExist,
            req,
            _assignData,
            _commentData,
            statusData,
          );
        }),
      );
      if (
        statusData.length == 0 &&
        _commentData.length == 0 &&
        _assignData.length == 0
      ) {
        return response
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('no change in data'));
      }
      if (success) {
        return response.status(SERVICE_EXCEPTION.SUCCESS_RESPONSE).send({
          statusCode: 200,
          successMessage: 'batch update successfully',
        });
      }
    } catch (error) {
      this.logger.error('batchUpdate in task service  ,   ' + error);
      return response
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }
  async validateSuccessBatchUpdate(
    task,
    _task_History,
    _projectExist,
    req: Request,
    _assignData,
    _commentData,
    statusData,
  ) {
    if (_assignData.length > 0) {
      task.assignee = _assignData[0];
      _task_History.new_assignee_history = _assignData[0];
    }

    if (_commentData.length > 0) {
      let _comment = this.taskHistoryRepo.create({
        comment: _commentData[0],
        status: STATUS.ACTIVE,
        task_id: task,
        task_history_status: STATUS.ACTIVE,
        action: TASK_HISTORY_ACTION.COMMENT,
        created_date: new Date(),
        updated_date: new Date(),
        created_by_history: req['currentUser'],
        updated_by_history: req['currentUser'],
        task_history: _projectExist,
        task_name: task.task_name,
        task_description: task.task_description,
        task_created_date: task.created_date,
        history_type: HISTORY_TYPE.TASK_HISTORY,
      });
      await this.taskHistoryRepo.save(_comment);
    }

    if (statusData.length > 0) {
      task.task_status = statusData[0];
      _task_History.new_task_status = statusData[0];
    }

    if (statusData.length > 0 || _assignData.length > 0) {
      await this.taskRepo.save(task);
      await this.taskHistoryRepo.save(_task_History);
    }
  }
  async validateProjectInBatchUpdate(
    batchUpdateDto,
    _projectExist,
    _notFoundTask,
    _taskExist,
  ) {
    await Promise.all(
      batchUpdateDto.tasks.map(async (task) => {
        this.logger.debug('inside the array of tasks');

        let _taskExists = await this.taskRepo
          .createQueryBuilder('task')
          .where('task.task_id =:task_id', { task_id: task })
          .andWhere('task.status =:status', { status: STATUS.ACTIVE })
          .andWhere('task.project_id =:project_id', {
            project_id: _projectExist.project_id,
          })
          .getOne();

        this.logger.debug('inside loop of the task');
        if (!_taskExists) {
          _notFoundTask.push(task);
        } else {
          _taskExist.push(_taskExists);
        }
      }),
    );
  }
  async validateStatusAndComment(batchUpdateDto, _commentData, statusData) {
    if (batchUpdateDto.comment) {
      _commentData.push(batchUpdateDto.comment);
    }

    if (batchUpdateDto.status) {
      if (Number(batchUpdateDto.status) > 0) {
        statusData.push(batchUpdateDto.status);
      }
    }
  }
  async assigneValid(batchUpdateDto, _projectExist, _assignData) {
    if (Number(batchUpdateDto.assigne) > 0) {
      let userExists = await this.userRepo.findOne({
        where: {
          user_id: batchUpdateDto.assigne,
          status: Status.ACTIVE,
        },
      });
      if (!userExists) {
        return 1;
      }
      let assignExist = await this.projectResourceAllocationRepository.findOne({
        relations: ['allocated_user'],
        where: {
          project_id_resource_alloc: _projectExist,
          allocated_user: userExists,
          allocation_status: ALLOCATION_STATUS.ALLOCATED,
          status: STATUS.ACTIVE,
        },
      });
      if (!assignExist) {
        return 1;
      } else {
        _assignData.push(assignExist.allocated_user);
      }
    }
  }
  async editAllocateUserService(
    project_id: number,
    editAllocateUserDto: EditAllocateUserDto,
    req: Request,
    response: Response,
  ) {
    try {
      let validateRoleUserId = await this.ValidateUserRole(editAllocateUserDto);
      switch (validateRoleUserId) {
        case 1:
          return response.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
            errorMessage: 'user-id is must be number',
            statusCode: 3574,
          });
        case 2:
          return response.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
            errorMessage: 'role must be number',
            statusCode: 93,
          });

        default:
      }
      let _projectExist = await this.projectRepository.findOne({
        where: {
          project_id: project_id,
          status: Status.ACTIVE,
        },
      });

      if (!_projectExist) {
        return response
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('project not found'));
      }
      this.logger.debug('inside the  project');
      let roleAccess = await this.projectResourceAllocationRepository.findOne({
        relations: ['role'],
        where: {
          project_id_resource_alloc: _projectExist,
          allocated_user: req['currentUser'],
          allocation_status: ALLOCATION_STATUS.ALLOCATED,
        },
      });
      let roleArr = [ProjectRole.PROJECT_MANAGER, ProjectRole.PROJECT_ADMIN];

      if (!roleAccess || !roleArr.includes(roleAccess.role.role_id)) {
        return response
          .status(SERVICE_EXCEPTION.UN_AUTHORIZED)
          .send({ errorMessage: 'Unauthorized access', statusCode: 399 });
      }

      let userExist = await this.userRepo.findOne({
        where: {
          user_id: editAllocateUserDto.user_id,
          status: Status.ACTIVE,
        },
      });
      if (!userExist) {
        return response
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('user not found'));
      }
      let ProjectUserExists =
        await this.projectResourceAllocationRepository.findOne({
          relations: ['role'],
          where: {
            project_id_resource_alloc: _projectExist,
            allocated_user: userExist,
            allocation_status: STATUS.ACTIVE,
            status: STATUS.ACTIVE,
          },
        });
      this.logger.debug(
        '111111111111111111111111111111111111111111111111111111111111',
      );
      let value1 = await this.validRole(ProjectUserExists, editAllocateUserDto);
      switch (value1) {
        case 1:
          return response
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('user not found'));
        case 2:
          return response.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
            errorMessage: 'There is no change ',
            statusCode: 1110,
          });

        default:
      }

      let adminAccess = [
        ProjectRole.PROJECT_MANAGER,
        ProjectRole.REPORTER,
        ProjectRole.GUEST,
        ProjectRole.DEVELOPER,
        ProjectRole.PROJECT_ADMIN,
      ];
      let managerAccess = [
        ProjectRole.PROJECT_MANAGER,
        ProjectRole.REPORTER,
        ProjectRole.GUEST,
        ProjectRole.DEVELOPER,
      ];

      if (editAllocateUserDto.role.toString().length > 0) {
        let value = await this.validateRole(
          ProjectUserExists,
          editAllocateUserDto,
          roleAccess,
          adminAccess,
          managerAccess,
        );

        if (value == 1) {
          return response
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('role not found'));
        } else {
          ProjectUserExists.role = value.role;
          ProjectUserExists.updated_date = value.updated_date;
        }
      }

      if (editAllocateUserDto.end_date.toString().length > 0) {
        this.logger.debug('6666666666666666666666666666');
        let endDate = new Date(editAllocateUserDto.end_date);
        let validateDateEditAllocatedUser =
          await this.validateDateEditAllocateUser(
            editAllocateUserDto,
            endDate,
            _projectExist,
          );
        switch (validateDateEditAllocatedUser) {
          case 1:
            return response.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
              errorMessage: 'Invalid end date',
              statusCode: 3002,
            });
          case 2:
            return response.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
              errorMessage:
                'End date must not be lesser than project start date',
              statusCode: 3574,
            });
          case 3:
            return response.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
              errorMessage:
                'End date must not be greater than project end date',
              statusCode: 3520,
            });

          default:
        }

        ProjectUserExists.to_date = endDate;
        ProjectUserExists.updated_date = new Date();
      }

      this.logger.debug('qqqqqqqqqqqqqqqqqqqqqqq');
      let editAllocate = await this.projectResourceAllocationRepository.save(
        ProjectUserExists,
      );

      if (editAllocate) {
        return response.status(SERVICE_EXCEPTION.SUCCESS_RESPONSE).send({
          successMessage: 'updated successfully',
          statusCode: 200,
        });
      }
    } catch (error) {
      this.logger.error('edit allocation project service  ,   ' + error);
      return response
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }
  async validRole(ProjectUserExists, editAllocateUserDto) {
    if (!ProjectUserExists) {
      this.logger.debug('i22222222222222222222222222t');
      return 1;
    }
    if (
      ProjectUserExists.role.role_id == editAllocateUserDto.role &&
      ProjectUserExists.to_date == editAllocateUserDto.end_date
    ) {
      this.logger.debug('333333333333333333333333333333');
      return 2;
    }
  }
  async validateRole(
    ProjectUserExists: any,
    editAllocateUserDto: any,
    roleAccess: any,
    adminAccess: any,
    managerAccess: any,
  ) {
    if (ProjectUserExists.role.role_id != editAllocateUserDto.role) {
      if (roleAccess.role.role_id == ProjectRole.PROJECT_ADMIN) {
        if (adminAccess.includes(Number(editAllocateUserDto.role))) {
          let role = await this.roleRepo.findOne({
            where: {
              role_id: editAllocateUserDto.role,
              status: Status.ACTIVE,
            },
          });
          ProjectUserExists.role = role;
          ProjectUserExists.updated_date = new Date();
          return ProjectUserExists;
        } else {
          return 1;
        }
      }
      if (roleAccess.role.role_id == ProjectRole.PROJECT_MANAGER) {
        if (managerAccess.includes(Number(editAllocateUserDto.role))) {
          let role = await this.roleRepo.findOne({
            where: {
              role_id: editAllocateUserDto.role,
              status: Status.ACTIVE,
            },
          });

          ProjectUserExists.role = role;
          ProjectUserExists.updated_date = new Date();
          return ProjectUserExists;
        } else {
          return 1;
        }
      }
    } else {
      return ProjectUserExists;
    }
  }
  async validateDateEditAllocateUser(
    editAllocateUserDto: any,
    endDate: any,
    _projectExist: any,
  ) {
    let endDateValidate = endDate.toISOString().slice(0, 10).toString();
    if (endDateValidate != editAllocateUserDto.end_date.toString()) {
      return 1;
    }
    let projectDate = new Date(_projectExist.start_date);
    let projectendDate = new Date(_projectExist.end_date);
    if (endDate < projectDate) {
      return 2;
    }
    if (endDate > projectendDate) {
      return 3;
    }
  }
  async ValidateUserRole(editAllocateUserDto: EditAllocateUserDto) {
    let numRegx = new RegExp(/^\d*$/);
    if (editAllocateUserDto.user_id) {
      if (typeof editAllocateUserDto.user_id == 'string') {
        if (!numRegx.test(editAllocateUserDto.user_id)) {
          return 1;
        }
      }
    }
    if (editAllocateUserDto.role) {
      if (typeof editAllocateUserDto.role == 'string') {
        if (!numRegx.test(editAllocateUserDto.role)) {
          return 2;
        }
      }
    }
  }
  async validateDate(date) {
    // this.logger.debug('validate' + date);
    // this.logger.debug(
    //   'validate date hit --- Date: ' + date + ' Time: ' + new Date(),
    // );

    let dateObject = new Date(date);
    let dateString = dateObject.toISOString().slice(0, 10).toString();
    if (date.toString() != dateString) {
      return false;
    } else {
      return true;
    }
  }
}
