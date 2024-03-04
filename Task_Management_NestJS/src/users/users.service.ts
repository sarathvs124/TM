import { TaskHistory } from './../Entity/Task_History';
import {
  GetUserView,
  MemberListLoop,
  TaskHistoryView,
  LoopAllocatedProjectView,
  ProfileImageView,
} from './../views/view';
import {
  STATUS,
  ALLOCATION_STATUS,
  NEW_USER_STATUS,
  ROLE_AUTHORITY,
  SERVICE_EXCEPTION,
  CHANGE_PASSWORD_STATUS,
  HISTORY_TYPE,
} from '../Enum/Enums.enum';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../Entity/User';
import { Repository } from 'typeorm';
import { ChangePasswordDetails, UserCreateDetails } from './user.type';
import * as bcrypt from 'bcrypt';
import { Status } from '../Entity/Status';
import { ErrorStatus } from '../ErrorStatus';
import { Request, Response } from 'express';
import { ProfileView } from '../views/view';
import { CustomValidation } from '../Util/custom-validation.schema';
import { UserEditCreateDto } from './user.dto';

import { Roles } from '../Entity/Roles';
import { ProjectResourceAllocation } from '../Entity/Project_resource_allocation';
import { pager } from '../Pager/pager';
import { MailerService } from '@nestjs-modules/mailer';
import { Env } from '../environment';
import { Project } from '../Entity/Project';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ProjectRole, Role } from '../Enum/Role.enum';
import * as fs from 'fs';
import { isInt, isString } from 'class-validator';
let currentDate = (new Date().valueOf() / 1000).toString();
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Roles) private roleRepository: Repository<Roles>,
    @InjectRepository(Project) private projectRepo: Repository<Project>,
    @InjectRepository(ProjectResourceAllocation)
    private projectResourceAllocationRepository: Repository<ProjectResourceAllocation>,
    private mailService: MailerService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectRepository(TaskHistory) private taskHistory: Repository<TaskHistory>,
  ) {}

  async addUserService(
    usersDetails: UserCreateDetails,
    req: Request,
    response: Response,
  ) {
    try {
      if (
        !usersDetails.user_name.match(
          /^(?! )(?!\s)(?!.* {2})[\s\S]*(?<!\s)(?! )$/,
        )
      ) {
        return response.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage:
            'user name must contain only alphabet,numbers and single space',
          statusCode: 1602,
        });
      }

      let userAlreadyExists = await this.userRepository.findOne({
        where: { email: usersDetails.email, status: Status.ACTIVE },
      });
      if (userAlreadyExists) {
        return response.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage: 'email already exists',
          statusCode: ErrorStatus.EMAIL_ALREADY_EXIST,
        });
      } else {
        let role = await this.roleRepository.findOne({
          where: {
            role_id: usersDetails.role,
            authority: ROLE_AUTHORITY.TOP_LEVEL,
          },
        });
        if (!role) {
          let responseObject = new CustomValidation('role not found');
          return response
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(responseObject);
        } else {
          const salt = await bcrypt.genSalt(10);
          let email = usersDetails.email;
          let SimplePassword =
            email.charAt(0).toUpperCase() + email.slice(1, 5) + '@In01';
          const hashedPassword = await bcrypt.hash(SimplePassword, salt);
          const newUser = this.userRepository.create({
            user_name: usersDetails.user_name.trim(),
            email: usersDetails.email,
            role: role,
            password: hashedPassword,
            created_date: new Date(),
            updated_date: new Date(),
            status: Status.ACTIVE,
            new_user: NEW_USER_STATUS.NEWBIE,
          });
          const saved = await this.userRepository.save(newUser);

          if (saved) {
            if (saved.role.role_id == 1) {
              await this.addUserSubService(saved, req);
            }
          }
          return response.status(SERVICE_EXCEPTION.SUCCESS_RESPONSE).send({
            successMessage: 'User Added',
            statusCode: ErrorStatus.SUCCESS,
          });
        }
      }
    } catch (error) {
      this.logger.error('add users , ' + error);
      return response
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }
  async addUserSubService(saved: any, req: Request) {
    let projectAdmin = await this.roleRepository.findOne({
      where: { role_id: 3 },
    });
    let projects = await this.projectRepo.find({
      where: { status: STATUS.ACTIVE },
    });
    Promise.all(
      projects.map(async (value) => {
        await this.projectResourceAllocationRepository.save(
          this.projectResourceAllocationRepository.create({
            from_date: new Date(value.start_date),
            to_date: new Date(value.end_date),
            allocation_status: ALLOCATION_STATUS.ALLOCATED,
            status: STATUS.ACTIVE,
            created_date: new Date(),
            updated_date: new Date(),
            project_id_resource_alloc: value,
            allocated_user: saved,
            role: projectAdmin,
            allocation_assigned_by: req['currentUser'],
            pin_order: 0,
            pin_status: 0,
          }),
        );
        saved.active_projects = saved.active_projects + 1;
        this.userRepository.save(saved);
      }),
    );
    // await this.mailService.sendMail({
    //   to: saved.email,
    //   from: 'taskmanagementdev@gmail.com',
    //   subject: 'Your login credentials to access Task Management',
    //   text: 'xxxxxxxxxxxx',
    //   template: 'sample',
    //   context: {
    //     sample: {},
    //   },
    // });
  }

  async changePasswordService(
    userDetails: ChangePasswordDetails,
    req: Request,
    response: Response,
  ) {
    try {
      const currentUser = req['currentUser'];

      if (userDetails.old_password === userDetails.new_password) {
        return response

          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('New and old password cannot be same'));
      } else {
        if (
          !(await bcrypt.compare(
            userDetails.old_password,
            currentUser.password,
          ))
        ) {
          return response
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(
              new CustomValidation('Password doesnt match with old password'),
            );
        } else if (
          await bcrypt.compare(userDetails.new_password, currentUser.password)
        ) {
          {
            return response
              .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
              .send(
                new CustomValidation('New and old password cannot be same'),
              );
          }
        } else {
          const hashedPassword = await bcrypt.hash(
            userDetails.new_password,
            10,
          );
          await this.userRepository.update(
            { user_id: currentUser.user_id },
            {
              password: hashedPassword,
              change_password_status: CHANGE_PASSWORD_STATUS.PASSWORD_CHANGED,
            },
          );
          return response.status(SERVICE_EXCEPTION.SUCCESS_RESPONSE).send({
            successMessage: 'Password Changed',
            statusCode: ErrorStatus.SUCCESS,
          });
        }
      }
    } catch (error) {
      this.logger.error('change password , ' + error);
      return response
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }
  async editUserService(
    id: number,
    userEditDto: UserEditCreateDto,
    req: Request,
    response: Response,
  ) {
    try {
      if (
        !userEditDto.user_name.match(
          /^(?! )(?!\s)(?!.* {2})[\s\S]*(?<!\s)(?! )$/,
        )
      ) {
        return response.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage:
            'user name must contain only alphabet,numbers and single space',
          statusCode: 1602,
        });
      }

      let role = await this.roleRepository.findOne({
        where: {
          role_id: Number(userEditDto.role),
          authority: ROLE_AUTHORITY.TOP_LEVEL,
        },
      });

      let admin = await this.roleRepository.findOne({
        where: {
          role_id: ProjectRole.PROJECT_ADMIN,
        },
      });
      if (!role) {
        return response
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('role not found'));
      }
      let userExist = await this.userRepository.findOne({
        relations: ['role'],
        where: {
          user_id: id,
          status: STATUS.ACTIVE,
        },
      });

      let user = Object.assign({}, userExist);

      if (!userExist) {
        return response
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('user not found'));
      }

      let email = userExist.email;
      if (
        userEditDto.email.toLowerCase() == userExist.email &&
        userEditDto.user_name == userExist.user_name &&
        userExist.role.role_id == Number(userEditDto.role)
      ) {
        return response.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage: 'no changes made',
          statusCode: 1050,
        });
      }
      let emailExist = await this.userRepository.findOne({
        where: {
          email: userEditDto.email.toLowerCase(),
          status: STATUS.ACTIVE,
        },
      });
      let roleAndId = [id, role];
      if (emailExist) {
        return await this.subServiceEmailExist(
          userExist,
          userEditDto,
          user,
          req,
          admin,
          response,
          roleAndId,
        );
      } else {
        let roleAndIds = [id, email, role];
        return await this.subServiceNewEmail(
          roleAndIds,
          userEditDto,
          user,
          admin,
          req,
          response,
        );
      }
    } catch (error) {
      this.logger.error('edit user by id , ' + error);

      return response
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }
  async subServiceNewEmail(
    roleAndId: any,
    userEditDto: UserEditCreateDto,
    user: any,
    admin: any,
    req: any,
    response: Response,
  ) {
    let email = roleAndId[1];
    let id = roleAndId[0];
    let role = roleAndId[2];
    let email_exist = email;

    if (user.role.role_id == Number(userEditDto.role)) {
      await this.userRepository.update(
        { user_id: id },
        {
          user_name: userEditDto.user_name.trim(),
          email: userEditDto.email.toLowerCase(),
          role: role,
        },
      );

      await this.loginAndNewUserEmailUpdateService(
        userEditDto,
        email_exist,
        role,
      );

      return response.status(SERVICE_EXCEPTION.SUCCESS_RESPONSE).send({
        successMessage: 'User Updated Successfully',
        statusCode: ErrorStatus.SUCCESS,
      });
    } else {
      await this.userRepository.update(
        { user_id: id },
        {
          user_name: userEditDto.user_name.trim(),
          email: userEditDto.email.toLowerCase(),
          role: role,
        },
      );

      let userExist = await this.userRepository.findOne({
        relations: ['role'],
        where: { user_id: id },
      });

      switch (Number(userExist.role.role_id)) {
        case Role.ADMIN: {
          await this.EditEmailAdminRoleSubService(
            userExist,
            admin,
            req,
            userEditDto,
            email_exist,
          );
          break;
        }

        case Role.USER: {
          let projectList = await this.projectResourceAllocationRepository.find(
            {
              where: {
                role: admin,
                allocated_user: userExist,
                allocation_status: ALLOCATION_STATUS.ALLOCATED,
                status: STATUS.ACTIVE,
              },
            },
          );

          if (projectList.length > 0) {
            await Promise.all(
              projectList.map(async (project) => {
                project.allocation_status = ALLOCATION_STATUS.UNALLOCATED;
                project.status = STATUS.INACTIVE;
                project.pin_order = 0;
                project.pin_status = 0;
                await this.projectResourceAllocationRepository.save(project);
              }),
            );
            userExist.active_projects = 0;
            await this.loginAndNewUserEmailService(
              userEditDto,
              email_exist,
              userExist,
            );

            await this.userRepository.save(userExist);
          }
          break;
        }

        default:
      }

      return response.status(SERVICE_EXCEPTION.SUCCESS_RESPONSE).send({
        successMessage: 'User Updated Successfully',
        statusCode: ErrorStatus.SUCCESS,
      });
    }
  }
  async subServiceEmailExist(
    userExist: any,
    userEditDto: UserEditCreateDto,
    user: any,
    req: Request,
    admin: any,
    response: Response,
    roleAndId: any,
  ) {
    let id = roleAndId[0];
    let role = roleAndId[1];
    this.logger.debug('1234567890');

    if (userExist.email == userEditDto.email.toLowerCase()) {
      if (user.role.role_id == Number(userEditDto.role)) {
        await this.userRepository.update(
          { user_id: id },
          {
            user_name: userEditDto.user_name.trim(),
            email: userEditDto.email,
            role: role,
          },
        );
        await this.UpdateUserMail(userEditDto, userExist);
      } else {
        this.logger.debug('1');
        await this.userRepository.update(
          { user_id: id },
          {
            user_name: userEditDto.user_name.trim(),
            email: userEditDto.email.toLowerCase(),
            role: role,
          },
        );

        let newUser = await this.userRepository.findOne({
          relations: ['role'],
          where: { user_id: id },
        });

        if (newUser.role.role_id == Role.ADMIN) {
          await this.EditAdminRoleSubService(userEditDto, newUser, admin, req);
        } else if (newUser.role.role_id == Role.USER) {
          await this.EditUserRoleSubService(newUser, userEditDto);
        }
      }
      return response.status(SERVICE_EXCEPTION.SUCCESS_RESPONSE).send({
        successMessage: 'User Updated Successfully',
        statusCode: ErrorStatus.SUCCESS,
      });
    } else
      return response
        .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
        .send(new CustomValidation('email already exists'));
  }
  async EditEmailAdminRoleSubService(
    userExist: any,
    admin: any,
    req: Request,
    userEditDto: UserEditCreateDto,
    email_exist: any,
  ) {
    let projectList = await this.projectRepo.find({
      where: { status: STATUS.ACTIVE },
    });
    let UserExistinAllocatedProject =
      await this.projectResourceAllocationRepository.find({
        where: {
          allocated_user: userExist,
        },
      });
    if (UserExistinAllocatedProject.length == 0) {
      await Promise.all(
        projectList.map(async (project) => {
          await this.allocateAdminInEditRole(project, userExist, req, admin);
        }),
      );
    } else {
      await Promise.all(
        UserExistinAllocatedProject.map(async (allocated) => {
          allocated.allocation_status = ALLOCATION_STATUS.UNALLOCATED;
          allocated.status = STATUS.INACTIVE;
          allocated.pin_order = 0;
          allocated.pin_status = 0;
          this.projectResourceAllocationRepository.save(allocated);
        }),
      );
      //
      await Promise.all(
        projectList.map(async (project) => {
          await this.allocateAdminInEditRole(project, userExist, req, admin);
        }),
      );
    }

    let count = projectList.length;
    await this.loginAndNewUserEmailService(userEditDto, email_exist, userExist);
    userExist.active_projects = count;

    await this.userRepository.save(userExist);
  }

  async allocateAdminInEditRole(project, userExist, req, admin) {
    let projectNewAllocated = this.projectResourceAllocationRepository.create({
      project_id_resource_alloc: project,
      allocated_user: userExist,
      allocation_status: ALLOCATION_STATUS.ALLOCATED,
      from_date: project.start_date,
      to_date: project.end_date,
      status: Status.ACTIVE,
      allocation_assigned_by: req['currentUser'],
      role: admin,
      created_date: new Date(),
      updated_date: new Date(),
      pin_order: 0,
      pin_status: 0,
    });
    this.projectResourceAllocationRepository.save(projectNewAllocated);
  }

  async EditUserRoleSubService(newUser: any, userEditDto: UserEditCreateDto) {
    let projectList = await this.projectResourceAllocationRepository.find({
      where: {
        allocated_user: newUser,
        allocation_status: ALLOCATION_STATUS.ALLOCATED,
        status: STATUS.ACTIVE,
      },
    });

    if (projectList.length > 0) {
      await Promise.all(
        projectList.map(async (projectObject) => {
          projectObject.allocation_status = ALLOCATION_STATUS.UNALLOCATED;
          projectObject.status = STATUS.INACTIVE;
          projectObject.pin_order = 0;
          projectObject.pin_status = 0;
          await this.projectResourceAllocationRepository.save(projectObject);
        }),
      );
      newUser.active_projects = 0;
      // await this.mailService.sendMail({
      //   to: userEditDto.email.toLowerCase(),
      //   from: 'taskmanagementdev@gmail.com',
      //   subject: 'Your new updated user details',
      //   text: 'xxxxxxxxxxxx',
      //   template: 'updated_user',
      //   context: {
      //     user_details: {
      //       user_name: userEditDto.user_name,
      //       email: userEditDto.email.toLowerCase(),
      //       role: newUser.role.role_name,
      //     },
      //   },
      // });
      await this.userRepository.save(newUser);
    }
  }
  async EditAdminRoleSubService(
    userEditDto: UserEditCreateDto,
    newUser: any,
    admin: any,
    req: Request,
  ) {
    let projectList = await this.projectRepo.find({
      where: { status: STATUS.ACTIVE },
    });
    let alloactedListnewUser =
      await this.projectResourceAllocationRepository.find({
        where: { allocated_user: newUser },
      });

    if (alloactedListnewUser.length == 0) {
      await Promise.all(
        projectList.map(async (projObj) => {
          let projectNewAllocated =
            this.projectResourceAllocationRepository.create({
              project_id_resource_alloc: projObj,
              allocated_user: newUser,
              allocation_status: ALLOCATION_STATUS.ALLOCATED,
              from_date: projObj.start_date,
              to_date: projObj.end_date,
              status: Status.ACTIVE,
              allocation_assigned_by: req['currentUser'],
              role: admin,
              created_date: new Date(),
              updated_date: new Date(),
              pin_order: 0,
              pin_status: 0,
            });
          this.projectResourceAllocationRepository.save(projectNewAllocated);
        }),
      );
      let count = projectList.length;

      newUser.active_projects = count;
      // await this.mailService.sendMail({
      //   to: userEditDto.email.toLowerCase(),
      //   from: 'taskmanagementdev@gmail.com',
      //   subject: 'Your new updated user details',
      //   text: 'xxxxxxxxxxxx',
      //   template: 'updated_user',
      //   context: {
      //     user_details: {
      //       user_name: userEditDto.user_name,
      //       email: userEditDto.email.toLowerCase(),
      //       role: newUser.role.role_name,
      //     },
      //   },
      // });
      await this.userRepository.save(newUser);
    } else {
      await Promise.all(
        alloactedListnewUser.map(async (allocted) => {
          allocted.allocation_status = ALLOCATION_STATUS.UNALLOCATED;
          allocted.status = STATUS.INACTIVE;
          allocted.pin_order = 0;
          allocted.pin_status = 0;
          this.projectResourceAllocationRepository.save(allocted);
        }),
      );
      await Promise.all(
        projectList.map(async (project) => {
          let projectNewAllocated =
            this.projectResourceAllocationRepository.create({
              project_id_resource_alloc: project,
              allocated_user: newUser,
              allocation_status: ALLOCATION_STATUS.ALLOCATED,
              from_date: project.start_date,
              to_date: project.end_date,
              status: Status.ACTIVE,
              allocation_assigned_by: req['currentUser'],
              role: admin,
              created_date: new Date(),
              updated_date: new Date(),
              pin_order: 0,
              pin_status: 0,
            });
          this.projectResourceAllocationRepository.save(projectNewAllocated);
        }),
      );
      let count = projectList.length;
      newUser.active_projects = count;
      // await this.mailService.sendMail({
      //   to: userEditDto.email.toLowerCase(),
      //   from: 'taskmanagementdev@gmail.com',
      //   subject: 'Your new updated user details',
      //   text: 'xxxxxxxxxxxx',
      //   template: 'updated_user',
      //   context: {
      //     user_details: {
      //       user_name: userEditDto.user_name,
      //       email: userEditDto.email.toLowerCase(),
      //       role: newUser.role.role_name,
      //     },
      //   },
      // });

      await this.userRepository.save(newUser);
    }
  }
  async loginAndNewUserEmailUpdateService(
    userEditDto: UserEditCreateDto,
    email_exist: any,
    role: any,
  ) {
    // await this.mailService.sendMail({
    //   to: email_exist,
    //   from: 'taskmanagementdev@gmail.com',
    //   subject: 'Your new login credentials to access Task Management',
    //   text: 'xxxxxxxxxxxx',
    //   template: 'email_updated',
    //   context: {
    //     user_details: {
    //       email: userEditDto.email.toLowerCase(),
    //     },
    //   },
    // });
    // await this.mailService.sendMail({
    //   to: userEditDto.email.toLowerCase(),
    //   from: 'taskmanagementdev@gmail.com',
    //   subject: 'Your new login credentials to access Task Management',
    //   text: 'xxxxxxxxxxxx',
    //   template: 'updated_user',
    //   context: {
    //     user_details: {
    //       user_name: userEditDto.user_name,
    //       email: userEditDto.email.toLowerCase(),
    //       role: role.role_name,
    //     },
    //   },
    // });
  }
  async UpdateUserMail(userEditDto: UserEditCreateDto, userExist: any) {
    // await this.mailService.sendMail({
    //   to: userEditDto.email.toLowerCase(),
    //   from: 'taskmanagementdev@gmail.com',
    //   subject: 'Your new updated user details',
    //   text: 'xxxxxxxxxxxx',
    //   template: 'updated_user',
    //   context: {
    //     user_details: {
    //       user_name: userEditDto.user_name,
    //       email: userEditDto.email.toLowerCase(),
    //       role: userExist.role.role_name,
    //     },
    //   },
    // });
  }
  async loginAndNewUserEmailService(
    userEditDto: UserEditCreateDto,
    email_exist: any,
    userExist: any,
  ) {
    // await this.mailService.sendMail({
    //   to: email_exist,
    //   from: 'taskmanagementdev@gmail.com',
    //   subject: 'Your new login credentials to access Task Management',
    //   text: 'xxxxxxxxxxxx',
    //   template: 'email_updated',
    //   context: {
    //     user_details: {
    //       email: userEditDto.email.toLowerCase(),
    //     },
    //   },
    // });
    // await this.mailService.sendMail({
    //   to: userEditDto.email,
    //   from: 'taskmanagementdev@gmail.com',
    //   subject: 'Your new updated user details',
    //   text: 'xxxxxxxxxxxx',
    //   template: 'updated_user',
    //   context: {
    //     user_details: {
    //       user_name: userEditDto.user_name,
    //       email: userEditDto.email.toLowerCase(),
    //       role: userExist.role.role_name,
    //     },
    //   },
    // });
  }
  async deleteUserService(id: number, req: Request, response: Response) {
    try {
      let currentUser = req['currentUser'];
      let isUserExist = await this.userRepository.findOne({
        where: { user_id: id, status: Status.ACTIVE },
      });
      if (isUserExist) {
        let isUserAllocated =
          await this.projectResourceAllocationRepository.find({
            where: {
              allocated_user: isUserExist,
              allocation_status: Status.ACTIVE,
            },
          });

        if (isUserAllocated.length > 0) {
          return response
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('user already allocated to project'));
        } else {
          if (isUserExist.user_id == currentUser.user_id) {
            return response
              .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
              .send(new CustomValidation('cannot delete by yourself'));
          } else {
            await this.userRepository.update(
              { user_id: isUserExist.user_id },
              {
                status: Status.INACTIVE,
                updated_date: new Date(),
                email: currentDate,
              },
            );
            await this.projectResourceAllocationRepository.update(
              { allocated_user: isUserExist },
              {
                status: STATUS.INACTIVE,
                allocation_status: ALLOCATION_STATUS.UNALLOCATED,
                updated_date: new Date(),
                pin_order: 0,
                pin_status: 0,
              },
            );
            return response.status(SERVICE_EXCEPTION.SUCCESS_RESPONSE).send({
              successMessage: 'User ' + isUserExist.user_name + ' removed',
              statusCode: ErrorStatus.SUCCESS,
            });
          }
        }
      } else {
        return response
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('user not found'));
      }
    } catch (error) {
      this.logger.error('delete user , ' + error);
      return response
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }

  async permanentDeleteUserService(
    id: number,
    req: Request,
    response: Response,
  ) {
    try {
      let isUserExist = await this.userRepository.findOne({
        where: { user_id: id, status: Status.ACTIVE },
      });
      if (isUserExist) {
        if (req['currentUser'].user_id == isUserExist.user_id) {
          return response
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('cannot delete self'));
        } else {
          let isUserAllocated =
            await this.projectResourceAllocationRepository.find({
              where: {
                allocated_user: isUserExist,
                allocation_status: Status.ACTIVE,
              },
            });
          if (isUserAllocated.length > 0) {
            await Promise.all(
              isUserAllocated.map(async (user) => {
                user.allocation_status = ALLOCATION_STATUS.UNALLOCATED;
                user.status = Status.INACTIVE;
                user.pin_order = 0;
                user.pin_status = 0;
                this.projectResourceAllocationRepository.save(user);
              }),
            );
            await this.userRepository.update(
              { user_id: isUserExist.user_id },
              {
                status: Status.INACTIVE,
                updated_date: new Date(),
                email: 'del' + isUserExist.email,
              },
            );
            return response.status(SERVICE_EXCEPTION.SUCCESS_RESPONSE).send({
              successMessage: 'User ' + isUserExist.user_name + ' removed',
              statusCode: ErrorStatus.SUCCESS,
            });
          }
          await this.userRepository.update(
            { user_id: isUserExist.user_id },
            {
              status: Status.INACTIVE,
              updated_date: new Date(),
              email: 'del' + isUserExist.email,
            },
          );
          return response.status(SERVICE_EXCEPTION.SUCCESS_RESPONSE).send({
            successMessage: 'User ' + isUserExist.user_name + ' removed',
            statusCode: ErrorStatus.SUCCESS,
          });
        }
      } else {
        return response
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('user not found'));
      }
    } catch (error) {
      this.logger.error('permentant delete user , ' + error);
      return response
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }

  //get profile

  async getProfile(req: Request, response: Response) {
    try {
      let user = req['currentUser'];
      return response
        .status(SERVICE_EXCEPTION.SUCCESS_RESPONSE)
        .send(new ProfileView(user));
    } catch (error) {
      this.logger.error('get profile ,' + error);
      return response
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }

  async getRoles(req: Request, response: Response) {
    try {
      let roles = await this.roleRepository.find();
      return response.status(SERVICE_EXCEPTION.SUCCESS_RESPONSE).send(roles);
    } catch (error) {
      this.logger.error('get role list,' + error);
      return response
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }

  async getUsersList(req: Request, response: Response) {
    let searchKey: any;
    try {
      let searchCol = req.query.searchCol || 'status';

      let allowedSearchCols = ['user_id', 'user_name', 'email', 'status'];
      let allowedSortCols = ['user_id', 'user_name', 'email'];
      if (req.query.searchKey && !req.query.searchCol) {
        return response
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send({ errorMessage: 'Search column missing', statusCode: 128 });
      }
      if (
        req.query.searchCol &&
        !allowedSearchCols.includes(req.query.searchCol.toString().trim())
      ) {
        return response
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send({ errorMessage: 'Invalid field', statusCode: 68 });
      }
      if (req.query.searchCol && !req.query.searchKey) {
        return response
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send({ errorMessage: 'Missing search key', statusCode: 129 });
      }
      if (req.query.sortCol && !req.query.sortMethod) {
        return response
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send({ errorMessage: 'Missing sort method', statusCode: 130 });
      } else if (!req.query.sortCol && req.query.sortMethod) {
        return response
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send({ errorMessage: 'Missing sort column', statusCode: 131 });
      }
      if (
        allowedSortCols &&
        req.query.sortCol &&
        !allowedSortCols.includes(req.query.sortCol.toString().trim())
      ) {
        return response
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send({ errorMessage: 'Invalid sort field', statusCode: 140 });
      }

      let queryBuilder = this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.role', 'role')
        .where('user.status = :status', {
          status: STATUS.ACTIVE,
        });
      if (req.query.searchKey) {
        await this.searchUserList(req, queryBuilder, searchCol, searchKey);
      }
      const paginatedData = await pager(req, queryBuilder, 'user', 'user_id');

      return response
        .status(SERVICE_EXCEPTION.SUCCESS_RESPONSE)
        .send(paginatedData);
    } catch (error) {
      this.logger.error('get user list, ' + error);
      return response
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }
  async searchUserList(
    req: Request,
    queryBuilder: any,
    searchCol: any,
    searchKey: any,
  ) {
    searchKey =
      req.query.searchKey.toString().trim().replace(/[_+%]/g, '\\$&') || 1;
    queryBuilder.andWhere(' user.' + searchCol + ' LIKE:searchKey', {
      searchKey: `%${searchKey}%`,
    });
  }
  // Get allocated project of a user
  async getAllocatedProjects(user_id, response: Response) {
    try {
      let user = await this.userRepository.findOne({
        where: { user_id, status: STATUS.ACTIVE },
      });

      if (!user) {
        return response
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('user not found'));
      }

      let allocatedProject =
        await this.projectResourceAllocationRepository.find({
          relations: [
            'project_id_resource_alloc',
            'allocation_assigned_by',
            'role',
          ],
          where: {
            status: STATUS.ACTIVE,
            allocated_user: user,
            allocation_status: ALLOCATION_STATUS.ALLOCATED,
          },
        });

      return response
        .status(SERVICE_EXCEPTION.SUCCESS_RESPONSE)
        .send(new LoopAllocatedProjectView(allocatedProject));
    } catch (error) {
      this.logger.error('get allocated project list,' + error);
      return response
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }

  async getUserByService(id: number, response: Response) {
    try {
      let user = await this.userRepository.findOne({
        relations: ['role'],
        where: { user_id: id, status: STATUS.ACTIVE },
      });

      if (!user) {
        return response
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('user not found'));
      } else {
        return response
          .status(SERVICE_EXCEPTION.SUCCESS_RESPONSE)
          .send(new GetUserView(user));
      }
    } catch (error) {
      this.logger.error('get user by id' + error);
      return response
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }
  async getRoleList(response: Response) {
    try {
      let role = await this.roleRepository.find({
        where: {
          status: Status.ACTIVE,
          authority: ROLE_AUTHORITY.TOP_LEVEL,
        },
      });
      return response.status(SERVICE_EXCEPTION.SUCCESS_RESPONSE).send(role);
    } catch (error) {
      this.logger.error(' role list,' + error);
      return response
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }

  async getProjectRoleList(response: Response) {
    try {
      let role = await this.roleRepository.find({
        where: {
          status: Status.ACTIVE,
          authority: ROLE_AUTHORITY.MEDIUM_LEVEL,
        },
      });
      return response.status(SERVICE_EXCEPTION.SUCCESS_RESPONSE).send(role);
    } catch (error) {
      this.logger.error('project role list,' + error);
      return response
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }

  async getCoworkerList(req: Request, response: Response) {
    try {
      let projects = [];
      let total = 0;
      let currentUsersAllocation =
        await this.projectResourceAllocationRepository.find({
          relations: ['project_id_resource_alloc'],
          where: {
            allocated_user: req['currentUser'],
            allocation_status: ALLOCATION_STATUS.ALLOCATED,
          },
        });

      let result: any;
      if (currentUsersAllocation.length > 0) {
        await this.getAllocatedProjectId(currentUsersAllocation, projects);
        let validateReqParamsCoworkersRes =
          await this.validateReqParamsCoworkers(req);
        switch (validateReqParamsCoworkersRes) {
          case 1:
            return response
              .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
              .send(new CustomValidation('invalid limit'));
          case 2:
            return response
              .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
              .send(new CustomValidation('invalid last data'));
          case 3:
            return response
              .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
              .send(new CustomValidation('invalid last id'));
          case 4:
            return response
              .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
              .send(new CustomValidation('last id missing'));
          case 5:
            return response
              .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
              .send(new CustomValidation('last data missing'));
          case 6:
            return response
              .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
              .send(new CustomValidation('no record exist on given data'));
          case 7:
            return response
              .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
              .send(
                new CustomValidation('limit must not be greater than 3000'),
              );
        }
        let lastData = req.query.last_data || null;
        const page = Number(req.query.page) || 1;
        let limit = Number(req.query.limit) || null;
        let lastId = Number(req.query.last_id) || null;
        const startIndex = (page - 1) * limit;
        let counterQuery = this.projectResourceAllocationRepository
          .createQueryBuilder('resource')
          .addSelect('resource.allocated_user', 'abcd')
          .select('resource.user_id', 'user_id')
          .distinct(true)
          .leftJoinAndSelect('resource.allocated_user', 'allocated_user')
          .where('resource.allocation_status =:allocation_status', {
            allocation_status: ALLOCATION_STATUS.ALLOCATED,
          })
          .andWhere('resource.project_id IN (:...project)', {
            project: projects,
          });

        let query = this.projectResourceAllocationRepository
          .createQueryBuilder('resource')
          .addSelect('resource.allocated_user', 'abcd')
          .select('resource.user_id', 'user_id')
          .distinct(true)
          .leftJoinAndSelect('resource.allocated_user', 'allocated_user')
          .where('resource.allocation_status =:allocation_status', {
            allocation_status: ALLOCATION_STATUS.ALLOCATED,
          })
          .andWhere('resource.project_id IN (:...project)', {
            project: projects,
          });
        await this.haveSearch(req, query, counterQuery);
        query
          .orderBy('allocated_user.user_name', 'ASC')
          .addOrderBy('allocated_user.user_id', 'DESC');
        counterQuery
          .orderBy('allocated_user.user_name', 'ASC')
          .addOrderBy('allocated_user.user_id', 'DESC');

        let totalCounts = await counterQuery.getRawMany();
        total = totalCounts.length;
        if (!limit) {
          limit = total;
        }
        if (lastData) {
          query
            .andWhere(
              '(allocated_user.user_name > :userName OR (allocated_user.user_name = :userName AND allocated_user.user_id < :userId))',
              { userName: lastData, userId: lastId },
            )
            .limit(limit);
        } else {
          query.offset(startIndex).limit(limit);
        }
        let resultBfrView = await query.getRawMany();
        result = new MemberListLoop(resultBfrView, req['currentUser']);
      }
      let dataCount = 0;
      let members = [];
      if (result) {
        dataCount = Object.keys(result.members).length;
        members = result.members;
      }
      return response
        .status(SERVICE_EXCEPTION.SUCCESS_RESPONSE)
        .send({ total, dataCount, members });
    } catch (error) {
      this.logger.error('Get coworker list,' + error);
      return response
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }

  async haveSearch(req, query, counterQuery) {
    if (req.query.user_name) {
      let searchName = req.query.user_name
        .toString()
        .trim()
        .replace(/[_+%]/g, '\\$&');
      query.andWhere('allocated_user.user_name LIKE:searchName', {
        searchName: `%${searchName}%`,
      });
      counterQuery.andWhere('allocated_user.user_name LIKE:searchName', {
        searchName: `%${searchName}%`,
      });
    }
  }

  async getAllocatedProjectId(currentUsersAllocation, projects) {
    for (const allocation of currentUsersAllocation) {
      projects.push(allocation.project_id_resource_alloc.project_id);
    }
  }

  async validateReqParamsCoworkers(req) {
    if (req.query.limit) {
      let limitPerPage = Number(req.query.limit);
      if (isNaN(limitPerPage) || !isInt(limitPerPage) || limitPerPage < 1) {
        return 1;
      }
      if (limitPerPage > 3000) {
        return 7;
      }
    }
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
    return this.lastRecordExistCoworker(req);
  }

  async lastRecordExistCoworker(req) {
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
  async getUserActivity(req: Request, response: Response) {
    try {
      let recentUpdates = [];
      let hasNext;
      let validateUserActivityParamsRes = await this.validateUserActivityParams(
        req,
      );
      switch (validateUserActivityParamsRes) {
        case 1:
          return response
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('invalid last data'));
        case 2:
          return response
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('last data not found'));
        case 3:
          return response
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('invalid limit'));
        case 4:
          return response
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('limit must not be greater than 3000'));
        default:
      }
      let lastData = req.query.last_data || null;
      const page = Number(req.query.page) || 1;
      let limit = Number(req.query.limit) || null;
      const startIndex = (page - 1) * limit;

      let taskHistory = this.taskHistory
        .createQueryBuilder('taskHistoryObj')
        .leftJoinAndSelect(
          'taskHistoryObj.assignee_history',
          'assignee_history',
        )
        .leftJoinAndSelect(
          'taskHistoryObj.new_assignee_history',
          'new_assignee_history',
        )
        .leftJoinAndSelect(
          'taskHistoryObj.assigner_history',
          'assigner_history',
        )
        .leftJoinAndSelect(
          'taskHistoryObj.new_assigner_history',
          'new_assigner_history',
        )
        .leftJoinAndSelect(
          'taskHistoryObj.created_by_history',
          'created_by_history',
        )
        .leftJoinAndSelect('taskHistoryObj.file_history', 'file_history')
        .leftJoinAndSelect(
          'taskHistoryObj.task_category_history',
          'task_category_history',
        )
        .leftJoinAndSelect(
          'taskHistoryObj.task_issue_history',
          'task_issue_history',
        )
        .leftJoinAndSelect(
          'taskHistoryObj.new_task_category_history',
          'new_task_category_history',
        )
        .leftJoinAndSelect(
          'taskHistoryObj.new_task_issue_history',
          'new_task_issue_history',
        )
        .leftJoinAndSelect('taskHistoryObj.task_history', 'task_history')

        .leftJoinAndSelect('taskHistoryObj.taskHistory', 'taskHistory')
        .leftJoinAndSelect('taskHistoryObj.allocation_data', 'allocation_data')
        .leftJoinAndSelect('allocation_data.allocated_user', 'allocated_user')
        .leftJoinAndSelect('allocation_data.role', 'role')
        .where('taskHistoryObj.created_by = :created_by', {
          created_by: req['currentUser'].user_id,
        })
        .andWhere('taskHistoryObj.task_history_status = :task_history_status', {
          task_history_status: STATUS.ACTIVE,
        })
        .andWhere('taskHistoryObj.history_type =:history_type', {
          history_type: HISTORY_TYPE.TASK_HISTORY,
        })
        .orderBy('taskHistoryObj.task_history_id', 'DESC');

      let offsetQuery = this.taskHistory
        .createQueryBuilder('taskHistoryObj')
        .leftJoinAndSelect(
          'taskHistoryObj.assignee_history',
          'assignee_history',
        )
        .leftJoinAndSelect(
          'taskHistoryObj.new_assignee_history',
          'new_assignee_history',
        )
        .leftJoinAndSelect(
          'taskHistoryObj.assigner_history',
          'assigner_history',
        )
        .leftJoinAndSelect(
          'taskHistoryObj.new_assigner_history',
          'new_assigner_history',
        )
        .leftJoinAndSelect(
          'taskHistoryObj.created_by_history',
          'created_by_history',
        )
        .leftJoinAndSelect('taskHistoryObj.file_history', 'file_history')
        .leftJoinAndSelect(
          'taskHistoryObj.task_category_history',
          'task_category_history',
        )
        .leftJoinAndSelect(
          'taskHistoryObj.task_issue_history',
          'task_issue_history',
        )
        .leftJoinAndSelect(
          'taskHistoryObj.new_task_category_history',
          'new_task_category_history',
        )
        .leftJoinAndSelect(
          'taskHistoryObj.new_task_issue_history',
          'new_task_issue_history',
        )
        .leftJoinAndSelect('taskHistoryObj.task_history', 'task_history')

        .leftJoinAndSelect('taskHistoryObj.taskHistory', 'taskHistory')
        .leftJoinAndSelect('taskHistoryObj.allocation_data', 'allocation_data')
        .leftJoinAndSelect('allocation_data.allocated_user', 'allocated_user')
        .leftJoinAndSelect('allocation_data.role', 'role')
        .where('taskHistoryObj.created_by = :created_by', {
          created_by: req['currentUser'].user_id,
        })
        .andWhere('taskHistoryObj.task_history_status = :task_history_status', {
          task_history_status: STATUS.ACTIVE,
        })
        .andWhere('taskHistoryObj.history_type =:history_type', {
          history_type: HISTORY_TYPE.TASK_HISTORY,
        })
        .orderBy('taskHistoryObj.task_history_id', 'DESC');

      let total = await taskHistory.getCount();

      if (!limit) {
        limit = total;
      }

      if (lastData) {
        let lastValue = await offsetQuery
          .andWhere('taskHistoryObj.task_history_id >=:id', { id: lastData })
          .getCount();

        this.logger.debug('User activity: has last data');
        taskHistory.offset(lastValue).limit(limit);
        hasNext = total > limit + lastValue;
      } else {
        taskHistory.offset(startIndex).limit(limit);
        hasNext = total > limit;
      }
      let result = await taskHistory.getMany();

      Promise.all(
        result.map(async (value) => {
          recentUpdates.push(new TaskHistoryView(value));
        }),
      );
      const dataCount = recentUpdates.length;
      return response
        .status(SERVICE_EXCEPTION.SUCCESS_RESPONSE)
        .send({ dataCount, total, hasNext, recentUpdates });
    } catch (error) {
      this.logger.error('User activity,' + error);
      return response
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }

  async validateUserActivityParams(req) {
    if (req.query.limit) {
      let limitPerPage = Number(req.query.limit);
      if (isNaN(limitPerPage) || !isInt(limitPerPage) || limitPerPage < 1) {
        return 3;
      }
      if (limitPerPage > 3000) {
        return 4;
      }
    }
    if (req.query.last_data) {
      let lastDataId = Number(req.query.last_data);
      if (isNaN(lastDataId) || !isInt(lastDataId)) {
        return 1;
      }
      return this.lastRecordExist(req);
    }
  }

  async lastRecordExist(req) {
    let lastValue = await this.taskHistory
      .createQueryBuilder('taskHistoryOffset')
      .where('taskHistoryOffset.task_history_id =:id', {
        id: req.query.last_data,
      })
      .getOne();

    if (!lastValue) {
      return 2;
    }
  }
  //image upload
  async uploadImageFile(
    file,
    req: Request,
    uniquFileName,
    maxSize,
    body,
    response: Response,
  ) {
    try {
      if (body.file == '') {
        return response.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage: 'file is not recived',
          statusCode: 708,
        });
      }

      //if file only passed without body
      if (JSON.stringify(body) === JSON.stringify({})) {
        return this.subUploadFile(file, maxSize, uniquFileName, req, response);
      }
      // body data is passed with or without file
      let user = req['currentUser'];

      //form_data validation
      let formData = await this.formdataValidationUploadFile(body, file, req);
      switch (formData) {
        case 1:
          return response.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
            errorMessage:
              'unexpected field detected,only first_name,middle_name,last_name,phone_no allowed',
            statusCode: 2701,
          });

        case 2:
          return response.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
            errorMessage:
              'first_name,middle_name,last_name,phone_no is allowed one time only',
            statusCode: 2702,
          });

        default:
      }

      let firstName = body.first_name.trim();
      let middleName = body.middle_name.trim();
      let lastName = body.last_name.trim();
      let phoneNo = body.phone_no.trim();
      //body validation
      let value = await this.sub1UploadFile(
        firstName,
        uniquFileName,
        file,
        middleName,
        lastName,
        phoneNo,
      );
      switch (value) {
        case 1:
          return response.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
            errorMessage: 'first_name is not allowed to be empty',
            statusCode: 267,
          });

        case 2:
          return response.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
            errorMessage:
              'first_name length must be at least 3 characters long',
            statusCode: 1022,
          });

        case 3:
          return response.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
            errorMessage:
              'first_name length must be less than or equal to 30 characters long',
            statusCode: 1017,
          });

        case 4:
          return response.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
            errorMessage:
              'first_name should only contains alphabetic characters only',
            statusCode: 1333,
          });
        case 6:
          return response.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
            errorMessage:
              'middle_name_name length must be less than or equal to 30 characters long',
            statusCode: 1024,
          });

        case 7:
          return response.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
            errorMessage:
              'middle_name_name should only contains alphabetic characters only',
            statusCode: 1334,
          });

        case 8:
          return response.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
            errorMessage: 'last_name is not allowed to be empty',
            statusCode: 113,
          });

        case 10:
          return response.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
            errorMessage:
              'last_name length must be less than or equal to 30 characters long',
            statusCode: 1024,
          });

        case 11:
          return response.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
            errorMessage:
              'last_name should only contains alphabetic characters only',
            statusCode: 1334,
          });

        case 12:
          return response.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
            errorMessage: 'phone_no is not allowed to be empty',
            statusCode: 1019,
          });
        case 13:
          return response.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
            errorMessage: 'phone_no length must be at least 10 characters long',
            statusCode: 1019,
          });

        case 14:
          return response.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
            errorMessage: 'phone_no length must be at least 12 characters long',
            statusCode: 1020,
          });

        case 15:
          return response.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
            errorMessage: 'Phone number must be number',
            statusCode: 333,
          });

        default:
      }
      const profile = await this.userRepository.findOne({
        where: { user_id: user.user_id, status: STATUS.ACTIVE },
      });

      let value1 = await this.sub6UploadFile(
        profile,
        phoneNo,
        user,
        file,
        uniquFileName,
      );
      switch (value1) {
        case 1:
          return response.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
            errorMessage: 'user not found',
            statusCode: 32,
          });

        case 2:
          return response.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
            errorMessage: 'phone number already exist',
            statusCode: 1350,
          });
        default:
      }

      profile.first_name = firstName;
      profile.middle_name = middleName;
      profile.last_name = lastName;
      profile.phone_number = phoneNo;
      profile.updated_date = new Date();

      if (!file) {
        const result = await this.userRepository.save(profile);

        if (result) {
          return response
            .status(SERVICE_EXCEPTION.SUCCESS_RESPONSE)
            .send(new ProfileImageView(result, file));
        }
      }

      //file with body
      return this.sub5UploadFile(
        file,
        maxSize,
        uniquFileName,
        user,
        profile,
        response,
      );
    } catch (error) {
      if (file != undefined) {
        return this.catchExceptionsUploadFile(
          req,
          body,
          uniquFileName,
          file,
          error,
          response,
        );
      } else if (file == undefined) {
        return this.catchExceptionsUploadFile(
          req,
          body,
          uniquFileName,
          file,
          error,
          response,
        );
      } else {
        return response
          .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
          .send(new CustomValidation('exception caught in catch'));
      }
    }
  }
  async formdataValidationUploadFile(body, file, req) {
    let newObj = Object.keys(body);

    let obj = Object.values(body);

    if (file == '') {
      if (newObj.length > 4) {
        return 1;
      }
    }

    if (
      body.first_name &&
      body.middle_name &&
      body.last_name &&
      body.phone_no
    ) {
      if (
        obj[0][0].length > 1 ||
        obj[1][0].length > 1 ||
        obj[2][0].length > 1 ||
        obj[3][0].length > 1
      ) {
        return 2;
      }
    }
  }
  async subUploadFile(file, maxSize, uniquFileName, req, response) {
    try {
      if (!file) {
        return response.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage: 'file is not recived',
          statusCode: 708,
        });
      }
      if (file.size > maxSize) {
        await new Promise((f) => setTimeout(f, 1000));
        fs.unlink(Env.IMG_URL + uniquFileName, (err) => {
          this.logger.error('Image upload ++,' + err);
          // await new Promise(f => setTimeout(f, 1000)); fs.unlink('/home/kelbinjacob/Pictures/TM_Pahse 1/task-management-tool/Task_Management_NestJS/TaskFiles/'+uniquFileName,
          //  (err) => {
        });
        return response.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage:
            'file size should be less than or equal to 10MB or (10485760 byte)',
          statusCode: 711,
        });
      }
      let user = req['currentUser'];
      const profile = await this.userRepository.findOne({
        where: { user_id: user.user_id, status: STATUS.ACTIVE },
      });

      if (user.profile_photo == null) {
        this.logger.debug('No profile photo detected');
      } else {
        const previousFilename = user.profile_photo.split('/').slice()[3];
        profile.profile_photo = Env.GET_IMAGE_URL + uniquFileName;

        let savedProfiles = await this.userRepository.save(profile);
        if (savedProfiles) {
          if (previousFilename) {
            await new Promise((f) => setTimeout(f, 1000));
            fs.unlink(Env.IMG_URL + previousFilename, (err) => {
              this.logger.error('Image upload ++,' + err);

              // await new Promise(f => setTimeout(f, 1000)); fs.unlink('/home/kelbinjacob/phase_1/task-management-tool/Task_Management_NestJS/TaskFiles/'+previousFilename,
              //  (err) => {
            });
          }

          return response
            .status(SERVICE_EXCEPTION.SUCCESS_RESPONSE)
            .send(new ProfileImageView(savedProfiles, file));
        }
      }

      profile.profile_photo = Env.GET_IMAGE_URL + uniquFileName;

      let savedProfile = await this.userRepository.save(profile);
      if (savedProfile) {
        return response
          .status(SERVICE_EXCEPTION.SUCCESS_RESPONSE)
          .send(new ProfileImageView(savedProfile, file));
      }
    } catch (error) {
      if (file == undefined) {
        return response.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage: 'Automatic calculated boundary not given',
          statusCode: 2711,
        });
      } else {
        this.logger.error('subUploadFile function upload file api,' + error);
        return response
          .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
          .send(new CustomValidation('exception caught in catch'));
      }
    }
  }
  //first name body validation
  async sub1UploadFile(
    firstName: any,
    uniquFileName,
    file,
    middleName: any,
    lastName: any,
    phoneNo: any,
  ) {
    if (!firstName) {
      if (file) {
        await new Promise((f) => setTimeout(f, 1000));
        fs.unlink(Env.IMG_URL + uniquFileName, (err) => {
          this.logger.error('Image upload ++,' + err);

          // await new Promise(f => setTimeout(f, 1000)); fs.unlink('/home/kelbinjacob/Pictures/TM_Pahse 1/task-management-tool/Task_Management_NestJS/TaskFiles/'+uniquFileName,
          //  (err) => {
        });
      }
      return 1;
    }

    if (firstName.length < 3) {
      if (file) {
        await new Promise((f) => setTimeout(f, 1000));
        fs.unlink(Env.IMG_URL + uniquFileName, (err) => {
          this.logger.error('Image upload ++,' + err);

          // await new Promise(f => setTimeout(f, 1000)); fs.unlink('/home/kelbinjacob/Pictures/TM_Pahse 1/task-management-tool/Task_Management_NestJS/TaskFiles/'+uniquFileName,
          //  (err) => {
        });
      }
      return 2;
    }
    if (firstName.length > 30) {
      if (file) {
        await new Promise((f) => setTimeout(f, 1000));
        fs.unlink(Env.IMG_URL + uniquFileName, (err) => {
          this.logger.error('Image upload ++,' + err);

          // await new Promise(f => setTimeout(f, 1000)); fs.unlink('/home/kelbinjacob/phase_1/task-management-tool/Task_Management_NestJS/TaskFiles/'+uniquFileName,
          //  (err) => {
        });
      }
      return 3;
    }
    if (
      !firstName.match(/^(?! )(?!\s)(?!.* {2})[\s\S]*(?<!\s)(?! )$/) &&
      firstName != ''
    ) {
      if (file) {
        await new Promise((f) => setTimeout(f, 1000));
        fs.unlink(Env.IMG_URL + uniquFileName, (err) => {
          this.logger.error('Image upload ++,' + err);

          // await new Promise(f => setTimeout(f, 1000)); fs.unlink('/home/kelbinjacob/Pictures/TM_Pahse 1/task-management-tool/Task_Management_NestJS/TaskFiles/'+uniquFileName,
          //  (err) => {
        });
      }
      return 4;
    }
    return this.sub3UploadFile(
      middleName,
      file,
      uniquFileName,
      lastName,
      phoneNo,
    );
  }
  //last name body validation

  async sub2UploadFile(uniquFileName, file, lastName, phoneNo) {
    if (!lastName) {
      if (file) {
        await new Promise((f) => setTimeout(f, 1000));
        fs.unlink(Env.IMG_URL + uniquFileName, (err) => {
          this.logger.error('Image upload ++,' + err);

          // await new Promise(f => setTimeout(f, 1000)); fs.unlink('/home/kelbinjacob/Pictures/TM_Pahse 1/task-management-tool/Task_Management_NestJS/TaskFiles/'+uniquFileName,
          //  (err) => {
        });
      }
      return 8;
    }
    if (lastName.length > 30) {
      if (file) {
        await new Promise((f) => setTimeout(f, 1000));
        fs.unlink(Env.IMG_URL + uniquFileName, (err) => {
          this.logger.error('Image upload ++,' + err);

          // await new Promise(f => setTimeout(f, 1000)); fs.unlink('/home/kelbinjacob/Pictures/TM_Pahse 1/task-management-tool/Task_Management_NestJS/TaskFiles/'+uniquFileName,
          //  (err) => {
        });
      }
      return 10;
    }
    if (
      !lastName.match(/^(?! )(?!\s)(?!.* {2})[\s\S]*(?<!\s)(?! )$/) &&
      lastName != ''
    ) {
      if (file) {
        await new Promise((f) => setTimeout(f, 1000));
        fs.unlink(Env.IMG_URL + uniquFileName, (err) => {
          this.logger.error('Image upload ++,' + err);

          // await new Promise(f => setTimeout(f, 1000)); fs.unlink('/home/kelbinjacob/Pictures/TM_Pahse 1/task-management-tool/Task_Management_NestJS/TaskFiles/'+uniquFileName,
          //  (err) => {
        });
      }
      return 11;
    }
    return this.sub4UploadFile(phoneNo, file, uniquFileName);
  }
  //middle name body validation

  async sub3UploadFile(middleName, file, uniquFileName, lastName, phoneNo) {
    if (middleName.length > 30 && middleName != '') {
      if (file) {
        await new Promise((f) => setTimeout(f, 1000));
        fs.unlink(Env.IMG_URL + uniquFileName, (err) => {
          this.logger.error('Image upload ++,' + err);

          // await new Promise(f => setTimeout(f, 1000)); fs.unlink('/home/kelbinjacob/Pictures/TM_Pahse 1/task-management-tool/Task_Management_NestJS/TaskFiles/'+uniquFileName,
          //  (err) => {
        });
      }
      return 6;
    }
    if (
      !middleName.match(/^(?! )(?!\s)(?!.* {2})[\s\S]*(?<!\s)(?! )$/) &&
      middleName != ''
    ) {
      if (file) {
        await new Promise((f) => setTimeout(f, 1000));
        fs.unlink(Env.IMG_URL + uniquFileName, (err) => {
          this.logger.error('Image upload ++,' + err);

          // await new Promise(f => setTimeout(f, 1000)); fs.unlink('/home/kelbinjacob/Pictures/TM_Pahse 1/task-management-tool/Task_Management_NestJS/TaskFiles/'+uniquFileName,
          //  (err) => {
        });
      }
      return 7;
    }
    return this.sub2UploadFile(uniquFileName, file, lastName, phoneNo);
  }
  //phone number body validation

  async sub4UploadFile(phoneNo, file, uniquFileName) {
    if (!phoneNo) {
      if (file) {
        await new Promise((f) => setTimeout(f, 1000));
        fs.unlink(Env.IMG_URL + uniquFileName, (err) => {
          this.logger.error('Image upload ++,' + err);

          // await new Promise(f => setTimeout(f, 1000)); fs.unlink('/home/kelbinjacob/Pictures/TM_Pahse 1/task-management-tool/Task_Management_NestJS/TaskFiles/'+uniquFileName,
          //  (err) => {
        });
      }
      return 12;
    }
    if (phoneNo.length < 10) {
      if (file) {
        await new Promise((f) => setTimeout(f, 1000));
        fs.unlink(Env.IMG_URL + uniquFileName, (err) => {
          this.logger.error('Image upload ++,' + err);

          // await new Promise(f => setTimeout(f, 1000)); fs.unlink('/home/kelbinjacob/Pictures/TM_Pahse 1/task-management-tool/Task_Management_NestJS/TaskFiles/'+uniquFileName,
          //  (err) => {
        });
      }
      return 13;
    }
    if (phoneNo.length > 12 && phoneNo != '') {
      if (file) {
        await new Promise((f) => setTimeout(f, 1000));
        fs.unlink(Env.IMG_URL + uniquFileName, (err) => {
          this.logger.error('Image upload ++,' + err);

          // await new Promise(f => setTimeout(f, 1000)); fs.unlink('/home/kelbinjacob/Pictures/TM_Pahse 1/task-management-tool/Task_Management_NestJS/TaskFiles/'+uniquFileName,
          //  (err) => {
        });
      }
      return 14;
    }

    if (!phoneNo.match(/^\d{10,12}$/)) {
      if (file) {
        await new Promise((f) => setTimeout(f, 1000));
        fs.unlink(Env.IMG_URL + uniquFileName, (err) => {
          this.logger.error('Image upload ++,' + err);

          // await new Promise(f => setTimeout(f, 1000)); fs.unlink('/home/kelbinjacob/Pictures/TM_Pahse 1/task-management-tool/Task_Management_NestJS/TaskFiles/'+uniquFileName,
          //  (err) => {
        });
      }
      return 15;
    }
  }
  //file with body request sub function
  async sub5UploadFile(file, maxSize, uniquFileName, user, profile, response) {
    if (file.size > maxSize) {
      await new Promise((f) => setTimeout(f, 1000));
      fs.unlink(Env.IMG_URL + uniquFileName, (err) => {
        this.logger.error('Image upload ++,' + err);
      });
      return response.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
        errorMessage:
          'file size should be less than or equal to 10MB or (10485760 byte)',
        statusCode: 711,
      });
    }
    if (user.profile_photo == null) {
      this.logger.debug('photo not detected');
    }
    //if file path exist (new file add is success then old file will be deleted)
    else {
      const previousFilename = user.profile_photo.split('/').slice()[3];
      profile.profile_photo = Env.GET_IMAGE_URL + uniquFileName;

      let savedProfile = await this.userRepository.save(profile);
      if (savedProfile) {
        if (previousFilename) {
          await new Promise((f) => setTimeout(f, 1000));
          fs.unlink(Env.IMG_URL + previousFilename, (err) => {
            this.logger.error('Image upload ++,' + err);
          });
        }

        return response
          .status(SERVICE_EXCEPTION.SUCCESS_RESPONSE)
          .send(new ProfileImageView(savedProfile, file));
      }
    }

    profile.profile_photo = Env.GET_IMAGE_URL + uniquFileName;

    let savedProfile = await this.userRepository.save(profile);

    if (savedProfile) {
      return response
        .status(SERVICE_EXCEPTION.SUCCESS_RESPONSE)
        .send(new ProfileImageView(savedProfile, file));
    }
  }
  //phone number unique checking validation
  async sub6UploadFile(profile, phoneNo, user, file, uniquFileName) {
    if (!profile) {
      if (file) {
        await new Promise((f) => setTimeout(f, 1000));
        fs.unlink(Env.IMG_URL + uniquFileName, (err) => {
          this.logger.error('Image upload ++,' + err);

          // await new Promise(f => setTimeout(f, 1000)); fs.unlink('/home/kelbinjacob/Pictures/TM_Pahse 1/task-management-tool/Task_Management_NestJS/TaskFiles/'+uniquFileName,
          //  (err) => {
        });
      }
      return 1;
    }
    const uniquePhoneNo = await this.userRepository.findOne({
      where: { phone_number: phoneNo, status: STATUS.ACTIVE },
    });
    if (uniquePhoneNo && user.phone_number != phoneNo) {
      if (file) {
        await new Promise((f) => setTimeout(f, 1000));
        fs.unlink(Env.IMG_URL + uniquFileName, (err) => {
          this.logger.error('Image upload ++,' + err);

          // await new Promise(f => setTimeout(f, 1000)); fs.unlink('/home/kelbinjacob/Pictures/TM_Pahse 1/task-management-tool/Task_Management_NestJS/TaskFiles/'+uniquFileName,
          //  (err) => {
        });
      }
      return 2;
    }
  }
  //catch exceptions sub function
  async catchExceptionsUploadFile(
    req,
    body,
    uniquFileName,
    file,
    error,
    response,
  ) {
    if (body.first_name == undefined) {
      if (!file) {
        return response.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage: 'Key value should be first_name itself and required',
          statusCode: 1899,
        });
      }
      await new Promise((f) => setTimeout(f, 1000));
      fs.unlink(Env.IMG_URL + uniquFileName, (err) => {
        this.logger.error('Image upload ++,' + err);
      });
      return response.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
        errorMessage: 'Key value should be first_name itself and required',
        statusCode: 1899,
      });
    }
    if (body.middle_name == undefined) {
      if (!file) {
        return response.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage: 'Key value should be middle_name itself and required',
          statusCode: 1900,
        });
      }

      await new Promise((f) => setTimeout(f, 1000));
      fs.unlink(Env.IMG_URL + uniquFileName, (err) => {
        this.logger.error('Image upload ++,' + err);
      });
      return response.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
        errorMessage: 'Key value should be middle_name itself and required',
        statusCode: 1900,
      });
    } else if (body.last_name == undefined) {
      if (!file) {
        return response.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage: 'Key value should be last_name itself and required',
          statusCode: 1899,
        });
      }
      await new Promise((f) => setTimeout(f, 1000));
      fs.unlink(Env.IMG_URL + uniquFileName, (err) => {
        this.logger.error('Image upload ++,' + err);
      });

      return response.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
        errorMessage: 'Key value should be last_name itself and required',
        statusCode: 1899,
      });
    } else if (body.phone_no == undefined) {
      if (!file) {
        return response.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage: 'Key value should be phone_no itself and required',
          statusCode: 1899,
        });
      }
      await new Promise((f) => setTimeout(f, 1000));
      fs.unlink(Env.IMG_URL + uniquFileName, (err) => {
        this.logger.error('Image upload ++,' + err);
      });
      return response.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
        errorMessage: 'Key value should be phone_no itself and required',
        statusCode: 1899,
      });
    } else if (req.file == undefined) {
      return response.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
        errorMessage: 'file is not received',
        statusCode: 708,
      });
    } else {
      this.logger.error('upload file,' + error);
      return response
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }
}
