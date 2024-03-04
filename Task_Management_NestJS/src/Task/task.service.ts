import { ProjectHistory } from './../Entity/Project_history';
import { TaskHistory } from './../Entity/Task_History';
import {
  TaskView,
  SetTaskHistoryView,
  TaskHistoryView,
  TaskFileUploadView,
  LoopTaskDashboard,
  LoopTaskFilesView,
  ChangeTaskStatusView,
  ChangeTaskAssigneeView,
  ChangeTaskStatusAndAssigneeView,
  ChangeTaskStatusResponseView,
  GanttChartLoop,
  BoardListLoop,
} from './../views/view';
import { ErrorStatus } from '../ErrorStatus';
import {
  TASK_STATUS,
  TASK_HISTORY_ACTION,
  ALLOCATION_STATUS,
  NOTIFCATION_STATUS,
  TASK_RELATION,
  NOTIFICATION_ENUM,
  HISTORY_TYPE,
} from './../Enum/Enums.enum';
import { User } from '../Entity/User';
import { Project } from './../Entity/Project';
import { CustomValidation } from '../Util/custom-validation.schema';
import {
  UpdateTaskDto,
  ChangeTaskStatus,
  RecentUpdatesDashboard,
  GetChildListDto,
  AdvancedSearchDto,
  CommentTask,
  AddTaskDto,
  BoardFilter,
  NormalSearchDto,
  AddIssueType,
  AddCategory,
  ReplaceCategory,
  ReplaceIssueType,
  FileUpload,
} from './task.dto';
import { Task } from '../Entity/Task';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, Not, Brackets } from 'typeorm';
import { Request, Response } from 'express';
import { STATUS, SERVICE_EXCEPTION } from '../Enum/Enums.enum';
import { ProjectResourceAllocation } from '../Entity/Project_resource_allocation';
import { pager } from '../Pager/pager';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MailerService } from '@nestjs-modules/mailer';
import { Files } from '../Entity/Files';
import { Status } from '../Entity/Status';
import { Notifications } from '../Entity/Notifications';
import { ProjectRole } from '../Enum/Role.enum';
import { Env } from '../environment';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as fs from 'fs';
import { Category } from '../Entity/Category';
import { Issue } from '../Entity/Issue';
import { TaskRelationship } from '../Entity/TaskRelationship';
import { RecentlyViewed } from '../Entity/Recently_viewed';
import { Profile } from '../Entity/Profile';
import { isInt, isString } from 'class-validator';
@Injectable()
export class TaskService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectRepository(Task) private taskRepo: Repository<Task>,
    @InjectRepository(Project) private projectRepo: Repository<Project>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Files) private fileRepo: Repository<Files>,
    @InjectRepository(TaskHistory) private historyRepo: Repository<TaskHistory>,
    @InjectRepository(Notifications)
    private notifcationRepo: Repository<Notifications>,
    @InjectRepository(ProjectResourceAllocation)
    private resourceAllocationRepo: Repository<ProjectResourceAllocation>,
    private mailService: MailerService, // private task_update_history:Task_historyService
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
    @InjectRepository(Issue) private issueRepo: Repository<Issue>,
    @InjectRepository(ProjectHistory)
    private projectHistoryRepo: Repository<ProjectHistory>,
    @InjectRepository(TaskRelationship)
    private taskRelationRepo: Repository<TaskRelationship>,
    @InjectRepository(RecentlyViewed)
    private recentlyViewedRepo: Repository<RecentlyViewed>,
    @InjectRepository(Profile)
    private profileRepo: Repository<Profile>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async handleCron() {
    let date = new Date();
    let stringDate = date.toISOString().slice(0, 10);
    let dateNow = new Date(stringDate);
    let uncompletedTask = await this.taskRepo.find({
      relations: ['assignee', 'assigner'],
      where: {
        status: STATUS.ACTIVE,
        task_status: TASK_STATUS.INPROGRESS,
        end_date: LessThan(dateNow),
      },
    });
    await Promise.all(
      uncompletedTask.map(async (task) => {
        let dbEndDate = task.end_date.toString();
        if (task.assignee) {
          if (dbEndDate == stringDate) {
            await this.sendTaskReminder(
              task,
              'Today is the last date to complete below mentioned task',
              'This is a gentle reminder regarding your task',
              'Task Reminder',
            );
          } else {
            await this.sendTaskReminder(
              task,
              'The last date to complete below mentioned task have exceeded',
              'This is a gentle reminder regarding your task',
              'Task Reminder',
            );
          }
        }
      }),
    );
  }

  async sendTaskReminder(task, note, head, subject) {
    // await this.mailService.sendMail({
    //   to: task.assignee.email,
    //   from: 'taskmanagementdev@gmail.com',
    //   subject: subject,
    //   text: 'xxxxxxxxxxxx',
    //   template: 'task_reminder',
    //   context: {
    //     task_reminder: {
    //       head: head,
    //       note: note,
    //       task_name: task.task_name,
    //       end_date: task.end_date,
    //       assigned_by: task.assigner.user_name,
    //     },
    //   },
    // });
  }
  // Add task service
  async addTask(taskData: AddTaskDto, req: Request, res: Response) {
    try {
      let project = await this.projectRepo.findOne({
        where: { project_id: taskData.project_id, status: STATUS.ACTIVE },
      });
      if (!project) {
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('project not found'));
      }
      let roleAccess = await this.resourceAllocationRepo.findOne({
        relations: ['role', 'project_id_resource_alloc'],
        where: {
          project_id_resource_alloc: project,
          allocated_user: req['currentUser'],
          allocation_status: ALLOCATION_STATUS.ALLOCATED,
        },
      });
      if (!roleAccess) {
        return res
          .status(SERVICE_EXCEPTION.UN_AUTHORIZED)
          .send({ errorMessage: 'Unauthorized access', statusCode: 399 });
      }
      if (roleAccess.role.role_id == ProjectRole.DEVELOPER) {
        return res
          .status(SERVICE_EXCEPTION.UN_AUTHORIZED)
          .send({ errorMessage: 'Unauthorized access', statusCode: 399 });
      }

      let _parentTaskId = await this.validateParent(taskData, project);
      if (_parentTaskId == 1) {
        return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage: 'parent task not found',
          statusCode: 1071,
        });
      }

      let projectEndDate = new Date(project.end_date);
      let projectStartDate = new Date(project.start_date);
      if (req.body.start_date == 0) {
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('"start_date" must be a valid date'));
      } else if (req.body.end_date == 0) {
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('"end_date" must be a valid date'));
      }
      if (taskData.start_date) {
        //
        let hasStartDateRes = await this.hasStartDate(
          taskData,
          projectStartDate,
          projectEndDate,
        );
        switch (hasStartDateRes) {
          case 1: {
            return res
              .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
              .send(new CustomValidation('"start_date" must be a valid date'));
          }
          case 2: {
            return res
              .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
              .send(new CustomValidation('invalid start date'));
          }
          case 3: {
            return res
              .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
              .send(
                new CustomValidation(
                  '"start_date" must be greater than or equal to projects start dt',
                ),
              );
          }
          case 4: {
            return res
              .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
              .send(
                new CustomValidation(
                  '"start_date" must be less than or equal to projects end dt',
                ),
              );
          }
          default:
        }
      }

      if (taskData.end_date) {
        //
        let hasEndDateRes = await this.hasEndDate(
          taskData,
          projectEndDate,
          projectStartDate,
        );
        switch (hasEndDateRes) {
          case 1: {
            return res
              .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
              .send(new CustomValidation('"end_date" must be a valid date'));
          }
          case 2: {
            return res
              .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
              .send(new CustomValidation('invalid end date'));
          }
          case 3: {
            return res
              .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
              .send(
                new CustomValidation(
                  'end_date cont be grater than end date of project',
                ),
              );
          }
          case 4: {
            return res
              .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
              .send(
                new CustomValidation(
                  'end_date cont be less than start date of project',
                ),
              );
          }
          case 5: {
            return res
              .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
              .send(
                new CustomValidation('end_date is smaller than start date'),
              );
          }
        }
      }
      let noifyUsers = [];
      let stringUser = [];
      let numberUser = [];
      let arrayOfList = [noifyUsers, stringUser, numberUser];
      let validateNameDesc = await this.validateTaskNameandTaskDesc(
        taskData,
        arrayOfList,
        res,
      );
      switch (validateNameDesc) {
        case 1:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(
              new CustomValidation(
                'Task name should only have numbers and alphabet',
              ),
            );
        case 2:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(
              new CustomValidation(
                '"task_description" length must be at least 10 characters long',
              ),
            );
        case 3:
          return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
            errorMessage: 'notify must be number ' + stringUser,
            statusCode: 3578,
          });

        default:
      }
      return await this.addTaskSub(taskData, project, req, _parentTaskId, res);
    } catch (error) {
      this.logger.error('add task  in task service  ,   ' + error);
      return res
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }

  async addTaskSub(taskData, project, req, _parentTaskId, res) {
    let actualHours = null;
    let estimatedHours = null;
    let validateActualEstimatedHrRes = await this.validateActualEstimatedHr(
      taskData,
    );
    switch (validateActualEstimatedHrRes) {
      case 1: {
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(
            new CustomValidation(
              '"actual_hours" must have no more than 2 decimal places',
            ),
          );
      }
      case 2: {
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(
            new CustomValidation(
              '"estimated_hours" must have no more than 2 decimal places',
            ),
          );
      }
      default: {
        actualHours = validateActualEstimatedHrRes[0];
        estimatedHours = validateActualEstimatedHrRes[1];
      }
    }

    let taskExist = await this.taskRepo
      .createQueryBuilder('task')
      .where('task.task_name =:taskName', {
        taskName: taskData.task_name.trim(),
      })
      .andWhere(' task.project_id =:projectId', {
        projectId: project.project_id,
      })
      .andWhere('task.status =:status', {
        status: STATUS.ACTIVE,
      })
      .getOne();

    if (taskExist) {
      return res
        .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
        .send(new CustomValidation('task exist in the project'));
    }

    let category = null;
    let issue = null;
    let checkCategoryAndIssueRes = await this.checkCategoryAndIssue(taskData);
    switch (checkCategoryAndIssueRes) {
      case 1: {
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('category not found'));
      }
      case 2: {
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('issue not found'));
      }
      default: {
        category = checkCategoryAndIssueRes[0];
        issue = checkCategoryAndIssueRes[1];
      }
    }

    let createTaskData = {
      task_name: taskData.task_name.trim(),
      task_description: taskData.task_description.trim(),
      task_category: category,
      task_issue: issue,
      priority: taskData.priority,
      actual_hours: actualHours,
      estimated_hours: estimatedHours,
      start_date: taskData.start_date,
      end_date: taskData.end_date,
      project_id: project,
      status: STATUS.ACTIVE,
      task_status: TASK_STATUS.OPEN,
      created_date: new Date(),
      updated_date: new Date(),
      created_by: req['currentUser'],
      updated_by: req['currentUser'],
      assignee: null,
      assigner: null,
      task_relation: TASK_RELATION.NORMAL,
    };

    if (taskData.assignee) {
      //
      let setAssigneeRes = await this.setAssignee(taskData, project);
      switch (setAssigneeRes) {
        case 1: {
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('assignee is not part of project'));
        }
        case 2: {
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('user not found'));
        }
        default: {
          createTaskData.assignee = setAssigneeRes;
          createTaskData.assigner = await req['currentUser'];
          break;
        }
      }
    }
    let task = await this.taskRepo.save(createTaskData);
    let parentDto = taskData.parent_id;
    await this.setParentAddTask(_parentTaskId, project, task, parentDto);
    let rejectUsersInAddTask = new Array();
    let allocatedUsersInAddTask = new Array();
    if (taskData.notify) {
      let notfyAddTaskRes = await this.notfyAddTask(
        taskData,
        project,
        task,
        req,
        rejectUsersInAddTask,
        allocatedUsersInAddTask,
      );
      switch (notfyAddTaskRes) {
        case 1:
          return res.status(SERVICE_EXCEPTION.SUCCESS_RESPONSE).send({
            task_id: task.task_id,
            errorMessage:
              'task created notification to ' + rejectUsersInAddTask + 'failed',
            statusCode: 1770,
          });
        case 2:
          return res.status(SERVICE_EXCEPTION.SUCCESS_RESPONSE).send({
            task_id: task.task_id,
            successMessage: 'task created few notified ',
            errorMessage: rejectUsersInAddTask + 'failed',
            statusCode: 1771,
          });

        default:
      }
    }
    if (!task) {
      return res
        .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
        .send(new CustomValidation('could not crete task'));
    }
    project.total_task = project.total_task + 1;
    await this.projectRepo.save(project);
    if (task.assignee) {
      let notify = this.notifcationRepo.create({
        content: 'New Task has assigned by ' + task.assigner.user_name,
        status: STATUS.ACTIVE,
        view_status: NOTIFCATION_STATUS.NOTVIEWED,
        created_date: new Date(),
        updated_date: new Date(),
        project_id_notification: project,
        task_id_notification: task,
        user_id_notification: task.assignee,
        user_created_notification: req['currentUser'],
        action: NOTIFICATION_ENUM.ASSIGN_TASK,
      });
      await this.notifcationRepo.save(notify);
      try {
        await this.sendTaskReminder(
          task,
          'You have assigned a new task',
          'new task is assigned to you',
          'New task for you',
        );
      } catch (error) {
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('getaddrinfo EAI_AGAIN smtp.gmail.com'));
      }
    }
    if (task.assignee == null) {
      await this.setTaskHistory(TASK_HISTORY_ACTION.CREATE_TASK, task);
    } else {
      await this.setTaskHistory(TASK_HISTORY_ACTION.CREATE_AND_ASSIGN, task);
    }
    return res.status(SERVICE_EXCEPTION.SUCCESS_RESPONSE).send({
      task_id: task.task_id,
      statusCode: ErrorStatus.SUCCESS,
    });
  }
  async setParentAddTask(_parentTaskId, project, task, parentDto) {
    if (Number(parentDto) != 0) {
      let _alreadyExist = await this.taskRelationRepo
        .createQueryBuilder('relation')
        .where('relation.project_id = :project_id', {
          project_id: project.project_id,
        })
        .andWhere('relation.parent_task_id = :parent_task_id', {
          parent_task_id: _parentTaskId.task_id,
        })
        .andWhere('relation.child_task_id = :child_task_id', {
          child_task_id: task.task_id,
        })
        .getMany();
      if (_alreadyExist.length == 0) {
        _parentTaskId.task_relation = TASK_RELATION.PARENT;
        task.task_relation = TASK_RELATION.CHILD;
        let parentTask = await this.taskRepo.save(_parentTaskId);
        let childTask = await this.taskRepo.save(task);
        let _relation = this.taskRelationRepo.create({
          task_id_parent: parentTask,
          task_id_child: childTask,
          created_date: new Date(),
          updated_date: new Date(),
          project_id_task_relationship: project,
          status: Status.ACTIVE,
        });
        await this.taskRelationRepo.save(_relation);
      }
    }
  }

  async notfyAddTask(
    taskData,
    project,
    task,
    req,
    rejectUsersInAddTask,
    allocatedUsersInAddTask,
  ) {
    if (taskData.notify.length != 0) {
      let users = new Set(taskData.notify);
      await Promise.all(
        Array.from(users).map(async (user) => {
          let UserExists = await this.userRepo.findOne({
            where: {
              user_id: Number(user),
              status: Status.ACTIVE,
            },
          });
          if (!UserExists) {
            rejectUsersInAddTask.push(user);
          } else {
            let projectAllocated = await this.resourceAllocationRepo.findOne({
              where: {
                project_id_resource_alloc: project,
                allocated_user: UserExists,
                allocation_status: ALLOCATION_STATUS.ALLOCATED,
                status: STATUS.ACTIVE,
              },
            });
            !projectAllocated
              ? rejectUsersInAddTask.push(UserExists.user_name)
              : allocatedUsersInAddTask.push(UserExists);
          }
        }),
      );
      await Promise.all(
        allocatedUsersInAddTask.map(async (user) => {
          let notify = this.notifcationRepo.create({
            project_id_notification: project,
            task_id_notification: task,
            user_id_notification: user,
            status: STATUS.ACTIVE,
            view_status: NOTIFCATION_STATUS.NOTVIEWED,
            created_date: new Date(),
            updated_date: new Date(),
            user_created_notification: req['currentUser'],
            content: 'New task added',
            action: NOTIFICATION_ENUM.NOTIFY,
          });
          await this.notifcationRepo.save(notify);
          let email = user['email'];
          // await this.sentNotify(task, email);
        }),
      );
      if (
        rejectUsersInAddTask.length > 0 &&
        allocatedUsersInAddTask.length == 0
      ) {
        return 1;
      } else if (
        rejectUsersInAddTask.length > 0 &&
        allocatedUsersInAddTask.length > 0
      ) {
        return 2;
      }
    }
  }
  async checkCategoryAndIssue(taskData) {
    let category = null;
    let issue = null;
    let responseObj = [];
    if (taskData.category != null) {
      category = await this.categoryRepo.findOne({
        where: {
          category_id: taskData.category,
          status: STATUS.ACTIVE,
        },
      });
      if (!category) {
        return 1;
      }
    }
    if (taskData.issue_type != null) {
      issue = await this.issueRepo.findOne({
        where: { issue_id: taskData.issue_type, status: STATUS.ACTIVE },
      });
      if (!issue) {
        return 2;
      }
    }
    responseObj.push(category);
    responseObj.push(issue);
    return responseObj;
  }

  async setAssignee(taskData, project) {
    let assignee = await this.userRepo.findOne({
      where: { user_id: taskData.assignee, status: STATUS.ACTIVE },
    });
    if (assignee) {
      let assigneePartOfProject = await this.resourceAllocationRepo.findOne({
        where: {
          allocated_user: assignee,
          project_id_resource_alloc: project,
          allocation_status: ALLOCATION_STATUS.ALLOCATED,
        },
      });
      if (assigneePartOfProject) {
        return assignee;
      } else {
        return 1;
      }
    } else {
      return 2;
    }
  }

  async validateActualEstimatedHr(taskData) {
    let actualHours = null;
    let estimatedHours = null;
    let arr = [];
    if (taskData.actual_hours) {
      actualHours = await this.validateHour(taskData.actual_hours);
      if (actualHours == 'invalid') {
        return 1;
      }
    }
    if (taskData.estimated_hours) {
      estimatedHours = await this.validateHour(taskData.estimated_hours);
      if (estimatedHours == 'invalid') {
        return 2;
      }
    }
    arr.push(actualHours);
    arr.push(estimatedHours);

    return arr;
  }
  async hasEndDate(taskData, projectEndDate, projectStartDate) {
    if (!isString(taskData.end_date)) {
      return 1;
    }
    let validatedEndDate = await this.validateDate(taskData.end_date);
    if (!validatedEndDate) {
      return 2;
    }
    let end_date = new Date(taskData.end_date);
    if (end_date > projectEndDate) {
      return 3;
    } else if (end_date < projectStartDate) {
      return 4;
    }
    if (taskData.start_date) {
      let start_date = new Date(taskData.start_date);
      if (end_date < start_date) {
        return 5;
      }
    }
  }

  async hasStartDate(taskData, projectStartDate, projectEndDate) {
    if (!isString(taskData.start_date)) {
      return 1;
    }
    let validatedStartDate = await this.validateDate(taskData.start_date);
    if (!validatedStartDate) {
      return 2;
    }
    let start_date = new Date(taskData.start_date);

    if (projectStartDate > start_date) {
      return 3;
    } else if (start_date > projectEndDate) {
      return 4;
    }
  }

  async validateParent(taskData, project) {
    let _parentDto = taskData.parent_id;
    if (_parentDto) {
      if (Number(_parentDto) != 0) {
        let _parentTask = await this.taskRepo
          .createQueryBuilder('taskParent')
          .leftJoinAndSelect('taskParent.project_id', 'project_id')
          .where('taskParent.status =:status', { status: STATUS.ACTIVE })
          .andWhere('taskParent.project_id =:project_id', {
            project_id: project.project_id,
          })
          .andWhere('taskParent.task_id =:task_id', {
            task_id: Number(_parentDto),
          })
          .andWhere('taskParent.task_relation !=:task_relation', {
            task_relation: TASK_RELATION.CHILD,
          })
          .andWhere('taskParent.task_status !=:task_status', {
            task_status: TASK_STATUS.CLOSED,
          })
          .getOne();
        if (!_parentTask) {
          return 1;
        } else {
          return _parentTask;
        }
      }
    }
  }

  async setTaskHistory(historyType, data) {
    let historyData = new SetTaskHistoryView(data);
    let history = await this.historyRepo.save(
      this.historyRepo.create({
        ...historyData,
        action: historyType,
        task_history_status: STATUS.ACTIVE,
        created_date: new Date(),
        updated_date: new Date(),
        history_type: HISTORY_TYPE.TASK_HISTORY,
      }),
    );
    if (history) {
      return true;
    }
  }

  async validateHour(date) {
    if (date.match(/^\S+$/)) {
      if (date.toString().split('.').length > 2) {
        return 'invalid';
      }
      let beforeDecimal = date.toString().split('.')[0];
      let afterDecimal = date.toString().split('.')[1] || '00';
      if (!beforeDecimal.match(/^\d*$/) || !afterDecimal.match(/^\d*$/)) {
        return 'invalid';
      }
      let floatedBeforeDecimal = parseFloat(beforeDecimal) || 0;
      let hour = floatedBeforeDecimal.toString() + '.' + afterDecimal;

      if (hour.match(/^\d{0,2}(\.\d{1,2})?$/)) {
        return this.validateHourSub(beforeDecimal, afterDecimal, hour);
      } else {
        return 'invalid';
      }
    } else {
      return 'invalid';
    }
  }

  async validateHourSub(beforeDecimal: any, afterDecimal: any, hour: any) {
    if (parseInt(beforeDecimal) > 72) {
      return 'invalid';
    }
    if (parseInt(afterDecimal) > 99) {
      return 'invalid';
    }
    if (parseInt(beforeDecimal) == 72 && parseInt(afterDecimal) > 0) {
      return 'invalid';
    }
    if (parseInt(beforeDecimal) == 0 && parseInt(afterDecimal) <= 0) {
      return 'invalid';
    }
    return hour;
  }

  async getTaskById(task_id: number, req: Request, res: Response) {
    try {
      let task = await this.taskRepo.findOne({
        relations: [
          'project_id',
          'assignee',
          'assigner',
          'created_by',
          'updated_by',
          'task_category',
          'task_issue',
        ],
        where: { task_id, status: STATUS.ACTIVE },
      });
      if (task) {
        let userAccess = await this.resourceAllocationRepo.findOne({
          relations: ['role'],
          where: {
            project_id_resource_alloc: task.project_id,
            allocated_user: req['currentUser'],
            allocation_status: ALLOCATION_STATUS.ALLOCATED,
          },
        });
        if (userAccess) {
          let taskFiles = await this.fileRepo
            .createQueryBuilder('files')
            .where('files.task_id =:task_id', { task_id: task.task_id })
            .andWhere('files.status = :status', { status: STATUS.ACTIVE })
            .getMany();
          let recentUpdates = [];
          let taskHistory = await this.historyRepo
            .createQueryBuilder('taskHistory')
            .leftJoinAndSelect(
              'taskHistory.assignee_history',
              'assignee_history',
            )
            .leftJoinAndSelect(
              'taskHistory.new_assignee_history',
              'new_assignee_history',
            )
            .leftJoinAndSelect(
              'taskHistory.assigner_history',
              'assigner_history',
            )
            .leftJoinAndSelect(
              'taskHistory.new_assigner_history',
              'new_assigner_history',
            )
            .leftJoinAndSelect(
              'taskHistory.created_by_history',
              'created_by_history',
            )
            .leftJoinAndSelect('taskHistory.file_history', 'file_history')
            .leftJoinAndSelect(
              'taskHistory.task_category_history',
              'task_category_history',
            )
            .leftJoinAndSelect(
              'taskHistory.task_issue_history',
              'task_issue_history',
            )
            .leftJoinAndSelect(
              'taskHistory.new_task_category_history',
              'new_task_category_history',
            )
            .leftJoinAndSelect(
              'taskHistory.new_task_issue_history',
              'new_task_issue_history',
            )
            .leftJoinAndSelect('taskHistory.task_history', 'task_history')
            .where('taskHistory.task_id = :task_id', {
              task_id: task.task_id,
            })
            .andWhere(
              'taskHistory.task_history_status = :task_history_status',
              {
                task_history_status: STATUS.ACTIVE,
              },
            )
            .andWhere('taskHistory.history_type =:history_type', {
              history_type: HISTORY_TYPE.TASK_HISTORY,
            })
            .orderBy('taskHistory.task_history_id', 'DESC')
            .getMany();
          Promise.all(
            taskHistory.map(async (value) => {
              recentUpdates.push(new TaskHistoryView(value));
            }),
          );
          let fileDetails = new LoopTaskFilesView(taskFiles);
          let taskDetails: any;
          if (task.task_relation == TASK_RELATION.CHILD) {
            let _child = await this.taskRelationRepo
              .createQueryBuilder('parent')
              .leftJoinAndSelect('parent.task_id_parent', 'task_id_parent')
              .where('parent.task_id_child =:task_id_child', {
                task_id_child: task.task_id,
              })
              .andWhere(
                'parent.project_id_task_relationship =:project_id_task_relationship',
                { project_id_task_relationship: task.project_id.project_id },
              )
              .andWhere('parent.status = :status', { status: STATUS.ACTIVE })
              .getOne();

            taskDetails = new TaskView(task, _child);
          } else {
            taskDetails = new TaskView(task, null);
          }

          let project = task.project_id;
          let user = req['currentUser'];

          let _Recentview = await this.recentlyViewedRepo
            .createQueryBuilder('recent')
            .leftJoinAndSelect(
              'recent.task_recently_viewed',
              'task_recently_viewed',
            )
            .leftJoinAndSelect(
              'recent.project_recently_viewed',
              'project_recently_viewed',
            )
            .leftJoinAndSelect(
              'recent.user_recently_viewed',
              'user_recently_viewed',
            )
            .where('recent.task_id =:task_id', { task_id: task.task_id })
            .andWhere('recent.project_id =:project_id', {
              project_id: project.project_id,
            })
            .andWhere('recent.user_id =:user_id', { user_id: user.user_id })
            .andWhere('recent.status =:status', { status: Status.ACTIVE })
            .getOne();
          this.logger.debug('recently viewed', _Recentview);

          if (_Recentview == null) {
            let _newRecentlyViewed = this.recentlyViewedRepo.create({
              user_recently_viewed: req['currentUser'],
              project_recently_viewed: task.project_id,
              task_recently_viewed: task,
              view_date: new Date(),
              status: Status.ACTIVE,
              created_date: new Date(),
              updated_date: new Date(),
            });
            await this.recentlyViewedRepo.save(_newRecentlyViewed);
          } else {
            this.logger.debug(
              'recently viewed task id' +
                _Recentview.task_recently_viewed.task_id +
                'project_id' +
                _Recentview.project_recently_viewed.project_id +
                'user_id' +
                _Recentview.user_recently_viewed.first_name,
            );

            _Recentview.view_date = new Date();
            _Recentview.updated_date = new Date();
            await this.recentlyViewedRepo.save(_Recentview);
          }
          return res
            .status(SERVICE_EXCEPTION.SUCCESS_RESPONSE)
            .send({ taskDetails, fileDetails, recentUpdates });
        } else {
          return res
            .status(SERVICE_EXCEPTION.UN_AUTHORIZED)
            .send({ errorMessage: 'Unauthorized access', statusCode: 399 });
        }
      } else {
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('task not found'));
      }
    } catch (error) {
      this.logger.error('get  task by id in task service  ,   ' + error);
      return res
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }
  async getTaskList(
    project_id: number,
    normalSearchDto: NormalSearchDto,
    req: Request,
    res: Response,
  ) {
    try {
      let projectExist = await this.projectRepo.findOne({
        where: {
          status: Status.ACTIVE,
          project_id: project_id,
        },
      });
      if (!projectExist) {
        return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage: 'Project not found',
          statusCode: 50,
        });
      } else {
        let roleAccess = await this.resourceAllocationRepo.findOne({
          relations: ['role'],
          where: {
            project_id_resource_alloc: projectExist,
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
          return res
            .status(SERVICE_EXCEPTION.UN_AUTHORIZED)
            .send({ errorMessage: 'Unauthorized access', statusCode: 399 });
        }

        let allowedSearchCols = [
          'task_name',
          'task_status',
          'priority',
          'project_id',
        ];
        let allowedSortCols = ['task_id', 'task_name'];
        let value = await this.sub1TaskList(req, res);
        switch (value) {
          case 1:
            return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
              errorMessage: 'Search column missing',
              statusCode: 128,
            });

          case 2:
            return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
              errorMessage: 'Search column missing.',
              statusCode: 128,
            });
          case 3:
            return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
              errorMessage: 'Search column missing ',
              statusCode: 128,
            });
          default:
        }
        let value1 = await this.sub2TaskList(req, res, allowedSearchCols);
        switch (value1) {
          case 1:
            return res
              .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
              .send({ errorMessage: 'Invalid field', statusCode: 68 });

          case 2:
            return res
              .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
              .send({ errorMessage: 'Invalid field ', statusCode: 68 });
          case 3:
            return res
              .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
              .send({ errorMessage: ' Invalid field', statusCode: 68 });
          default:
        }
        let value2 = await this.sub3TaskList(req, res, allowedSortCols);
        switch (value2) {
          case 1:
            return res
              .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
              .send({ errorMessage: 'Missing search key', statusCode: 129 });

          case 2:
            return res
              .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
              .send({ errorMessage: 'Missing search key ', statusCode: 129 });
          case 3:
            return res
              .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
              .send({ errorMessage: ' Missing search key', statusCode: 129 });
          case 4:
            return res
              .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
              .send({ errorMessage: 'Missing sort method', statusCode: 130 });

          case 5:
            return res
              .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
              .send({ errorMessage: 'Missing sort column', statusCode: 131 });
          case 6:
            return res
              .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
              .send({ errorMessage: 'Invalid sort field', statusCode: 140 });
          default:
        }
        return this.sub4TaskList(res, projectExist, normalSearchDto, req);
      }
    } catch (error) {
      this.logger.error('get  task list in task service  ,   ' + error);
      return res
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }
  //sub function 1 tasklist
  async sub1TaskList(req, res) {
    try {
      if (req.query.searchKey && !req.query.searchCol) {
        return 1;
      } else if (req.query.searchKey2 && !req.query.searchCol2) {
        return 2;
      } else if (req.query.searchKey3 && !req.query.searchCol3) {
        return 3;
      }
    } catch (error) {
      this.logger.error(
        ' get  task list sub function 1 in task service  ,   ' + error,
      );
      return res
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }
  //sub function 2 tasklist
  async sub2TaskList(req, res, allowedSearchCols) {
    try {
      if (
        req.query.searchCol &&
        !allowedSearchCols.includes(req.query.searchCol.toString().trim())
      ) {
        return 1;
      } else if (
        req.query.searchCol2 &&
        !allowedSearchCols.includes(req.query.searchCol2.toString().trim())
      ) {
        return 2;
      } else if (
        req.query.searchCol3 &&
        !allowedSearchCols.includes(req.query.searchCol3.toString().trim())
      ) {
        return 3;
      }
    } catch (error) {
      this.logger.error(
        ' get  task list sub function 2 in task service  ,   ' + error,
      );
      return res
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }

  async sub3TaskList(req, res, allowedSortCols) {
    try {
      if (req.query.searchCol && !req.query.searchKey) {
        return 1;
      } else if (req.query.searchCol2 && !req.query.searchKey2) {
        return 2;
      } else if (req.query.searchCol3 && !req.query.searchKey3) {
        return 3;
      }

      if (req.query.sortCol && !req.query.sortMethod) {
        return 4;
      } else if (!req.query.sortCol && req.query.sortMethod) {
        return 5;
      }
      if (
        allowedSortCols &&
        req.query.sortCol &&
        !allowedSortCols.includes(req.query.sortCol.toString().trim())
      ) {
        return 6;
      }
    } catch (error) {
      this.logger.error(
        ' get  task list sub function 3 in task service  ,   ' + error,
      );
      return res
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }
  //sub function 4 tasklist
  async sub4TaskList(res, projectExist, normalSearchDto, req) {
    try {
      let searchCol = req.query.searchCol || 'status';
      let searchKey = req.query.searchKey || 1;
      let queryBuilder = this.taskRepo
        .createQueryBuilder('task')
        .leftJoinAndSelect('task.task_category', 'task_category')
        .leftJoinAndSelect('task.task_issue', 'task_issue')
        .leftJoinAndSelect('task.assignee', 'assignee')
        .leftJoinAndSelect('task.created_by', 'created_by')
        .where('task.status = :status', {
          status: STATUS.ACTIVE,
        })
        .andWhere('task.project_id =:project_id', {
          project_id: projectExist.project_id,
        })
        .andWhere(' task.' + searchCol + ' LIKE:searchKey', {
          searchKey: `%${searchKey
            .toString()
            .trim()
            .replace(/[_+%]/g, '\\$&')}%`,
        });
      if (Number(normalSearchDto.status)) {
        let value: any;
        switch (Number(normalSearchDto.status)) {
          case 1:
            value = [1, 2, 3, 4];
            break;
          case 2:
            value = [1];
            break;
          case 3:
            value = [2];
            break;
          case 4:
            value = [3];
            break;
          case 5:
            value = [4];

            break;
          default:
        }

        queryBuilder.andWhere('task.task_status IN (:...statuses)', {
          statuses: value,
        });
      }
      if (Number(normalSearchDto.subtasking)) {
        let value: any;
        switch (Number(normalSearchDto.subtasking)) {
          case 1:
            value = [1, 2, 3];
            break;
          case 2:
            value = [2];
            break;
          case 3:
            value = [1, 2];
            break;
        }
        queryBuilder.andWhere('task.task_relation IN (:...subtask)', {
          subtask: value,
        });
      }
      if (Number(normalSearchDto.keyWord) != 0) {
        queryBuilder.andWhere('task.task_name like  :keyword', {
          keyword: `%${normalSearchDto.keyWord
            .toString()
            .trim()
            .replace(/[_+%]/g, '\\$&')}%`,
        });
      }

      const paginatedData = await pager(req, queryBuilder, 'task', 'task_id');

      return res.status(SERVICE_EXCEPTION.SUCCESS_RESPONSE).send(paginatedData);
    } catch (error) {
      this.logger.error(
        ' get  task list sub function 4 in task service  ,   ' + error,
      );
      return res
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }

  async updateTask(
    taskData: UpdateTaskDto,
    req: Request,
    task_id: number,
    res: Response,
  ) {
    try {
      const task = await this.taskRepo.findOne({
        relations: [
          'project_id',
          'assignee',
          'assigner',
          'updated_by',
          'created_by',
          'task_category',
          'task_issue',
        ],
        where: { task_id, status: STATUS.ACTIVE },
      });
      if (!task) {
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('task not found'));
      } else if (taskData.project_id != task.project_id.project_id) {
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('cant change project'));
      }
      let roleAccess = await this.resourceAllocationRepo.findOne({
        relations: ['role'],
        where: {
          project_id_resource_alloc: task.project_id,
          allocated_user: req['currentUser'],
          allocation_status: ALLOCATION_STATUS.ALLOCATED,
        },
      });
      if (!roleAccess || roleAccess.role.role_id == ProjectRole.DEVELOPER) {
        return res
          .status(SERVICE_EXCEPTION.UN_AUTHORIZED)
          .send({ errorMessage: 'Unauthorized access', statusCode: 399 });
      }
      let oldData = Object.assign({}, task);
      let actualHours = null;
      let estimatedHours = null;
      let validateActualEstimatedHrRes = await this.validateActualEstimatedHr(
        taskData,
      );
      switch (validateActualEstimatedHrRes) {
        case 1: {
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(
              new CustomValidation(
                '"actual_hours" must have no more than 2 decimal places',
              ),
            );
        }
        case 2: {
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(
              new CustomValidation(
                '"estimated_hours" must have no more than 2 decimal places',
              ),
            );
        }
        default: {
          actualHours = validateActualEstimatedHrRes[0];
          estimatedHours = validateActualEstimatedHrRes[1];
        }
      }

      let category = null;
      let issue = null;
      let checkCategoryAndIssueRes = await this.checkCategoryAndIssue(taskData);
      switch (checkCategoryAndIssueRes) {
        case 1: {
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('category not found'));
        }
        case 2: {
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('issue not found'));
        }
        default: {
          category = checkCategoryAndIssueRes[0];
          issue = checkCategoryAndIssueRes[1];
        }
      }
      let noifyUsers = [];
      let stringUser = [];
      let numberUser = [];
      let value = await this.validateNotifyIsNumber(
        taskData,
        numberUser,
        stringUser,
        noifyUsers,
      );

      if (value == 1) {
        return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage: 'notify must be number ' + stringUser,
          statusCode: 3578,
        });
      }
      this.logger.debug('123456789');
      let commentSuccess = new Array();
      let userNotFound = [];
      let userArray = [];
      let rejectUsers = new Array();
      let allocatedUsers = new Array();
      let array = [userNotFound, rejectUsers, allocatedUsers, userArray];
      let validateNotifyAndComment =
        await this.validateNotifyAndCommentInUpdateTask(
          taskData,
          task,
          task_id,
          commentSuccess,
          req,
          array,
        );
      switch (validateNotifyAndComment) {
        case 1:
          return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
            task_id: task.task_id,
            errorMessage: 'User not found ' + userNotFound,
            statusCode: 1770,
          });
        case 2:
          return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
            task_id: task.task_id,
            errorMessage: 'User not found ' + rejectUsers,
            statusCode: 1770,
          });

        default:
      }

      let noChangeArrray = await this.detectChange(
        taskData,
        oldData,
        category,
        issue,
        actualHours,
        estimatedHours,
      );

      this.logger.debug('pipe1');
      let validateDateAndData = await this.validateDateAndNotify(
        taskData,
        noChangeArrray,
        commentSuccess,
        noifyUsers,
        task,
        req,
      );
      switch (validateDateAndData) {
        case 1:
          return res.status(SERVICE_EXCEPTION.SUCCESS_RESPONSE).send({
            success: 'comment added',
            updateTask: 'no change',
            statusCode: 3522,
          });
        case 2:
          return res.status(SERVICE_EXCEPTION.SUCCESS_RESPONSE).send({
            errorCode: 'notify failed:need to change for notify',
            updateTask: 'no change',
            statusCode: 3522,
          });
        case 3:
          return res
            .status(SERVICE_EXCEPTION.SUCCESS_RESPONSE)
            .send(new CustomValidation('no change in data'));
        case 4:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('"start_date" must be a valid date'));
        case 5:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('"end_date" must be a valid date'));
        case 6:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(
              new CustomValidation(
                '"start_date" must be greater than or equal to projects start dt',
              ),
            );
        case 7:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(
              new CustomValidation(
                'end_date cont be grater than end date of project',
              ),
            );
        case 8:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('end_date is smaller than start date'));
        case 9:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(
              new CustomValidation(
                '"task_description" length must be at least 10 characters long',
              ),
            );
        case 10:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(
              new CustomValidation(
                'Task name should only have numbers and alphabet',
              ),
            );
        case 11:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(
              new CustomValidation(
                '"start_date" must be less than or equal to projects end dt',
              ),
            );
        case 12:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(
              new CustomValidation(
                'end_date cont be less than start date of project',
              ),
            );

        default:
          break;
      }

      let validateTaskNameUpdateTaskRes = await this.validateTaskNameUpdateTask(
        task,
        taskData,
      );
      if (validateTaskNameUpdateTaskRes == 1) {
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('task exist in the project'));
      }

      task.task_name = taskData.task_name.trim();
      task.task_description = taskData.task_description.trim();
      task.task_category = category;
      task.task_issue = issue;
      task.priority = taskData.priority;
      task.actual_hours = actualHours;
      task.estimated_hours = estimatedHours;
      task.start_date = taskData.start_date;
      task.end_date = taskData.end_date;
      task.task_status = taskData.task_status;
      task.updated_date = new Date();
      task.updated_by = req['currentUser'];

      return await this.updateTaskSub(taskData, oldData, task, req, res);
    } catch (error) {
      this.logger.error('update task  in task service  ,   ' + error);
      return res
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('process failed'));
    }
  }

  async updateTaskSub(taskData, oldData, task, req, res) {
    if (taskData.assignee && oldData.assignee) {
      let hasAssigneeUpdateTaskRes = await this.hasAssigneeUpdateTask(
        taskData,
        task,
        oldData,
        req,
      );
      switch (hasAssigneeUpdateTaskRes) {
        case 1:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('assignee is not part of project'));
        case 2:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('user not found'));
        default:
      }
    } else if (taskData.assignee && !oldData.assignee) {
      let hasNoAssigneeOldDataUpdateTaskRes =
        await this.hasNoAssigneeOldDataUpdateTask(taskData, task, req);
      switch (hasNoAssigneeOldDataUpdateTaskRes) {
        case 1:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('assignee is not part of project'));
        case 2:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('user not found'));
        default:
      }
    }
    let rejectUsersNotify = new Array();
    let allocatedUsersNotify = new Array();
    let validateNotify = await this.validateNotfyOnly(
      taskData,
      task,
      req,
      rejectUsersNotify,
      allocatedUsersNotify,
    );
    if (validateNotify == 1 || validateNotify == 2) {
      return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
        task_id: task.task_id,
        errorMessage: 'User not found ' + rejectUsersNotify,
        statusCode: 1770,
      });
    }

    let updatedTask = await this.taskRepo.save(task);
    if (updatedTask.task_status != oldData.task_status) {
      let currentStatus;
      switch (updatedTask.task_status) {
        case 1:
          currentStatus = 'OPEN';
          break;
        case 2:
          currentStatus = 'INPROGRESS';
          break;
        case 3:
          currentStatus = 'RESOLVED';
          break;
        case 4:
          currentStatus = 'CLOSED';
          break;
        default:
      }
      await this.setNotification(
        'Task status changed to ' + currentStatus,
        updatedTask.created_by,
        req,
        NOTIFICATION_ENUM.CHANGE_STATUS,
        task.project_id,
        task,
      );
    }
    await this.updateTaskSendMail(updatedTask, oldData, res);
    await this.getTaskHistoryData(updatedTask, oldData, req, res);
    return res
      .status(SERVICE_EXCEPTION.SUCCESS_RESPONSE)
      .send(new ChangeTaskStatusResponseView(updatedTask));
  }
  async updateTaskSendMail(updatedTask, oldData, res) {
    if (updatedTask.assignee != oldData.assignee) {
      try {
        await this.sendTaskReminder(
          updatedTask,
          'You have assigned a new task',
          'new task is assigned to you',
          'New task for you',
        );
      } catch (error) {
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('getaddrinfo EAI_AGAIN smtp.gmail.com'));
      }
    }
  }
  async validateTaskNameUpdateTask(task, taskData) {
    if (task.task_name != taskData.task_name.trim()) {
      let taskExist = await this.taskRepo
        .createQueryBuilder('task')
        .where('task.task_name =:taskName', {
          taskName: taskData.task_name.trim(),
        })
        .andWhere(' task.project_id =:projectId', {
          projectId: task.project_id.project_id,
        })
        .andWhere('task.status =:status', {
          status: STATUS.ACTIVE,
        })
        .getOne();

      if (taskExist) {
        return 1;
      }
    }
  }

  async hasAssigneeUpdateTask(taskData, task, oldData, req) {
    if (taskData.assignee == -1) {
      task.assignee = null;
    } else if (taskData.assignee != oldData.assignee.user_id) {
      let newAssignee = await this.userRepo.findOne({
        where: { user_id: taskData.assignee, status: STATUS.ACTIVE },
      });
      if (newAssignee) {
        let assigneePartOfProject = await this.resourceAllocationRepo.findOne({
          where: {
            allocated_user: newAssignee,
            project_id_resource_alloc: task.project_id,
            allocation_status: ALLOCATION_STATUS.ALLOCATED,
          },
        });
        if (assigneePartOfProject) {
          task.assignee = newAssignee;
          task.assigner = await req['currentUser'];
          await this.setNotification(
            'A task is reassigned to you by ' + req['currentUser'].user_name,
            task.assignee,
            req,
            NOTIFICATION_ENUM.ASSIGN_TASK,
            task.project_id,
            task,
          );
        } else {
          return 1;
        }
      } else {
        return 2;
      }
    }
  }

  async hasNoAssigneeOldDataUpdateTask(taskData, task, req) {
    if (taskData.assignee == -1) {
      //pass
    } else {
      let newAssignee = await this.userRepo.findOne({
        where: { user_id: taskData.assignee, status: STATUS.ACTIVE },
      });
      if (newAssignee) {
        let assigneePartOfProject = await this.resourceAllocationRepo.findOne({
          where: {
            allocated_user: newAssignee,
            project_id_resource_alloc: task.project_id,
            allocation_status: ALLOCATION_STATUS.ALLOCATED,
          },
        });
        if (assigneePartOfProject) {
          task.assignee = newAssignee;
          task.assigner = await req['currentUser'];
          await this.setNotification(
            'A task is assigned to you by ' + req['currentUser'].user_name,
            task.assignee,
            req,
            NOTIFICATION_ENUM.ASSIGN_TASK,
            task.project_id,
            task,
          );
        } else {
          return 1;
        }
      } else {
        return 2;
      }
    }
  }
  async detectChange(
    taskData,
    oldData,
    category,
    issue,
    actualHours,
    estimatedHours,
  ) {
    let noChangeArray = [];
    if (
      taskData.task_name.trim() == oldData.task_name &&
      taskData.task_description.trim() == oldData.task_description &&
      JSON.stringify(category) == JSON.stringify(oldData.task_category) &&
      JSON.stringify(issue) == JSON.stringify(oldData.task_issue) &&
      taskData.priority == oldData.priority &&
      actualHours == oldData.actual_hours &&
      estimatedHours == oldData.estimated_hours &&
      taskData.start_date == oldData.start_date &&
      taskData.end_date == oldData.end_date &&
      taskData.task_status == oldData.task_status
    ) {
      if (taskData.assignee == null && !oldData.assignee) {
        noChangeArray.push(new CustomValidation('no change in data'));
      } else if (taskData.assignee == -1 && !oldData.assignee) {
        noChangeArray.push(new CustomValidation('no change in data'));
      } else if (taskData.assignee && !oldData.assignee) {
        //pass
      } else if (taskData.assignee == oldData.assignee.user_id) {
        noChangeArray.push(new CustomValidation('no change in data'));
      } else if (!taskData.assignee && oldData.assignee) {
        noChangeArray.push(new CustomValidation('no change in data'));
      }
    }
    return noChangeArray;
  }
  async getTaskHistoryData(
    newData: any,
    oldData: any,
    req: Request,
    res: Response,
  ) {
    try {
      let changes = {};
      let historyRepoData = {};

      for (let value in newData) {
        if (newData[value] != oldData[value]) {
          changes[`${value}`] = newData[value];
        }
      }
      if (Object.keys(changes).length > 2) {
        for (let value in changes) {
          switch (value) {
            case 'task_name':
              historyRepoData['new_task_name'] = newData[value];
              break;
            case 'priority':
              historyRepoData['priority'] = oldData[value];
              historyRepoData['new_priority'] = newData[value];
              break;
            case 'task_category':
              historyRepoData['task_category_history'] = oldData[value];
              historyRepoData['new_task_category_history'] = newData[value];
              break;
            case 'task_issue':
              historyRepoData['task_issue_history'] = oldData[value];
              historyRepoData['new_task_issue_history'] = newData[value];
              break;
            case 'task_description':
              historyRepoData['new_task_description'] = newData[value];
              break;
            case 'estimated_hours':
              historyRepoData['estimated_hours'] = oldData[value];
              historyRepoData['new_estimated_hours'] = newData[value];
              break;
            case 'start_date':
              historyRepoData['start_date'] = oldData[value];
              historyRepoData['new_start_date'] = newData[value];
              break;
            case 'end_date':
              historyRepoData['end_date'] = oldData[value];
              historyRepoData['new_end_date'] = newData[value];
              break;
            case 'actual_hours':
              historyRepoData['actual_hours'] = oldData[value];
              historyRepoData['new_actual_hours'] = newData[value];
              break;
            case 'assignee':
              historyRepoData['assignee_history'] = oldData['assignee'];
              historyRepoData['new_assignee_history'] = newData['assignee'];
              historyRepoData['assigner_history'] = oldData['assigner'];
              historyRepoData['new_assigner_history'] = newData['assigner'];
              break;
            case 'task_status':
              historyRepoData['task_status'] = oldData[value];
              historyRepoData['new_task_status'] = newData[value];
              break;
            default:
          }
        }
        historyRepoData['created_date'] = new Date();
        historyRepoData['updated_date'] = new Date();
        historyRepoData['task_history_status'] = STATUS.ACTIVE;
        if (newData.assignee != oldData.assignee) {
          historyRepoData['action'] = TASK_HISTORY_ACTION.UPDATE_AND_REASSIGN;
        } else {
          historyRepoData['action'] = TASK_HISTORY_ACTION.UPDATE_TASK;
        }
        historyRepoData['created_by_history'] = req['currentUser'];
        historyRepoData['updated_by_history'] = req['currentUser'];
        historyRepoData['task_history'] = newData.project_id;
        historyRepoData['taskHistory'] = newData;
        historyRepoData['task_created_date'] = oldData.created_date;
        historyRepoData['task_name'] = oldData.task_name;
        historyRepoData['task_description'] = oldData.task_description;
        this.historyRepo.save(
          this.historyRepo.create({
            ...historyRepoData,
            history_type: HISTORY_TYPE.TASK_HISTORY,
          }),
        );
      }
    } catch (error) {
      this.logger.error('get task history data in task service  ,   ' + error);
      return res
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('process failed'));
    }
  }

  async changeTaskStatus(
    taskStatus: ChangeTaskStatus,
    task_id: number,
    req: Request,
    res: Response,
  ) {
    try {
      let task = await this.taskRepo.findOne({
        relations: ['project_id', 'assignee', 'created_by'],
        where: { task_id, status: STATUS.ACTIVE },
      });
      if (!task) {
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('task not found'));
      }
      let userPartOfProject = await this.resourceAllocationRepo.findOne({
        where: {
          allocated_user: req['currentUser'],
          allocation_status: ALLOCATION_STATUS.ALLOCATED,
          project_id_resource_alloc: task.project_id,
        },
      });
      if (!userPartOfProject) {
        return res
          .status(SERVICE_EXCEPTION.UN_AUTHORIZED)
          .send({ errorMessage: 'Unauthorized access', statusCode: 399 });
      }
      let oldData = Object.assign({}, task);

      if (taskStatus.assignee) {
        return await this.assignExistMethod(
          taskStatus,
          res,
          oldData,
          task,
          req,
        );
      } else if (taskStatus.assignee == null) {
        if (oldData.assignee) {
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('you cant remove assignee'));
        } else if (!oldData.assignee) {
          if (taskStatus.task_status == oldData.task_status) {
            return res
              .status(SERVICE_EXCEPTION.SUCCESS_RESPONSE)
              .send(new CustomValidation('no change in data'));
          }

          task.task_status = taskStatus.task_status;
          task.updated_date = new Date();
          task.updated_by = req['currentUser'];
          let result = await this.taskRepo.save(task);
          if (result) {
            let historyData = new ChangeTaskStatusView(
              result,
              oldData,
              TASK_HISTORY_ACTION.CHANGE_STATUS,
            );
            this.historyRepo.save(
              this.historyRepo.create({
                ...historyData,
                created_by_history: req['currentUser'],
                updated_by_history: req['currentUser'],
                task_history: task.project_id,
                taskHistory: result,
                history_type: HISTORY_TYPE.TASK_HISTORY,
              }),
            );
          }
          return res
            .status(SERVICE_EXCEPTION.SUCCESS_RESPONSE)
            .send(new ChangeTaskStatusResponseView(task));
        }
      }
    } catch (error) {
      this.logger.error('change task status in task service  ,   ' + error);
      return res
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }
  async assignExistMethod(taskStatus, res, oldData, task, req) {
    let sentMail = false;
    let assignee = await this.userRepo.findOne({
      where: { user_id: taskStatus.assignee },
    });
    if (!assignee) {
      return res
        .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
        .send(new CustomValidation('user not found'));
    }
    if (taskStatus.task_status == oldData.task_status) {
      let checkChangeInDateRes = await this.checkChangeInDate(
        taskStatus,
        oldData,
      );
      if (checkChangeInDateRes == 1) {
        return res
          .status(SERVICE_EXCEPTION.SUCCESS_RESPONSE)
          .send(new CustomValidation('no change in data'));
      }
    }
    let assigneePartOfProject = await this.resourceAllocationRepo.findOne({
      where: {
        allocated_user: assignee,
        project_id_resource_alloc: task.project_id,
        allocation_status: ALLOCATION_STATUS.ALLOCATED,
      },
    });
    if (!assigneePartOfProject) {
      return res
        .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
        .send(new CustomValidation('assignee is not part of project'));
    }
    task.task_status = taskStatus.task_status;
    task.assignee = assignee;
    task.assigner = req['currentUser'];
    task.updated_date = new Date();
    task.updated_by = req['currentUser'];
    let result = await this.taskRepo.save(task);

    if (result) {
      let currentStatus = await this.currentStatusChangeTaskStatus(result);
      let changeTaskStatusSubRes = await this.changeTaskStatusSub(
        result,
        oldData,
      );
      switch (changeTaskStatusSubRes) {
        case 1: {
          sentMail = true;
          let historyData = new ChangeTaskStatusAndAssigneeView(
            result,
            oldData,
            TASK_HISTORY_ACTION.CHANGED_STATUS_ASSIGNEE,
          );
          this.historyRepo.save(
            this.historyRepo.create({
              ...historyData,
              created_by_history: req['currentUser'],
              updated_by_history: req['currentUser'],
              task_history: task.project_id,
              taskHistory: result,
              history_type: HISTORY_TYPE.TASK_HISTORY,
            }),
          );
          await this.setNotification(
            'Task status changed to ' + currentStatus,
            task.created_by,
            req,
            NOTIFICATION_ENUM.CHANGE_STATUS,
            task.project_id,
            result,
          );
          await this.setNotification(
            'A task is reassigned to you by ' + req['currentUser'].user_name,
            result.assignee,
            req,
            NOTIFICATION_ENUM.ASSIGN_TASK,
            task.project_id,
            result,
          );
          break;
        }
        case 2: {
          let historyData = new ChangeTaskStatusView(
            result,
            oldData,
            TASK_HISTORY_ACTION.CHANGE_STATUS,
          );
          this.historyRepo.save(
            this.historyRepo.create({
              ...historyData,
              created_by_history: req['currentUser'],
              updated_by_history: req['currentUser'],
              task_history: task.project_id,
              taskHistory: result,
              history_type: HISTORY_TYPE.TASK_HISTORY,
            }),
          );
          await this.setNotification(
            'Task status changed to ' + currentStatus,
            task.created_by,
            req,
            NOTIFICATION_ENUM.CHANGE_STATUS,
            task.project_id,
            result,
          );
          break;
        }
        case 3: {
          sentMail = true;
          let historyData = new ChangeTaskAssigneeView(
            result,
            oldData,
            TASK_HISTORY_ACTION.CHANGE_ASSIGNEE,
          );
          this.historyRepo.save(
            this.historyRepo.create({
              ...historyData,
              created_by_history: req['currentUser'],
              updated_by_history: req['currentUser'],
              task_history: task.project_id,
              taskHistory: result,
              history_type: HISTORY_TYPE.TASK_HISTORY,
            }),
          );
          await this.setNotification(
            'A task is reassigned to you by ' + req['currentUser'].user_name,
            result.assignee,
            req,
            NOTIFICATION_ENUM.ASSIGN_TASK,
            task.project_id,
            result,
          );
          break;
        }
        case 4: {
          sentMail = true;
          let historyData = new ChangeTaskStatusAndAssigneeView(
            result,
            oldData,
            TASK_HISTORY_ACTION.CHANGED_STATUS_ASSIGNEE,
          );
          this.historyRepo.save(
            this.historyRepo.create({
              ...historyData,
              created_by_history: req['currentUser'],
              updated_by_history: req['currentUser'],
              task_history: task.project_id,
              taskHistory: result,
              history_type: HISTORY_TYPE.TASK_HISTORY,
            }),
          );
          await this.setNotification(
            'Task status changed to ' + currentStatus,
            task.created_by,
            req,
            NOTIFICATION_ENUM.CHANGE_STATUS,
            task.project_id,
            result,
          );
          await this.setNotification(
            'A task is assigned to you by ' + req['currentUser'].user_name,
            result.assignee,
            req,
            NOTIFICATION_ENUM.ASSIGN_TASK,
            task.project_id,
            result,
          );
          break;
        }
        default:
      }
    }
    if (sentMail) {
      try {
        await this.sendTaskReminder(
          task,
          'You have assigned a new task',
          'new task is assigned to you',
          'New task for you',
        );
      } catch (error) {
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('getaddrinfo EAI_AGAIN smtp.gmail.com'));
      }
    }
    return res
      .status(SERVICE_EXCEPTION.SUCCESS_RESPONSE)
      .send(new ChangeTaskStatusResponseView(task));
  }
  async changeTaskStatusSub(result, oldData) {
    if (
      result.task_status != oldData.task_status &&
      result.assignee.user_id &&
      !oldData.assignee
    ) {
      return 1;
    } else if (
      result.task_status != oldData.task_status &&
      result.assignee.user_id == oldData.assignee.user_id
    ) {
      return 2;
    } else if (
      result.task_status == oldData.task_status &&
      result.assignee != oldData.assignee
    ) {
      return 3;
    } else if (
      result.task_status != oldData.task_status &&
      result.assignee != oldData.assignee
    ) {
      return 4;
    }
  }

  async checkChangeInDate(taskStatus: any, oldData: any) {
    if (taskStatus.assignee == null && !oldData.assignee) {
      return 1;
    } else if (taskStatus.assignee && !oldData.assignee) {
      //pass
    } else if (taskStatus.assignee == oldData.assignee.user_id) {
      return 1;
    }
  }

  async currentStatusChangeTaskStatus(result: any) {
    let currentStatus: string;
    if (result.task_status == 1) {
      currentStatus = 'OPEN';
    } else if (result.task_status == 2) {
      currentStatus = 'INPROGRESS';
    } else if (result.task_status == 3) {
      currentStatus = 'RESOLVED';
    } else if (result.task_status == 4) {
      currentStatus = 'CLOSED';
    }
    return currentStatus;
  }

  async setNotification(content, user, req, action, project, task) {
    let notify = this.notifcationRepo.create({
      content: content, //'Task status changed to ' + currentStatus,
      user_id_notification: user,
      created_date: new Date(),
      updated_date: new Date(),
      project_id_notification: project,
      task_id_notification: task,
      status: STATUS.ACTIVE,
      view_status: NOTIFCATION_STATUS.NOTVIEWED,
      user_created_notification: req['currentUser'],
      action: action,
    });
    await this.notifcationRepo.save(notify);
  }

  async confirmTaskDelete(task_id: number, req: Request, res: Response) {
    try {
      let task = await this.taskRepo.findOne({
        relations: ['project_id'],
        where: { task_id, status: STATUS.ACTIVE },
      });
      if (!task) {
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('task not found'));
      }
      let roleAccess = await this.resourceAllocationRepo.findOne({
        relations: ['role'],
        where: {
          project_id_resource_alloc: task.project_id,
          allocated_user: req['currentUser'],
          allocation_status: ALLOCATION_STATUS.ALLOCATED,
        },
      });
      if (!roleAccess) {
        return res
          .status(SERVICE_EXCEPTION.UN_AUTHORIZED)
          .send({ errorMessage: 'Unauthorized access', statusCode: 399 });
      }

      if (
        roleAccess.role.role_id == ProjectRole.PROJECT_MANAGER ||
        roleAccess.role.role_id == ProjectRole.PROJECT_ADMIN ||
        roleAccess.role.role_id == ProjectRole.GUEST ||
        roleAccess.role.role_id == ProjectRole.REPORTER
      ) {
        if (task.task_status == TASK_STATUS.INPROGRESS) {
          return res.status(SERVICE_EXCEPTION.SUCCESS_RESPONSE).send({
            warningMessage: 'The task is in a status of in-progress',
            statusCode: 202,
          });
        } else {
          return res.status(SERVICE_EXCEPTION.SUCCESS_RESPONSE).send({
            successMessage: 'Can delete the task',
            statusCode: 200,
          });
        }
      } else {
        return res
          .status(SERVICE_EXCEPTION.UN_AUTHORIZED)
          .send({ errorMessage: 'Unauthorized access', statusCode: 399 });
      }
    } catch (error) {
      this.logger.error('confirm delete task in task service  ,   ' + error);
      return res
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }

  async softDeleteTask(task_id, req: Request, res: Response) {
    try {
      let task = await this.taskRepo.findOne({
        relations: ['project_id'],
        where: { task_id, status: STATUS.ACTIVE },
      });
      if (!task) {
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('task not found'));
      }
      let roleAccess = await this.resourceAllocationRepo.findOne({
        relations: ['role'],
        where: {
          project_id_resource_alloc: task.project_id,
          allocated_user: req['currentUser'],
          allocation_status: ALLOCATION_STATUS.ALLOCATED,
        },
      });
      if (!roleAccess) {
        return res
          .status(SERVICE_EXCEPTION.UN_AUTHORIZED)
          .send({ errorMessage: 'Unauthorized access', statusCode: 399 });
      }
      if (
        roleAccess.role.role_id == ProjectRole.PROJECT_MANAGER ||
        roleAccess.role.role_id == ProjectRole.PROJECT_ADMIN ||
        roleAccess.role.role_id == ProjectRole.GUEST ||
        roleAccess.role.role_id == ProjectRole.REPORTER
      ) {
        let project = await this.projectRepo.findOne({
          where: {
            project_id: task.project_id.project_id,
            status: STATUS.ACTIVE,
          },
        });
        project.total_task = project.total_task - 1;
        await this.projectRepo.save(project);
        await this.recentlyViewedRepo.update(
          { task_recently_viewed: task },
          { status: STATUS.INACTIVE },
        );
        let TaskArr = [];
        if (task.task_relation == TASK_RELATION.CHILD) {
          let _prarentTask1 = await this.taskRelationRepo
            .createQueryBuilder('taskRelation')
            .leftJoinAndSelect('taskRelation.task_id_child', 'task_id_child')
            .leftJoinAndSelect('taskRelation.task_id_parent', 'task_id_parent')
            .where('taskRelation.task_id_child =:task', { task: task.task_id })
            .andWhere('taskRelation.project_id =:project_id', {
              project_id: project.project_id,
            })
            .getOne();
          await this.parentTaskList(_prarentTask1, project);
          await this.taskRelationRepo.update(
            { task_id_child: task },
            { status: Status.INACTIVE },
          );
        } else if (task.task_relation == TASK_RELATION.PARENT) {
          let parentTaskList = await this.taskRelationRepo
            .createQueryBuilder('taskRelation')
            .leftJoinAndSelect('taskRelation.task_id_child', 'task_id_child')
            .where('taskRelation.parent_task_id =:task', { task: task.task_id })
            .getMany();
          for (const iterator of parentTaskList) {
            TaskArr.push(iterator.task_id_child);
          }
          await Promise.all(
            TaskArr.map(async (value) => {
              value.status = STATUS.INACTIVE;
              await this.taskRepo.save(value);
            }),
          );
          await this.taskRelationRepo.update(
            { task_id_parent: task },
            { status: Status.INACTIVE },
          );
        }

        task.status = STATUS.INACTIVE;
        let taskDelete = await this.taskRepo.save(task);
        if (taskDelete.status == STATUS.INACTIVE) {
          await this.fileRepo.update(
            { task_id_file: task },
            { status: STATUS.INACTIVE },
          );
          await this.historyRepo.save(
            this.historyRepo.create({
              task_id: taskDelete.task_id,
              task_name: taskDelete.task_name,
              task_created_date: taskDelete.created_date,
              action: TASK_HISTORY_ACTION.DELETE_TASK,
              task_history_status: STATUS.ACTIVE,
              task_description: taskDelete.task_description,
              created_date: new Date(),
              updated_date: new Date(),
              task_history: task.project_id,
              created_by_history: req['currentUser'],
              updated_by_history: req['currentUser'],
              history_type: HISTORY_TYPE.TASK_HISTORY,
            }),
          );
          return res
            .status(SERVICE_EXCEPTION.SUCCESS_RESPONSE)
            .send({ successMessage: 'Task deleted', statusCode: 200 });
        } else {
          return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
            errorMessage: 'Task deletion failed',
            statusCode: 803,
          });
        }
      } else {
        return res
          .status(SERVICE_EXCEPTION.UN_AUTHORIZED)
          .send({ errorMessage: 'Unauthorized access', statusCode: 399 });
      }
    } catch (error) {
      this.logger.error('soft delete task in task service  ,   ' + error);
      return res
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }

  async parentTaskList(_prarentTask1, project) {
    let childList = await this.taskRelationRepo
      .createQueryBuilder('taskRelationCount')
      .leftJoinAndSelect('taskRelationCount.task_id_child', 'task_id_child')
      .where('taskRelationCount.parent_task_id =:task', {
        task: _prarentTask1.task_id_parent.task_id,
      })
      .andWhere('taskRelationCount.project_id =:project_id', {
        project_id: project.project_id,
      })
      .andWhere('taskRelationCount.status =:status', { status: Status.ACTIVE })
      .getCount();
    if (childList <= 1) {
      _prarentTask1.task_id_parent.task_relation = TASK_RELATION.NORMAL;
      await this.taskRepo.save(_prarentTask1.task_id_parent);
    }
  }
  // file upload
  async uploadFile(
    file,
    req: Request,
    task_id: number,
    uniqueFileName,
    maxSize,
    fileRealName: FileUpload,
    res: Response,
  ) {
    try {
      if (!file) {
        return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage: 'File not received',
          statusCode: 708,
        });
      } else {
        if (file.size > maxSize) {
          await new Promise((f) => setTimeout(f, 1000));
          fs.unlink(Env.TASK_FILES + uniqueFileName, (err) => {
            this.logger.error('upload file in task service  ,   ' + err);
          });
          return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
            errorMessage:
              'file size should be less than or equal to 200MB or (209715200 byte)',
            statusCode: 711,
          });
        }

        const task = await this.taskRepo.findOne({
          relations: ['project_id'],
          where: { task_id: task_id, status: Status.ACTIVE },
        });

        if (!task) {
          await new Promise((f) => setTimeout(f, 500));
          fs.unlink(Env.TASK_FILES + uniqueFileName, (err) => {
            this.logger.error('upload file in task service  ,   ' + err);
          });
          return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
            errorMessage: 'Task not found',
            statusCode: 52,
          });
        }
        const project = await this.projectRepo.findOne({
          relations: ['project_folder'],
          where: {
            project_id: task.project_id.project_id,
            status: Status.ACTIVE,
          },
        });

        if (!project) {
          return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
            errorMessage: 'Project not found',
            statusCode: 50,
          });
        }
        if (!project.project_folder) {
          return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
            errorMessage: 'Folder not found',
            statusCode: 801,
          });
        }

        let user = req['currentUser'];
        let roleAccess = await this.resourceAllocationRepo.findOne({
          relations: ['role'],
          where: {
            project_id_resource_alloc: project,
            allocated_user: user,
            allocation_status: ALLOCATION_STATUS.ALLOCATED,
          },
        });
        if (!roleAccess) {
          return res
            .status(SERVICE_EXCEPTION.UN_AUTHORIZED)
            .send({ errorMessage: 'Unauthorized access', statusCode: 399 });
        }
        return this.subFileUpload(
          roleAccess,
          req,
          res,
          task,
          project,
          uniqueFileName,
          file,
        );
      }
    } catch (error) {
      this.logger.error('upload file  in task service  ,   ' + error);
      return res
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }
  //sub function file upload
  async subFileUpload(
    roleAccess,
    req,
    res,
    task,
    project,
    uniqueFileName,
    file,
  ) {
    try {
      let name: any;
      let user = req['currentUser'];
      if (
        roleAccess.role.role_id == ProjectRole.PROJECT_MANAGER ||
        roleAccess.role.role_id == ProjectRole.PROJECT_ADMIN ||
        roleAccess.role.role_id == ProjectRole.GUEST ||
        roleAccess.role.role_id == ProjectRole.REPORTER ||
        user.role.role_id == 1
      ) {
        if (!req.body.file_name) {
          return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
            errorMessage: 'file_name cannot be empty',
            statusCode: 2570,
          });
        }
        name = decodeURIComponent(req.body.file_name);
        const taskFile = this.fileRepo.create({
          file_name: name,
          project_id_file: task.project_id,
          task_id_file: task,
          file_path: Env.GET_TASK_FILE_URL + uniqueFileName,
          folder_id_files: project.project_folder,
          file_type: file.mimetype,
          updated_by_file: req['currentUser'],
          created_by_file: req['currentUser'],
          status: Status.ACTIVE,
          created_date: new Date(),
          updated_date: new Date(),
        });

        const saved = await this.fileRepo.save(taskFile);
        if (saved) {
          this.fileTaskHistory(task, taskFile, project, req, res);
        }
        return res
          .status(SERVICE_EXCEPTION.SUCCESS_RESPONSE)
          .send(new TaskFileUploadView(task, saved));
      } else {
        return res
          .status(SERVICE_EXCEPTION.UN_AUTHORIZED)
          .send({ errorMessage: 'Unauthorized access', statusCode: 399 });
      }
    } catch (error) {
      this.logger.error(
        'sub function upload file  in task service  ,   ' + error,
      );
      return res
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }

  async fileTaskHistory(task, taskFile, project, req, res) {
    try {
      const taskFileHistory = this.historyRepo.create({
        task_id: task.task_id,
        task_name: task.task_name,
        file_name: taskFile.file_name,
        file_path: taskFile.file_path,
        file_history: taskFile,
        task_history: project,
        task_description: task.task_description,
        status: task.status,
        task_status: task.task_status,
        created_date: new Date(),
        updated_date: new Date(),
        created_by_history: req['currentUser'],
        updated_by_history: req['currentUser'],
        task_created_date: task.created_date,
        new_task_status: STATUS.ACTIVE,
        task_history_status: STATUS.ACTIVE,
        action: TASK_HISTORY_ACTION.FILE_UPLOAD,
        history_type: HISTORY_TYPE.TASK_HISTORY,
      });

      return await this.historyRepo.save(taskFileHistory);
    } catch (error) {
      this.logger.error('file task history in task service  ,   ' + error);
      return res
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }

  async getSelfTaskList(req: Request, res: Response) {
    try {
      let searchKey = '';
      let filterByColumn: string;
      let userFilter = req.query.userFilter || '0';
      let validateMyTaskParamsRes = await this.validateMyTaskParams(req);
      switch (validateMyTaskParamsRes) {
        case 1:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('invalid last data'));
        case 2:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('last data not found'));
        case 3:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('invalid limit'));
        case 4:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('limit must not be greater than 3000'));
        case 5:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(
              new CustomValidation(
                'both page and last data will not be accepted',
              ),
            );

        default:
      }
      let lastData = req.query.last_data || null;
      const page = Number(req.query.page) || 1;
      let limit = Number(req.query.limit) || null;
      const startIndex = (page - 1) * limit;

      if (req.query.searchKey) {
        searchKey =
          req.query.searchKey.toString().replace(/[_%]/g, '\\$&') || '';
      }
      let allowedUserFilter = ['0', '1'];
      if (
        req.query.userFilter &&
        !allowedUserFilter.includes(req.query.userFilter.toString().trim())
      ) {
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('Invalid input in userFilter'));
      }
      switch (userFilter) {
        case '0':
          filterByColumn = 'assignee';
          break;
        case '1':
          filterByColumn = 'created_by';
          break;
        default:
      }
      let assignedToMeCount = await this.taskRepo.count({
        where: { status: STATUS.ACTIVE, assignee: req['currentUser'] },
      });
      let createdByMeCount = await this.taskRepo.count({
        where: { status: STATUS.ACTIVE, created_by: req['currentUser'] },
      });
      this.logger.debug(
        'Get Task list dashboard: Took count of user filter' +
          ' Assigned to me count: ' +
          assignedToMeCount +
          ' Created by me count: ' +
          createdByMeCount +
          ' User: ' +
          req['currentUser'].user_name,
      );
      let tasklistPager = this.taskRepo
        .createQueryBuilder('mytask')
        .leftJoinAndSelect('mytask.assigner', 'assigner')
        .leftJoinAndSelect('mytask.project_id', 'project_id')
        .leftJoinAndSelect('mytask.created_by', 'created_by')
        .leftJoinAndSelect('mytask.task_category', 'task_category')
        .leftJoinAndSelect('mytask.task_issue', 'task_issue')
        .where('mytask.status = :status', {
          status: STATUS.ACTIVE,
        })
        .andWhere('mytask.' + filterByColumn + ' = :userFilter', {
          userFilter: req['currentUser'].user_id,
        })
        .andWhere('mytask.task_name LIKE:searchKey', {
          searchKey: `%${searchKey.toString().trim()}%`,
        });
      let task_list = this.taskRepo
        .createQueryBuilder('mytask')
        .leftJoinAndSelect('mytask.assigner', 'assigner')
        .leftJoinAndSelect('mytask.project_id', 'project_id')
        .leftJoinAndSelect('mytask.created_by', 'created_by')
        .leftJoinAndSelect('mytask.task_category', 'task_category')
        .leftJoinAndSelect('mytask.task_issue', 'task_issue')
        .where('mytask.status = :status', {
          status: STATUS.ACTIVE,
        })
        .andWhere('mytask.' + filterByColumn + ' = :userFilter', {
          userFilter: req['currentUser'].user_id,
        })
        .andWhere('mytask.task_name LIKE:searchKey', {
          searchKey: `%${searchKey.toString().trim()}%`,
        });
      if (req.query.dueDate) {
        this.logger.debug(
          'Get Task list dashboard: Due date filter applied, User: ' +
            req['currentUser'].user_name,
        );
        let allowedDateFilter = ['0', '1', '2', '3'];
        if (
          req.query.dueDate &&
          !allowedDateFilter.includes(req.query.dueDate.toString().trim())
        ) {
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('Invalid input in due date'));
        }

        await this.subGetSelfTaskList(req, task_list, tasklistPager);
      }
      let result = await this.sub2GetMyTask(
        task_list,
        limit,
        lastData,
        tasklistPager,
        startIndex,
      );

      this.logger.debug(
        'Get Task list dashboard:Took data from Db, User: ' +
          req['currentUser'].user_name,
      );
      let dataCount = result.length;

      let taskList = new LoopTaskDashboard(result).tasks;
      this.logger.debug(
        'Get Task list dashboard:passed into view and retrieved, User: ' +
          req['currentUser'].user_name,
      );
      return res
        .status(SERVICE_EXCEPTION.SUCCESS_RESPONSE)
        .send({ dataCount, assignedToMeCount, createdByMeCount, taskList });
    } catch (error) {
      this.logger.error('get self task list in task service  ,   ' + error);
      return res
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }
  //dynamic pagination of mytasklist

  async validateMyTaskParams(req) {
    if (req.query.last_data) {
      let lastDataId = Number(req.query.last_data);
      if (isNaN(lastDataId) || !isInt(lastDataId)) {
        return 1;
      }
      let lastValue = await this.taskRepo
        .createQueryBuilder('task')
        .where('task.task_id =:id', { id: req.query.last_data })
        .getOne();
      if (!lastValue) {
        return 2;
      }
    }
    if (req.query.limit) {
      let limitPerPage = Number(req.query.limit);
      if (isNaN(limitPerPage) || !isInt(limitPerPage) || limitPerPage < 1) {
        return 3;
      }
      if (limitPerPage > 3000) {
        return 4;
      }
    }
    if (req.query.page && req.query.last_data) {
      return 5;
    }
  }
  //getSelfTaskList sub function
  async subGetSelfTaskList(req, task_list, tasklistPager) {
    if (req.query.dueDate == '1') {
      this.logger.debug(
        'Get Task list dashboard: Requests due in 4 days, User: ' +
          req['currentUser'].user_name,
      );
      let currentDate = new Date();
      let from_date = new Date(currentDate.toISOString().slice(0, 10));
      let to_date = new Date(currentDate.toISOString().slice(0, 10));
      to_date.setDate(from_date.getDate() + 4);
      task_list
        .andWhere('mytask.end_date >= :startDate', {
          startDate: from_date.toISOString().slice(0, 10),
        })
        .andWhere('mytask.end_date <= :endDate', {
          endDate: to_date.toISOString().slice(0, 10),
        });
      tasklistPager
        .andWhere('mytask.end_date >= :startDate', {
          startDate: from_date.toISOString().slice(0, 10),
        })
        .andWhere('mytask.end_date <= :endDate', {
          endDate: to_date.toISOString().slice(0, 10),
        });
    } else if (req.query.dueDate == '2') {
      this.logger.debug(
        'Get Task list dashboard:Due today filter used, User: ' +
          req['currentUser'].user_name,
      );
      let currentDate = new Date();
      let from_date = currentDate.toISOString().slice(0, 10);
      task_list.andWhere('mytask.end_date = :startDate', {
        startDate: from_date,
      });
      tasklistPager.andWhere('mytask.end_date = :startDate', {
        startDate: from_date,
      });
    } else if (req.query.dueDate == '3') {
      this.logger.debug(
        'Get Task list dashboard:Over due filter used, User: ' +
          req['currentUser'].user_name,
      );
      let currentDate = new Date();
      let today = currentDate.toISOString().slice(0, 10);
      task_list.andWhere('mytask.end_date < :currentDate', {
        currentDate: today,
      });
      tasklistPager.andWhere('mytask.end_date < :currentDate', {
        currentDate: today,
      });
    }
  }
  //sub function 2
  async sub2GetMyTask(task_list, limit, lastData, tasklistPager, startIndex) {
    task_list.orderBy('mytask.created_date', 'DESC');
    let total = await task_list.getCount();
    if (!limit) {
      limit = total;
    }
    if (lastData) {
      let lastValue = await tasklistPager
        .andWhere('mytask.task_id >=:task_id', { task_id: lastData })
        .getCount();

      task_list.offset(lastValue).limit(limit);
    } else {
      task_list.offset(startIndex).limit(limit);
    }
    return task_list.getMany();
  }

  async getChildListService(
    project_id: number,
    getChildListDto: GetChildListDto,
    req: Request,
    res: Response,
  ) {
    try {
      let _projectExists = await this.projectRepo.findOne({
        where: {
          project_id: project_id,
          status: STATUS.ACTIVE,
        },
      });
      if (!_projectExists) {
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('project not found'));
      } else {
        let roleAccess = await this.resourceAllocationRepo.findOne({
          relations: ['role'],
          where: {
            project_id_resource_alloc: _projectExists,
            allocated_user: req['currentUser'],
            allocation_status: ALLOCATION_STATUS.ALLOCATED,
          },
        });
        if (!roleAccess) {
          return res
            .status(SERVICE_EXCEPTION.UN_AUTHORIZED)
            .send({ errorMessage: 'Unauthorized access', statusCode: 399 });
        }
        let _parentTaskExists = await this.taskRepo.findOne({
          where: {
            task_id: getChildListDto.task_id,
            task_relation: TASK_RELATION.PARENT,
            status: Status.ACTIVE,
          },
        });
        if (!_parentTaskExists) {
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('task not found'));
        } else {
          let _childTaskList = await this.taskRelationRepo.find({
            relations: ['task_id_child'],
            where: {
              project_id_task_relationship: _projectExists,
              task_id_parent: _parentTaskExists,
              status: STATUS.ACTIVE,
            },
          });
          return res
            .status(SERVICE_EXCEPTION.SUCCESS_RESPONSE)
            .send(_childTaskList);
        }
      }
    } catch (error) {
      this.logger.error('Child task list  ,   ' + error);
      return res
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }

  async sentNotify(_taskExists, email) {
    try {
      // await this.mailService.sendMail({
      //   to: email,
      //   from: 'taskmanagementdev@gmail.com',
      //   subject: 'Notification',
      //   text: 'xxxxxxxxxxxx',
      //   template: 'task_notify',
      //   context: {
      //     task_notify: {
      //       task_id: _taskExists.task_id,
      //       task_name: _taskExists.task_name,
      //       task_desc: _taskExists.task_description,
      //       end_date: _taskExists.end_date,
      //       // assigned_by: _taskExists.assigner.user_name,
      //     },
      //   },
      // });
    } catch (error) {}
  }

  async getAdvancedSearch(
    project_id: number,
    advancedSearchDto: AdvancedSearchDto,
    req: Request,
    res: Response,
  ) {
    try {
      let projectExist = await this.projectRepo.findOne({
        where: { project_id: project_id, status: Status.ACTIVE },
      });

      let roleAccess = await this.projectAllocationChecking(req, project_id);
      switch (roleAccess) {
        case 1:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('project not found'));

        case 2:
          return res
            .status(SERVICE_EXCEPTION.UN_AUTHORIZED)
            .send({ errorMessage: 'Unauthorized access', statusCode: 399 });

        default:
      }

      let value = await this.subAdvanceSearch(req, res);
      switch (value) {
        case 1:
          return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
            errorMessage: 'Search column missing',
            statusCode: 128,
          });

        case 2:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send({ errorMessage: 'Invalid field', statusCode: 68 });

        case 3:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send({ errorMessage: 'Missing search key', statusCode: 129 });

        case 4:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send({ errorMessage: 'Missing sort method', statusCode: 130 });

        case 5:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send({ errorMessage: 'Missing sort column', statusCode: 131 });

        case 6:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send({ errorMessage: 'Invalid sort field', statusCode: 140 });

        default:
      }

      let queryBuilder = this.taskRepo
        .createQueryBuilder('task')
        .leftJoinAndSelect('task.assigner', 'assigner')
        .leftJoinAndSelect('task.project_id', 'project_id')
        .leftJoinAndSelect('task.created_by', 'created_by')
        .leftJoinAndSelect('task.task_category', 'task_category')
        .leftJoinAndSelect('task.task_issue', 'task_issue')
        .leftJoinAndSelect('task.assignee', 'task_assignee')
        .where('task.status = :status', { status: Status.ACTIVE })
        .andWhere('task.project_id = :project_id', {
          project_id: project_id,
        });
      let NotFoundStatus = new Array();
      await this.subTaskStatusAdvanceSearch(
        advancedSearchDto,
        queryBuilder,
        NotFoundStatus,
        res,
      );
      if (NotFoundStatus.length > 0) {
        return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage: 'Invalid  status in task status ',
          statusCode: 3500,
        });
      }
      let NotFountPriority = new Array();
      await this.subPriorityAdvanceSearch(
        advancedSearchDto,
        queryBuilder,
        NotFountPriority,
        res,
      );

      if (NotFountPriority.length > 0) {
        return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage: 'Invalid  priority in priority',
          statusCode: 3501,
        });
      }
      let NotFoundRelation = new Array();
      await this.subRelationAdvanceSearch(
        advancedSearchDto,
        queryBuilder,
        NotFoundRelation,
        res,
      );
      if (NotFoundRelation.length > 0) {
        return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage: 'Invalid  relation status in relation',
          statusCode: 3503,
        });
      }
      let notFoundCategory = new Array();
      await this.subCategoryAdvanceSearch(
        advancedSearchDto,
        queryBuilder,
        notFoundCategory,
        res,
      );

      if (notFoundCategory.length > 0) {
        return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage: 'Invalid  category in category',
          statusCode: 3502,
        });
      }
      let nonFoundCreatedBy = new Array();
      await this.subCreatedByAdvanceSearch(
        advancedSearchDto,
        queryBuilder,
        nonFoundCreatedBy,
        projectExist,
        res,
      );

      if (nonFoundCreatedBy.length > 0) {
        return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage: 'Invalid  user in createdBy',
          statusCode: 3504,
        });
      }
      let notFoundAssigne = new Array();
      await this.subAssigneeAdvanceSearch(
        advancedSearchDto,
        queryBuilder,
        notFoundAssigne,
        projectExist,
        res,
      );
      if (notFoundAssigne.length > 0) {
        return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage: 'Invalid  user in assigne',
          statusCode: 3505,
        });
      }
      let NotFoundIssueType = new Array();
      await this.subIssueTypeAdvanceSearch(
        advancedSearchDto,
        queryBuilder,
        NotFoundIssueType,
        res,
      );

      if (NotFoundIssueType.length > 0) {
        return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage: 'Invalid  issue_type in issue_type',
          statusCode: 3506,
        });
      }
      await this.subDateSortingAdvanceSearch(
        advancedSearchDto,
        queryBuilder,
        res,
      );

      await this.subSearchKeywordAdvanceSearch(
        advancedSearchDto,
        queryBuilder,
        req,
        res,
      );

      const paginatedata = await pager(req, queryBuilder, 'task', 'task_id');
      return res.status(SERVICE_EXCEPTION.SUCCESS_RESPONSE).send(paginatedata);
    } catch (error) {
      this.logger.error('Advance search main function  ,   ' + error);
      return res
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }
  //sub function of advance search
  async subAdvanceSearch(req, res) {
    let allowedSearchCols = ['task_id', 'task_name', 'status'];
    let allowedSortCols = ['task_id', 'task_name'];
    if (req.query.searchKey && !req.query.searchCol) {
      return 1;
    }
    if (
      req.query.searchCol &&
      !allowedSearchCols.includes(req.query.searchCol.toString().trim())
    ) {
      return 2;
    }
    if (req.query.searchCol && !req.query.searchKey) {
      return 3;
    }
    if (req.query.sortCol && !req.query.sortMethod) {
      return 4;
    } else if (!req.query.sortCol && req.query.sortMethod) {
      return 5;
    }
    if (
      allowedSortCols &&
      req.query.sortCol &&
      !allowedSortCols.includes(req.query.sortCol.toString().trim())
    ) {
      return 6;
    }
  }

  //sub 1 function advance search
  async subTaskStatusAdvanceSearch(
    advancedSearchDto,
    queryBuilder,
    NotFoundStatus,
    res,
  ) {
    if (advancedSearchDto.task_status) {
      if (advancedSearchDto.task_status.length > 0) {
        let statusArr = [];
        await Promise.all(
          advancedSearchDto.task_status.map(async (element) => {
            let allowedStatus = [1, 2, 3, 4];
            if (allowedStatus.includes(element)) {
              statusArr.push(element);
            } else {
              NotFoundStatus.push(element);
            }
          }),
        );
        let statusA = new Set(statusArr);
        queryBuilder.andWhere('task.task_status IN (:...statuses)', {
          statuses: Array.from(statusA),
        });
      }
    }
  }
  //sub 2 function advance search
  async subPriorityAdvanceSearch(
    advancedSearchDto,
    queryBuilder,
    NotFountPriority,
    res,
  ) {
    if (advancedSearchDto.priority) {
      if (advancedSearchDto.priority.length > 0) {
        let priorityArr = [];
        await Promise.all(
          advancedSearchDto.priority.map(async (element) => {
            let allowedStatus = [1, 2, 3];
            if (allowedStatus.includes(element)) {
              priorityArr.push(element);
            } else {
              NotFountPriority.push(element);
            }
          }),
        );
        let priorityA = new Set(priorityArr);
        queryBuilder.andWhere('task.priority IN (:...priorities)', {
          priorities: Array.from(priorityA),
        });
      }
    }
  }
  //sub 3 function advance search
  async subRelationAdvanceSearch(
    advancedSearchDto,
    queryBuilder,
    NotFoundRelation,
    res,
  ) {
    if (advancedSearchDto.relation) {
      if (advancedSearchDto.relation.length > 0) {
        let relationArr = [];
        await Promise.all(
          advancedSearchDto.relation.map(async (element) => {
            let allowedRelation = [1, 2, 3];
            if (allowedRelation.includes(element)) {
              relationArr.push(element);
            } else {
              NotFoundRelation.push(element);
            }
          }),
        );
        let relationA = new Set(relationArr);
        queryBuilder.andWhere('task.task_relation IN (:...relations)', {
          relations: Array.from(relationA),
        });
      }
    }
  }
  //sub 4 function advance search

  async subCategoryAdvanceSearch(
    advancedSearchDto,
    queryBuilder,
    notFoundCategory,
    res,
  ) {
    if (advancedSearchDto.category) {
      if (advancedSearchDto.category.length > 0) {
        let categoryArr = [];
        await Promise.all(
          advancedSearchDto.category.map(async (element) => {
            let categoryExists = await this.categoryRepo.findOne({
              where: {
                category_id: element,
                status: STATUS.ACTIVE,
              },
            });
            if (!categoryExists) {
              if (element == null) {
                categoryArr.push(element);
              } else {
                notFoundCategory.push(element);
              }
            } else {
              categoryArr.push(element);
            }
          }),
        );

        let categoryA = new Set(categoryArr);
        await this.subCategoryAdvanceSearch1(categoryA, queryBuilder);
      }
    }
  }
  async subCategoryAdvanceSearch1(categoryA, queryBuilder) {
    if (Array.from(categoryA).length == 1) {
      if (Array.from(categoryA)[0] == null) {
        queryBuilder.andWhere('task.task_category IS NULL');
      } else {
        queryBuilder.andWhere('task.task_category IN (:...categories)', {
          categories: Array.from(categoryA),
        });
      }
    } else {
      if (Array.from(categoryA).includes(null)) {
        const results = Array.from(categoryA).filter((element) => {
          return element !== null;
        });

        queryBuilder.andWhere(
          '(task.task_category IN (:...categories) OR task.task_category IS NULL)',
          {
            categories: results,
          },
        );
      } else {
        queryBuilder.andWhere('task.task_category IN (:...categories)', {
          categories: Array.from(categoryA),
        });
      }
    }
  }
  //sub 5 function advance search
  async subCreatedByAdvanceSearch(
    advancedSearchDto,
    queryBuilder,
    nonFoundCreatedBy,
    projectExist,
    res,
  ) {
    if (advancedSearchDto.createdBy) {
      if (advancedSearchDto.createdBy.length > 0) {
        let createdByArr = [];

        await Promise.all(
          advancedSearchDto.createdBy.map(async (element) => {
            let userExists = await this.userRepo.findOne({
              where: {
                user_id: element,
                status: Status.ACTIVE,
              },
            });
            if (!userExists) {
              nonFoundCreatedBy.push(element);
            } else {
              let projectAlloc = await this.resourceAllocationRepo.findOne({
                where: {
                  project_id_resource_alloc: projectExist,
                  allocated_user: userExists,
                  status: STATUS.ACTIVE,
                  allocation_status: ALLOCATION_STATUS.ALLOCATED,
                },
              });
              if (!projectAlloc) {
                nonFoundCreatedBy.push(element);
              } else {
                createdByArr.push(element);
              }
            }
          }),
        );
        let createdByA = new Set(createdByArr);
        queryBuilder.andWhere('task.created_by IN (:...created)', {
          created: Array.from(createdByA),
        });
      }
    }
  }
  //sub 6 function advance search

  async subAssigneeAdvanceSearch(
    advancedSearchDto,
    queryBuilder,
    notFoundAssigne,
    projectExist,
    res,
  ) {
    if (advancedSearchDto.assigne) {
      if (advancedSearchDto.assigne.length > 0) {
        let assigneByArr = [];

        await Promise.all(
          advancedSearchDto.assigne.map(async (element) => {
            let userExists = await this.userRepo.findOne({
              where: {
                user_id: element,
                status: Status.ACTIVE,
              },
            });
            if (!userExists) {
              await this.assigneAdvanceNull(
                notFoundAssigne,
                assigneByArr,
                element,
              );
            } else {
              let projectAlloc = await this.resourceAllocationRepo.findOne({
                relations: ['allocated_user'],
                where: {
                  project_id_resource_alloc: projectExist,
                  allocated_user: userExists,
                  status: STATUS.ACTIVE,
                  allocation_status: ALLOCATION_STATUS.ALLOCATED,
                },
              });
              if (!projectAlloc) {
                notFoundAssigne.push(element);
              } else {
                assigneByArr.push(element);
              }
            }
          }),
        );
        let assigneByA = new Set(assigneByArr);

        await this.subAssigneeAdvanceSearch1(assigneByA, queryBuilder);
      }
    }
  }
  async assigneAdvanceNull(notFoundAssigne, assigneByArr, element) {
    if (element == null) {
      assigneByArr.push(element);
    } else {
      notFoundAssigne.push(element);
    }
  }
  async subAssigneeAdvanceSearch1(assigneByA, queryBuilder) {
    if (Array.from(assigneByA).length == 1) {
      if (Array.from(assigneByA)[0] == null) {
        queryBuilder.andWhere('task.assignee IS NULL');
      } else {
        queryBuilder.andWhere('task.assignee IN (:...assigne)', {
          assigne: Array.from(assigneByA),
        });
      }
    } else {
      if (Array.from(assigneByA).includes(null)) {
        const results = Array.from(assigneByA).filter((element) => {
          return element !== null;
        });

        queryBuilder.andWhere(
          '(task.assignee IN (:...assigne) OR task.assignee IS NULL)',
          {
            categories: results,
          },
        );
      } else {
        queryBuilder.andWhere('task.assignee IN (:...assigne)', {
          assigne: Array.from(assigneByA),
        });
      }
    }
  }
  //sub 7 function advance search

  async subIssueTypeAdvanceSearch(
    advancedSearchDto,
    queryBuilder,
    NotFoundIssueType,
    res,
  ) {
    if (advancedSearchDto.issue_type) {
      if (advancedSearchDto.issue_type.length > 0) {
        let issue_typeByArr = [];

        await Promise.all(
          advancedSearchDto.issue_type.map(async (element) => {
            let issueExist = await this.issueRepo.findOne({
              where: {
                issue_id: element,
                status: STATUS.ACTIVE,
              },
            });
            if (!issueExist) {
              NotFoundIssueType.push(element);
            } else {
              issue_typeByArr.push(element);
            }
          }),
        );
        let issue_typeByA = new Set(issue_typeByArr);
        queryBuilder.andWhere('task.task_issue IN (:...issue)', {
          issue: Array.from(issue_typeByA),
        });
      }
    }
  }
  //sub 8 function advance search
  async subDateSortingAdvanceSearch(advancedSearchDto, queryBuilder, res) {
    if (advancedSearchDto.start_date_from_date) {
      if (Number(advancedSearchDto.start_date_from_date) != 0) {
        let start1 = advancedSearchDto.start_date_from_date.toString();
        let _start_date = new Date(start1);
        _start_date.setDate(_start_date.getDate());
        queryBuilder.andWhere('task.start_date >= :from_date', {
          from_date: _start_date.toISOString().slice(0, 10),
        });
      }
    }

    if (advancedSearchDto.start_date_to_date) {
      if (Number(advancedSearchDto.start_date_to_date) != 0) {
        let _to_date = new Date(advancedSearchDto.start_date_to_date);
        _to_date.setDate(_to_date.getDate() + 1);

        queryBuilder.andWhere('task.start_date < :to_date', {
          to_date: _to_date.toISOString().slice(0, 10),
        });
      }
    }
    if (advancedSearchDto.due_date_from_date) {
      if (Number(advancedSearchDto.due_date_from_date) != 0) {
        let _start_date = new Date(advancedSearchDto.due_date_from_date);
        _start_date.setDate(_start_date.getDate());
        queryBuilder.andWhere('task.end_date >= :end_from_date', {
          end_from_date: _start_date.toISOString().slice(0, 10),
        });
      }
    }
    if (advancedSearchDto.due_date_to_date) {
      if (Number(advancedSearchDto.due_date_to_date) != 0) {
        let _to_date = new Date(advancedSearchDto.due_date_to_date);
        _to_date.setDate(_to_date.getDate() + 1);
        queryBuilder.andWhere('task.end_date < :end_to_date', {
          end_to_date: _to_date.toISOString().slice(0, 10),
        });
      }
    }
  }
  //sub 9 function advance search

  async subSearchKeywordAdvanceSearch(
    advancedSearchDto,
    queryBuilder,
    req,
    res,
  ) {
    if (advancedSearchDto.keyword) {
      if (Number(advancedSearchDto.keyword) != 0) {
        queryBuilder.andWhere('task.task_name like  :keyword', {
          keyword: `%${advancedSearchDto.keyword
            .toString()
            .trim()
            .replace(/[_+%]/g, '\\$&')}%`,
        });
      }
    }

    if (req.query.searchKey) {
      let searchCol = req.query.searchCol || 'status';
      let searchKey =
        req.query.searchKey.toString().trim().replace(/[_+%]/g, '\\$&') || 1;
      if (req.query.searchCol && req.query.searchKey) {
        queryBuilder.andWhere(' task.' + searchCol + ' LIKE:searchKey', {
          searchKey: `%${searchKey}%`,
        });
      }
    }
  }

  //get categoryList

  async getCategoryService(req: Request, res: Response) {
    try {
      let validateCategoryListParamsRes =
        await this.validateCategoryLisdtParams(req);
      switch (validateCategoryListParamsRes) {
        case 1:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('invalid last data'));
        case 2:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('last data not found'));
        case 3:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('invalid limit'));
        case 4:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('limit must not be greater than 3000'));
        case 5:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(
              new CustomValidation(
                'both page and last data will not be accepted',
              ),
            );

        case 6:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('invalid page'));

        default:
      }

      let lastData = req.query.last_data || null;
      const page = Number(req.query.page) || 1;
      let limit = Number(req.query.limit) || null;

      let categoryListCount = this.categoryRepo
        .createQueryBuilder('category')
        .where('category.status = :status', {
          status: STATUS.ACTIVE,
        })
        .orderBy('category.category_id', 'ASC');
      let newCount = this.categoryRepo
        .createQueryBuilder('category')
        .where('category.status = :status', {
          status: STATUS.ACTIVE,
        })
        .orderBy('category.category_id', 'ASC');

      let totalCount = await categoryListCount.getCount();
      let startIndex = (page - 1) * limit;

      if (!limit) {
        limit = totalCount;
      }

      if (req.query.page) {
        if (startIndex > totalCount) {
          startIndex = totalCount + 1;
        }
        categoryListCount.offset(startIndex).limit(limit);
      } else if (lastData) {
        let lastValue = await newCount
          .andWhere('category.category_id <=:category_id', {
            category_id: lastData,
          })
          .getCount();
        categoryListCount.offset(lastValue).limit(limit);
      } else {
        categoryListCount.offset(startIndex).limit(limit);
      }

      let result = await categoryListCount.getMany();

      let categoryArrayList = [];

      for (let i in result) {
        let categoryTaskCount = await this.taskRepo
          .createQueryBuilder('task')
          .where('task.task_category = :category', {
            category: result[i].category_id,
          })
          .andWhere('task.status = :status', { status: STATUS.ACTIVE })
          .getCount();

        categoryArrayList.push(categoryTaskCount);
      }
      let categoryTotalList = [];
      for (let i = 0; i < result.length; i++) {
        let category_id = result[i].category_id;
        let fieldName = result[i].category_name;
        let created_date = result[i].created_date;
        let updated_date = result[i].updated_date;
        let status = result[i].status;

        for (let j = i - 1; j < i; j++) {
          categoryTotalList[i] = {
            category_id: category_id,
            category: fieldName,
            TaskCount: categoryArrayList[i],
            created_date: created_date,
            updated_date: updated_date,
            status: status,
          };
        }
      }
      let dataCount = categoryTotalList.length;

      return res
        .status(SERVICE_EXCEPTION.SUCCESS_RESPONSE)
        .send({ dataCount, totalCount, categoryTotalList });
    } catch (error) {
      this.logger.error('get category list  ,   ' + error);
      return res
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }
  //dynamic pagination of issue_typelist

  async validateCategoryLisdtParams(req) {
    if (req.query.last_data) {
      let lastDataId = Number(req.query.last_data);
      if (isNaN(lastDataId) || !isInt(lastDataId)) {
        return 1;
      }
      let lastValue = await this.categoryRepo
        .createQueryBuilder('category')
        .where('category.category_id =:id', { id: req.query.last_data })
        .andWhere('category.status =:status', { status: STATUS.ACTIVE })
        .getOne();

      if (!lastValue) {
        return 2;
      }
    }
    if (req.query.limit) {
      let limitPerPage = Number(req.query.limit);
      if (isNaN(limitPerPage) || !isInt(limitPerPage) || limitPerPage < 1) {
        return 3;
      }
      if (limitPerPage > 3000) {
        return 4;
      }
    }
    if (req.query.page && req.query.last_data) {
      return 5;
    }
    return this.subValidateCategoryLisdtParams(req);
  }
  async subValidateCategoryLisdtParams(req) {
    if (req.query.page) {
      if (
        req.query.page < 1 ||
        isNaN(req.query.page) ||
        !isInt(Number(req.query.page))
      ) {
        return 6;
      }
    }
  }

  //get issueList
  async getIssue(req: Request, res: Response) {
    try {
      let validateIssueTypeListParamsRes =
        await this.validateIssueTypeLisdtParams(req);
      switch (validateIssueTypeListParamsRes) {
        case 1:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('invalid last data'));
        case 2:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('last data not found'));
        case 3:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('invalid limit'));
        case 4:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('limit must not be greater than 3000'));
        case 5:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(
              new CustomValidation(
                'both page and last data will not be accepted',
              ),
            );
        case 6:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('invalid page'));

        default:
      }
      let lastData = req.query.last_data || null;
      const page = Number(req.query.page) || 1;
      let limit = Number(req.query.limit) || null;

      let issueListCount = this.issueRepo
        .createQueryBuilder('issue_type')
        .where('issue_type.status = :status', {
          status: STATUS.ACTIVE,
        })
        .orderBy('issue_type.issue_id', 'ASC');
      let newCount = this.issueRepo
        .createQueryBuilder('issue_type')
        .where('issue_type.status = :status', {
          status: STATUS.ACTIVE,
        })
        .orderBy('issue_type.issue_id', 'ASC');

      let totalCount = await issueListCount.getCount();
      let startIndex = (page - 1) * limit;

      if (!limit) {
        limit = totalCount;
      }
      if (req.query.page) {
        if (startIndex > totalCount) {
          startIndex = totalCount + 1;
        }
        issueListCount.offset(startIndex).limit(limit);
      } else if (lastData) {
        let lastValue = await newCount
          .andWhere('issue_type.issue_id <=:issue_id', { issue_id: lastData })
          .getCount();
        issueListCount.offset(lastValue).limit(limit);
      } else {
        issueListCount.offset(startIndex).limit(limit);
      }

      let result = await issueListCount.getMany();
      let issueArrayList = [];

      for (let i in result) {
        let categoryTaskCount = await this.taskRepo
          .createQueryBuilder('task')
          .where('task.task_issue = :issue_type', {
            issue_type: result[i].issue_id,
          })
          .andWhere('task.status = :status', { status: STATUS.ACTIVE })
          .getCount();

        issueArrayList.push(categoryTaskCount);
      }

      let issueTotalList = [];
      for (let i = 0; i < result.length; i++) {
        let issue_type_id = result[i].issue_id;
        let fieldName = result[i].issue_name;
        let created_date = result[i].created_date;
        let updated_date = result[i].updated_date;
        let status = result[i].status;
        for (let j = i - 1; j < i; j++) {
          issueTotalList[i] = {
            issue_type_id: issue_type_id,
            issue_type: fieldName,
            TaskCount: issueArrayList[i],
            created_date: created_date,
            updated_date: updated_date,
            status: status,
          };
        }
      }

      let dataCount = issueTotalList.length;

      return res
        .status(SERVICE_EXCEPTION.SUCCESS_RESPONSE)
        .send({ dataCount, totalCount, issueTotalList });
    } catch (error) {
      this.logger.error('get issue list  ,   ' + error);
      return res
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }
  //dynamic pagination of issue_typelist

  async validateIssueTypeLisdtParams(req) {
    if (req.query.last_data) {
      let lastDataId = Number(req.query.last_data);
      if (isNaN(lastDataId) || !isInt(lastDataId)) {
        return 1;
      }
      let lastValue = await this.issueRepo
        .createQueryBuilder('issue_type')
        .where('issue_type.issue_id =:id', { id: req.query.last_data })
        .andWhere('issue_type.status =:status', { status: STATUS.ACTIVE })
        .getOne();

      if (!lastValue) {
        return 2;
      }
    }
    if (req.query.limit) {
      let limitPerPage = Number(req.query.limit);
      if (isNaN(limitPerPage) || !isInt(limitPerPage) || limitPerPage < 1) {
        return 3;
      }
      if (limitPerPage > 3000) {
        return 4;
      }
    }
    if (req.query.page && req.query.last_data) {
      return 5;
    }
    return this.subValidateCategoryLisdtParams(req);
  }

  // comment on task
  async commentTask(
    commentTask: CommentTask,
    project_id: number,
    req: Request,

    res: Response,
  ) {
    try {
      let user = req['currentUser'];

      let value = await this.projectAllocationChecking(req, project_id);
      let project = await this.projectRepo.findOne({ where: { project_id } });
      switch (value) {
        case 1:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('project not found'));

        case 2:
          return res
            .status(SERVICE_EXCEPTION.UN_AUTHORIZED)
            .send({ errorMessage: 'Unauthorized access', statusCode: 399 });

        default:
      }
      const task_id = commentTask.task_id;
      let task = await this.taskRepo
        .createQueryBuilder('task')
        .where('task.project_id =:project_id', {
          project_id: value[0].project_id,
        })
        .andWhere('task.status = :status', { status: STATUS.ACTIVE })
        .andWhere('task.task_id = :task_id', { task_id: task_id })
        .getOne();

      if (!task) {
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('task not found'));
      }
      const Comment = req.body.comment.trim();

      let history = this.historyRepo.create({
        comment: Comment,
        created_date: new Date(),
        updated_date: new Date(),
        task_history: value[0],
        task_id: task_id,
        task_name: task.task_name,
        task_description: task.task_description,
        priority: task.priority,
        assignee_history: user,
        task_history_status: Status.ACTIVE,
        action: TASK_HISTORY_ACTION.COMMENT,
        created_by_history: user,
        updated_by_history: user,
        task_created_date: task.created_date,
        history_type: HISTORY_TYPE.TASK_HISTORY,
      });

      const regex1 = RegExp('@[\\w.+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', 'g');
      let array1: any;
      let data = new Array();
      while ((array1 = regex1.exec(history.comment)) !== null) {
        data.push(array1[0]);
      }
      let data1 = new Set(data);

      return this.subCommentTask(
        task,
        commentTask,
        req,
        project,
        res,
        data1,
        history,
      );
    } catch (error) {
      this.logger.error('comment on task in task service  ,   ' + error);
      return res
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }

  //sub function of comment task
  async subCommentTask(task, commentTask, req, project, res, unique, history) {
    try {
      let user = req['currentUser'];
      let responseArray = [];
      await this.commentSub1(
        responseArray,
        user,
        task,
        unique,
        history,
        project,
      );

      let rejectUsers = new Array();
      let allocatedUsers = new Array();
      if (commentTask.notify) {
        if (commentTask.notify.length != 0) {
          let users = new Set(commentTask.notify);
          let UserExists = await this.commentsub2(
            rejectUsers,
            allocatedUsers,
            project,
            users,
          );
          if (!UserExists) {
            return res
              .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
              .send(new CustomValidation('user not found'));
          }
          await Promise.all(
            allocatedUsers.map(async (userObj) => {
              let notify = this.notifcationRepo.create({
                project_id_notification: project,
                task_id_notification: task,
                user_id_notification: userObj,
                status: STATUS.ACTIVE,
                view_status: NOTIFCATION_STATUS.NOTVIEWED,
                user_created_notification: req['currentUser'],
                created_date: new Date(),
                updated_date: new Date(),
                action: NOTIFICATION_ENUM.COMMENT_NOTIFY,
                content: req['currentUser'].user_name + ' notified you',
              });
              await this.notifcationRepo.save(notify);
              let email = userObj['email'];
              // await this.sentNotify(task, email);
            }),
          );
          if (rejectUsers.length > 0 && allocatedUsers.length == 0) {
            responseArray.push({
              task_id: task.task_id,
              notificationFailed:
                'notification failed for the following user_ids:' + rejectUsers,
              errorMessage:
                'comment added notification to ' +
                rejectUsers +
                ' user_notiy failed',
              statusCode: 1770,
            });
          }

          if (rejectUsers.length > 0 && allocatedUsers.length > 0) {
            responseArray.push({
              task_id: task.task_id,
              successMessage: 'comment added, few notified ',
              errorMessage: '(' + rejectUsers + ')' + ' user_ids notiy failed',
              statusCode: 1771,
            });
          }
        }
      }

      return res.status(SERVICE_EXCEPTION.SUCCESS_RESPONSE).send(responseArray);
    } catch (error) {
      this.logger.error(
        'comment on task sub function in task service  ,   ' + error,
      );
      return res
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }
  //comment sub fuction
  async commentSub1(responseArray, user, task, unique, history, project) {
    try {
      if (Array.from(unique).length == 0) {
        let _comment = await this.historyRepo.save(history);
        if (_comment) {
          responseArray.push({
            successMessage: 'Comment Added',
            statusCode: 200,
          });
        }
      }
      let _comment = await this.historyRepo.save(history);

      await Promise.all(
        Array.from(unique).map(async (value) => {
          let userExist = await this.userRepo.findOne({
            where: {
              email: value.toString().slice(1),
              status: Status.ACTIVE,
            },
          });

          if (!userExist) {
            responseArray.push({
              user_id: value,
              mentioned_user: 'not found',
              errorMessage: 'User not found',
              statusCode: 31,
            });
          }

          let projectAllocated = await this.resourceAllocationRepo.findOne({
            where: {
              allocated_user: userExist,
              project_id_resource_alloc: project,
              status: Status.ACTIVE,
              allocation_status: ALLOCATION_STATUS.ALLOCATED,
            },
          });

          if (!projectAllocated) {
            responseArray.push({
              user_id: userExist.user_id,
              user_name: userExist.user_name,
              mentioned_user: 'mentioned user is not part of this project',
              errorMessage: 'User not allocated to this project',
              statusCode: 1500,
            });
          } else {
            let x = [];
            let _notify;

            _notify = this.notifcationRepo.create({
              created_date: new Date(),
              status: Status.ACTIVE,
              view_status: Status.ACTIVE,
              updated_date: new Date(),
              content: user.user_name + ' mention you in a comment',
              user_created_notification: user,
              user_id_notification: userExist,
              project_id_notification: project,
              task_history_notification: _comment,
              task_id_notification: task,
              action: NOTIFICATION_ENUM.COMMENT_MENTION,
            });

            if (_notify) {
              x.push(_notify.user_id_notification.user_id);
            }
            this.logger.debug(x.length + 'comment on task');
            await this.notifcationRepo.save(_notify);

            if (_comment) {
              responseArray.push({
                user_id: userExist.user_id,
                mentioned_user: userExist.user_name,
                successMessage: 'Comment Added',
                statusCode: 200,
              });
            }
          }
        }),
      );
      return responseArray;
    } catch (error) {}
  }
  //sub  function 2 comment
  async commentsub2(rejectUsers, allocatedUsers, project, users) {
    try {
      let usersObj = Array.from(users);

      await Promise.all(
        usersObj.map(async (user) => {
          let UserExists = await this.userRepo
            .createQueryBuilder('user')
            .andWhere('user.user_id =:user_id', { user_id: user })
            .andWhere('user.status =:status', { status: Status.ACTIVE })
            .getOne();

          if (!UserExists) {
            rejectUsers.push(user);
            return UserExists;
          } else {
            let projectAllocated = await this.resourceAllocationRepo.findOne({
              where: {
                project_id_resource_alloc: project,
                allocated_user: UserExists,
                allocation_status: ALLOCATION_STATUS.ALLOCATED,
                status: STATUS.ACTIVE,
              },
            });

            if (!projectAllocated) {
              rejectUsers.push(UserExists.user_name);
            } else {
              allocatedUsers.push(UserExists);
            }
          }
        }),
      );
      return rejectUsers;
    } catch (error) {}
  }

  //recentupdates home page filter(old api get taskhistory/project_id)

  async FilterRecentupdates(project_id, req: Request, projects, res: Response) {
    try {
      let validateRecentUpdateHomeParamsRes =
        await this.validateRecentUpdateHomeParams(req);
      switch (validateRecentUpdateHomeParamsRes) {
        case 1:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('invalid last data'));
        case 2:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('last data not found'));
        case 3:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('invalid limit'));
        case 4:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('limit must not be greater than 3000'));
        case 5:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(
              new CustomValidation(
                'both page and last data will not be accepted',
              ),
            );

        default:
      }

      let lastData = req.query.last_data || null;
      const page = Number(req.query.page) || 1;
      let limit = Number(req.query.limit) || null;

      const startIndex = (page - 1) * limit;
      let resultArray = [];
      let user = req['currentUser'];
      if (projects.filterArray.length == 0) {
        projects.filterArray.push(0);
      }

      let count = 0;
      for (const element of projects.filterArray) {
        if (element == 1 || element == 2 || element == 0) {
          count++;
        }
      }
      if (
        count != projects.filterArray.length ||
        projects.filterArray.length > 2
      ) {
        return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage: 'filterArray accepts only 0,1 and 2',
          statusCode: 1610,
        });
      }
      let project = await this.projectRepo.findOne({
        where: { project_id, status: STATUS.ACTIVE },
      });
      if (!project) {
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('project not found'));
      }

      let projectAlloc = await this.resourceAllocationRepo.findOne({
        where: {
          allocated_user: user,
          project_id_resource_alloc: project,
          status: Status.ACTIVE,
          allocation_status: ALLOCATION_STATUS.ALLOCATED,
        },
      });
      if (!projectAlloc && user.role.role_id != 1) {
        return res
          .status(SERVICE_EXCEPTION.UN_AUTHORIZED)
          .send({ errorMessage: 'Unauthorized access', statusCode: 399 });
      }
      let taskHistory = this.historyRepo
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

        .where('taskHistoryObj.project_id =:project_id', {
          project_id: project_id,
        })
        .andWhere('taskHistoryObj.task_history_status = :task_history_status', {
          task_history_status: STATUS.ACTIVE,
        })
        .andWhere('taskHistoryObj.history_type IN (:...history_type)', {
          history_type: projects.filterArray,
        })
        .orderBy('taskHistoryObj.task_history_id', 'DESC');

      let offsetQuery = this.historyRepo
        .createQueryBuilder('taskHistoryObj1')
        .leftJoinAndSelect(
          'taskHistoryObj1.assignee_history',
          'assignee_history',
        )
        .leftJoinAndSelect(
          'taskHistoryObj1.new_assignee_history',
          'new_assignee_history',
        )
        .leftJoinAndSelect(
          'taskHistoryObj1.assigner_history',
          'assigner_history',
        )
        .leftJoinAndSelect(
          'taskHistoryObj1.new_assigner_history',
          'new_assigner_history',
        )
        .leftJoinAndSelect(
          'taskHistoryObj1.created_by_history',
          'created_by_history',
        )
        .leftJoinAndSelect('taskHistoryObj1.file_history', 'file_history')
        .leftJoinAndSelect(
          'taskHistoryObj1.task_category_history',
          'task_category_history',
        )
        .leftJoinAndSelect(
          'taskHistoryObj1.task_issue_history',
          'task_issue_history',
        )
        .leftJoinAndSelect(
          'taskHistoryObj1.new_task_category_history',
          'new_task_category_history',
        )
        .leftJoinAndSelect(
          'taskHistoryObj1.new_task_issue_history',
          'new_task_issue_history',
        )
        .leftJoinAndSelect('taskHistoryObj1.task_history', 'task_history')

        .leftJoinAndSelect('taskHistoryObj1.taskHistory', 'taskHistory')
        .leftJoinAndSelect('taskHistoryObj1.allocation_data', 'allocation_data')
        .leftJoinAndSelect('allocation_data.allocated_user', 'allocated_user')
        .leftJoinAndSelect('allocation_data.role', 'role')
        .where('taskHistoryObj1.project_id =:project_id', {
          project_id: project_id,
        })
        .andWhere(
          'taskHistoryObj1.task_history_status = :task_history_status',
          {
            task_history_status: STATUS.ACTIVE,
          },
        )
        .andWhere('taskHistoryObj1.history_type IN (:...history_type)', {
          history_type: projects.filterArray,
        })
        .orderBy('taskHistoryObj1.task_history_id', 'DESC');

      let total = await taskHistory.getCount();
      await this.subRecentUpdateHome(
        limit,
        total,
        lastData,
        offsetQuery,
        taskHistory,
        startIndex,
      );

      let result = await taskHistory.getMany();

      Promise.all(
        result.map(async (value) => {
          resultArray.push(new TaskHistoryView(value));
        }),
      );
      let dataCount = resultArray.length;

      return res
        .status(SERVICE_EXCEPTION.SUCCESS_RESPONSE)
        .send({ dataCount, total, resultArray });
    } catch (error) {
      this.logger.error('get task history in task service  ,   ' + error);
      return res
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }

  async validateRecentUpdateHomeParams(req) {
    if (req.query.last_data) {
      let lastDataId = Number(req.query.last_data);
      if (isNaN(lastDataId) || !isInt(lastDataId)) {
        return 1;
      }
      let lastValue = await this.historyRepo
        .createQueryBuilder('taskHistory')
        .where('taskHistory.task_history_id =:id', { id: req.query.last_data })
        .getOne();

      if (!lastValue) {
        return 2;
      }
    }
    if (req.query.limit) {
      let limitPerPage = Number(req.query.limit);
      if (isNaN(limitPerPage) || !isInt(limitPerPage) || limitPerPage < 1) {
        return 3;
      }
      if (limitPerPage > 3000) {
        return 4;
      }
    }
    if (req.query.page && req.query.last_data) {
      return 5;
    }
  }
  //sub function recentupdate home
  async subRecentUpdateHome(
    limit,
    total,
    lastData,
    offsetQuery,
    taskHistory,
    startIndex,
  ) {
    if (!limit) {
      limit = total;
    }

    if (lastData) {
      let lastValue = await offsetQuery
        .andWhere('taskHistoryObj1.task_history_id >=:id', { id: lastData })
        .getCount();
      taskHistory.offset(lastValue).limit(limit);
    } else {
      taskHistory.offset(startIndex).limit(limit);
    }
  }

  //board list and filter api
  async getBoardHomeList(
    project_id,
    req: Request,
    boardfilter: BoardFilter,
    res: Response,
  ) {
    try {
      let user = req['currentUser'];
      const project = await this.projectRepo.findOne({
        where: { project_id: project_id, status: STATUS.ACTIVE },
      });
      if (!project) {
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('project not found'));
      }
      let projectAlloc = await this.resourceAllocationRepo.findOne({
        where: {
          allocated_user: user,
          project_id_resource_alloc: project,
          status: Status.ACTIVE,
          allocation_status: ALLOCATION_STATUS.ALLOCATED,
        },
      });
      if (!projectAlloc && user.role.role_id != 1) {
        return res
          .status(SERVICE_EXCEPTION.UN_AUTHORIZED)
          .send({ errorMessage: 'Unauthorized access', statusCode: 399 });
      } else {
        let openTask = this.taskRepo
          .createQueryBuilder('task')
          .leftJoinAndSelect('task.assignee', 'assignee')
          .leftJoinAndSelect('task.task_category', 'task_category')
          .leftJoinAndSelect('task.task_issue', 'task_issue')
          .where('task.project_id = :project_id', { project_id: project_id })
          .andWhere('task.task_status = :task_status', {
            task_status: TASK_STATUS.OPEN,
          })
          .andWhere('task.status = :status', { status: STATUS.ACTIVE });

        let inprogressTask = this.taskRepo
          .createQueryBuilder('task1')
          .leftJoinAndSelect('task1.assignee', 'assignee')
          .leftJoinAndSelect('task1.task_category', 'task_category')
          .leftJoinAndSelect('task1.task_issue', 'task_issue')
          .where('task1.project_id = :project_id', { project_id: project_id })
          .andWhere('task1.task_status = :task_status', {
            task_status: TASK_STATUS.INPROGRESS,
          })
          .andWhere('task1.status = :status', { status: STATUS.ACTIVE });

        let resolvedTask = this.taskRepo
          .createQueryBuilder('task2')
          .leftJoinAndSelect('task2.assignee', 'assignee')
          .leftJoinAndSelect('task2.task_category', 'task_category')
          .leftJoinAndSelect('task2.task_issue', 'task_issue')
          .where('task2.project_id = :project_id', { project_id: project_id })
          .andWhere('task2.task_status = :task_status', {
            task_status: TASK_STATUS.RESOLVED,
          })
          .andWhere('task2.status = :status', { status: STATUS.ACTIVE });

        let closedTask = this.taskRepo
          .createQueryBuilder('task3')
          .leftJoinAndSelect('task3.assignee', 'assignee')
          .leftJoinAndSelect('task3.task_category', 'task_category')
          .leftJoinAndSelect('task3.task_issue', 'task_issue')
          .where('task3.project_id = :project_id', { project_id: project_id })
          .andWhere('task3.task_status = :task_status', {
            task_status: TASK_STATUS.CLOSED,
          })
          .andWhere('task3.status = :status', { status: STATUS.ACTIVE });

        return this.subBoardList(
          openTask,
          inprogressTask,
          resolvedTask,
          closedTask,
          boardfilter,
          res,
        );
      }
    } catch (error) {
      this.logger.error('board home list' + error);
      return res
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }

  // sub function  of boadList
  async subBoardList(
    openTask,
    inprogressTask,
    resolvedTask,
    closedTask,
    boardfilter,
    res,
  ) {
    try {
      if (boardfilter.issue_type) {
        const issueType = await this.issueRepo.findOne({
          where: { issue_id: boardfilter.issue_type, status: STATUS.ACTIVE },
        });

        if (!issueType) {
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('issue not found'));
        }
        openTask.andWhere('task.task_issue = :task_issue', {
          task_issue: issueType.issue_id,
        });
        inprogressTask.andWhere('task1.task_issue = :task_issue', {
          task_issue: issueType.issue_id,
        });
        resolvedTask.andWhere('task2.task_issue = :task_issue', {
          task_issue: issueType.issue_id,
        });
        closedTask.andWhere('task3.task_issue = :task_issue', {
          task_issue: issueType.issue_id,
        });
      }
      if (boardfilter.category) {
        const category = await this.categoryRepo.findOne({
          where: { category_id: boardfilter.category, status: STATUS.ACTIVE },
        });

        if (!category) {
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('category not found'));
        }

        openTask.andWhere('task.task_category = :task_category', {
          task_category: category.category_id,
        });
        inprogressTask.andWhere('task1.task_category = :task_category', {
          task_category: category.category_id,
        });
        resolvedTask.andWhere('task2.task_category = :task_category', {
          task_category: category.category_id,
        });
        closedTask.andWhere('task3.task_category = :task_category', {
          task_category: category.category_id,
        });
      }
      if (boardfilter.assignee) {
        const assigneeUser = await this.userRepo.findOne({
          where: { user_id: boardfilter.assignee, status: STATUS.ACTIVE },
        });

        if (!assigneeUser) {
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('user not found'));
        }
        openTask.andWhere('task.assignee = :user_id', {
          user_id: assigneeUser.user_id,
        });
        inprogressTask.andWhere('task1.assignee = :user_id', {
          user_id: assigneeUser.user_id,
        });
        resolvedTask.andWhere('task2.assignee = :user_id', {
          user_id: assigneeUser.user_id,
        });
        closedTask.andWhere('task3.assignee = :user_id', {
          user_id: assigneeUser.user_id,
        });
      }
      let taskCount = { open: 0, inprogress: 0, closed: 0, resolved: 0 };
      let result = [];
      let openTaskResult = await openTask.getMany();

      taskCount.open = await openTask.getCount();
      let openTasks = new BoardListLoop(openTaskResult);
      let inprogressTaskResult = await inprogressTask.getMany();
      taskCount.inprogress = await inprogressTask.getCount();
      let inprogressTasks = new BoardListLoop(inprogressTaskResult);
      let resolvedTaskResult = await resolvedTask.getMany();
      taskCount.resolved = await resolvedTask.getCount();
      let resolvedTasks = new BoardListLoop(resolvedTaskResult);
      let closedTaskResult = await closedTask.getMany();
      taskCount.closed = await closedTask.getCount();
      let closedTasks = new BoardListLoop(closedTaskResult);

      result.push(
        openTasks.openTasks,
        inprogressTasks.openTasks,
        resolvedTasks.openTasks,
        closedTasks.openTasks,
        { task: taskCount },
      );
      return res.status(SERVICE_EXCEPTION.SUCCESS_RESPONSE).send(result);
    } catch (error) {
      this.logger.error(
        ' sub function 2 of boadList (board home list)' + error,
      );
      return res
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }

  //Add Issue_type
  async addIssueType(issueType: AddIssueType, req: Request, res: Response) {
    try {
      let user = req['currentUser'];
      if (issueType.issue_type == null) {
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(
            new CustomValidation('"issue_type" is not allowed to be empty'),
          );
      }
      if (
        !issueType.issue_type.match(
          /^(?! )(?!\s)(?!.* {2})[\s\S]*(?<!\s)(?! )$/,
        )
      ) {
        return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage:
            'issue_type name only consists of Alphabetic characters',
          statusCode: 1402,
        });
      }

      const issue = await this.issueRepo.find({
        where: {
          status: Status.ACTIVE,
          issue_name: issueType.issue_type,
        },
      });

      if (issue?.length > 0) {
        return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage: 'Issue_Type name must be unique',
          statusCode: 1510,
        });
      } else {
        const issueTypeCreate = this.issueRepo.create({
          issue_name: issueType.issue_type,
          status: Status.ACTIVE,
          created_date: new Date(),
          updated_date: new Date(),
          created_by_issue: user,
        });

        const saved = await this.issueRepo.save(issueTypeCreate);
        if (saved) {
          return res.status(SERVICE_EXCEPTION.SUCCESS_RESPONSE).send({
            successMessage: 'Issue_Type Added Successfully',
            statusCode: 200,
          });
        }
      }
    } catch (error) {
      this.logger.error('add issye_type in task service' + error);
      return res
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }
  //Add category
  async addCategory(category: AddCategory, req: Request, res: Response) {
    try {
      let user = req['currentUser'];

      if (category.category_name == null) {
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(
            new CustomValidation('"category_name" is not allowed to be empty'),
          );
      }
      if (
        !category.category_name.match(
          /^(?! )(?!\s)(?!.* {2})[\s\S]*(?<!\s)(?! )$/,
        )
      ) {
        return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage:
            'category_name name only consists of Alphabetic characters',
          statusCode: 1412,
        });
      }

      const categorys = await this.categoryRepo.find({
        where: {
          status: Status.ACTIVE,
          category_name: category.category_name,
        },
      });

      if (categorys?.length > 0) {
        return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage: 'Category name must be unique',
          statusCode: 1439,
        });
      } else {
        const categoryCreate = this.categoryRepo.create({
          category_name: category.category_name,
          status: Status.ACTIVE,
          created_date: new Date(),
          updated_date: new Date(),
          created_by_category: user,
        });
        const saved = await this.categoryRepo.save(categoryCreate);
        if (saved) {
          return res.status(SERVICE_EXCEPTION.SUCCESS_RESPONSE).send({
            successMessage: 'Category Added Successfully',
            statusCode: 200,
          });
        }
      }
    } catch (error) {
      this.logger.error('add issye_type in task service' + error);
      return res
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }

  async getGanttChart(project_id: number, req: Request, res: Response) {
    try {
      let responseObj = [];
      let group = req.query.group || '0';
      let status = req.query.status || '0';
      let allowed_group = ['0', '1'];
      let allowed_status = ['0', '1', '2', '3', '4'];
      if (
        req.query.group &&
        !allowed_group.includes(req.query.group.toString().trim())
      ) {
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('Invalid grouping'));
      }
      if (
        req.query.status &&
        !allowed_status.includes(req.query.status.toString().trim())
      ) {
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('Invalid status'));
      }
      let project = await this.projectRepo.findOne({
        where: { project_id: project_id, status: STATUS.ACTIVE },
      });
      if (!project) {
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('project not found'));
      }
      let role_access = await this.resourceAllocationRepo.findOne({
        where: {
          allocation_status: ALLOCATION_STATUS.ALLOCATED,
          project_id_resource_alloc: project,
          allocated_user: req['currentUser'],
        },
      });
      if (!role_access) {
        return res
          .status(SERVICE_EXCEPTION.UN_AUTHORIZED)
          .send(new CustomValidation('unauthorized access'));
      }
      let date = new Date();
      let first_day = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getMonth() + 1,
      )
        .toISOString()
        .slice(0, 10);
      let last_day = new Date(
        new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59),
      )
        .toISOString()
        .slice(0, 10);
      let query = this.taskRepo
        .createQueryBuilder('task')
        .leftJoinAndSelect('task.assignee', 'assignee')
        .leftJoinAndSelect('task.project_id', 'project_id')
        .where('task.status =:status', { status: STATUS.ACTIVE })
        .andWhere('task.project_id = :project_id', { project_id: project_id })
        .andWhere(
          new Brackets((ib) => {
            this.logger.debug('gantt chart inner brackets executed');
            ib.where(
              'task.start_date >= :from_date AND task.start_date <= :end_date ',
              { from_date: first_day, end_date: last_day },
            ).orWhere(
              'task.end_date >= :from_date AND task.end_date <= :end_date',
              { from_date: first_day, end_date: last_day },
            );
          }),
        );
      if (req.query.status && req.query.status != '0') {
        query.andWhere('task.task_status = :task_status', {
          task_status: status,
        });
      }
      let result = new GanttChartLoop(
        await query.orderBy('task.end_date', 'ASC').getMany(),
      );
      if (group == '0') {
        responseObj.push(result.tasks);
      } else {
        let grouped_data = await this.getGanttChartGrouping(result.tasks);
        for (const dataObj of grouped_data) {
          responseObj.push(dataObj);
        }
      }
      return res.status(SERVICE_EXCEPTION.SUCCESS_RESPONSE).send(responseObj);
    } catch (error) {
      this.logger.error('Gantt chart' + error);
      return res
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }

  async getGanttChartGrouping(result) {
    let assignee_array = [];
    let result_array = [];
    for (const task of result) {
      if (task.assignee_id && !assignee_array.includes(task.assignee_id)) {
        assignee_array.push(task.assignee_id);
      }
    }
    for (const user of assignee_array) {
      let task_of_assignee = [];
      for (const task of result) {
        if (task.assignee_id == user) {
          task_of_assignee.push(task);
        }
      }
      result_array.push(task_of_assignee);
    }
    return result_array;
  }

  async getUserGanttChart(req: Request, res: Response) {
    try {
      let responseObj = [];
      let group = req.query.group || '0';
      let status = req.query.status || '0';
      let allowed_group = ['0', '1'];
      let allowed_status = ['0', '1', '2', '3', '4'];
      if (
        req.query.group &&
        !allowed_group.includes(req.query.group.toString().trim())
      ) {
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('Invalid grouping'));
      }
      if (
        req.query.status &&
        !allowed_status.includes(req.query.status.toString().trim())
      ) {
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('Invalid status'));
      }
      let date = new Date();
      let first_day = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getMonth() + 1,
      )
        .toISOString()
        .slice(0, 10);
      let last_day = new Date(
        new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59),
      )
        .toISOString()
        .slice(0, 10);
      let query = this.taskRepo
        .createQueryBuilder('task')
        .leftJoinAndSelect('task.assignee', 'assignee')
        .leftJoinAndSelect('task.project_id', 'project_id')
        .where('task.status =:status', { status: STATUS.ACTIVE })
        .andWhere('task.assignee = :assignee', {
          assignee: req['currentUser'].user_id,
        })
        .andWhere(
          new Brackets((ib) => {
            this.logger.debug('user gantt chart inner brackets executed');
            ib.where(
              'task.start_date >= :from_date AND task.start_date <= :end_date ',
              { from_date: first_day, end_date: last_day },
            ).orWhere(
              'task.end_date >= :from_date AND task.end_date <= :end_date',
              { from_date: first_day, end_date: last_day },
            );
          }),
        );
      if (req.query.status && req.query.status != '0') {
        query.andWhere('task.task_status = :task_status', {
          task_status: status,
        });
      }
      let result = new GanttChartLoop(
        await query.orderBy('task.end_date', 'ASC').getMany(),
      );
      if (group == '0') {
        responseObj.push(result.tasks);
      } else {
        let grouped_data = await this.getUserGanttChartGrouping(result.tasks);
        for (const dataObj of grouped_data) {
          responseObj.push(dataObj);
        }
      }
      return res.status(SERVICE_EXCEPTION.SUCCESS_RESPONSE).send(responseObj);
    } catch (error) {
      this.logger.error('Gantt chart' + error);
      return res
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }

  async getUserGanttChartGrouping(result) {
    let project_array = [];
    let result_array = [];
    for (const task of result) {
      if (!project_array.includes(task.project_id)) {
        project_array.push(task.project_id);
      }
    }

    for (const project of project_array) {
      let task_of_project = [];
      for (const task of result) {
        if (task.project_id == project) {
          task_of_project.push(task);
        }
      }
      result_array.push(task_of_project);
    }
    return result_array;
  }

  //get recentlyview

  async RecentlyViewedListService(req: Request, res: Response) {
    try {
      let user = req['currentUser'];
      let queryBuilder = this.recentlyViewedRepo
        .createQueryBuilder('recent')
        .leftJoinAndSelect(
          'recent.task_recently_viewed',
          'task_recently_viewed',
        )
        .leftJoinAndSelect(
          'recent.user_recently_viewed',
          'user_recently_viewed',
        )
        .leftJoinAndSelect(
          'recent.project_recently_viewed',
          'project_recently_viewed',
        )
        .where('recent.status =:status', { status: STATUS.ACTIVE })
        .andWhere('recent.user_recently_viewed =:user_recently_viewed', {
          user_recently_viewed: user.user_id,
        });

      let allowedSortCols = ['recently_viewed_id', 'view_date'];
      if (req.query.sortCol && !req.query.sortMethod) {
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send({ errorMessage: 'Missing sort method', statusCode: 130 });
      } else if (!req.query.sortCol && req.query.sortMethod) {
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send({ errorMessage: 'Missing sort column', statusCode: 131 });
      }
      if (
        allowedSortCols &&
        req.query.sortCol &&
        !allowedSortCols.includes(req.query.sortCol.toString().trim())
      ) {
        return res
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send({ errorMessage: 'Invalid sort field', statusCode: 140 });
      }

      if (req.query.searchKey) {
        let encoded = req.query.searchKey
          .toString()
          .trim()
          .replace(/[_+%]/g, '\\$&');

        if (req.query.searchKey.toString().length > 0) {
          let _task = await this.taskRepo
            .createQueryBuilder('task')
            .where('task.task_name LIKE:searchKey', {
              searchKey: `%${encoded}%`,
            })
            .getMany();

          let taskId = new Array();
          _task.forEach((task) => {
            taskId.push(task.task_id);
          });

          if (_task.length > 0) {
            queryBuilder.andWhere(
              'recent.task_recently_viewed IN (:...tasks)',
              {
                tasks: taskId,
              },
            );
          } else {
            queryBuilder.andWhere('recent.status =:status', {
              status: 3,
            });
          }
        }
      }

      let paginatedData = await pager(req, queryBuilder, 'recent', 'view_date');
      return res.status(SERVICE_EXCEPTION.SUCCESS_RESPONSE).send(paginatedData);
    } catch (error) {
      this.logger.error('recently viewed' + error);
      return res
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }
  //edit issue type
  async editIssueType(
    issueType: AddIssueType,
    issue_id,
    req: Request,
    res: Response,
  ) {
    let defaultIssue = [];
    try {
      let user = req['currentUser'];

      if (
        !issueType.issue_type.match(
          /^(?! )(?!\s)(?!.* {2})[\s\S]*(?<!\s)(?! )$/,
        )
      ) {
        return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage:
            'issue_type name only consists of Alphabetic characters',
          statusCode: 1402,
        });
      }

      const issue = await this.issueRepo.findOne({
        where: {
          status: STATUS.ACTIVE,
          issue_name: issueType.issue_type,
        },
      });

      const editIssue = await this.issueRepo.findOne({
        where: {
          status: STATUS.ACTIVE,
          issue_id: issue_id,
        },
      });

      if (!editIssue) {
        return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage: 'Issue_Type not found',
          statusCode: 634,
        });
      }
      defaultIssue = [1, 2, 3, 4];

      if (defaultIssue.includes(issue_id)) {
        throw new HttpException(
          { reason: 'Access Denied', statusCode: 405 },
          HttpStatus.BAD_REQUEST,
        );
      } else {
        if (issue) {
          if (editIssue.issue_id != issue.issue_id) {
            return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
              errorMessage: 'Issue_Type name must be unique',
              statusCode: 1510,
            });
          } else {
            return await this.editIssueElse(editIssue, issueType, user, res);
          }
        } else {
          return await this.editIssueElse(editIssue, issueType, user, res);
        }
      }
    } catch (error) {
      if (defaultIssue.includes(issue_id)) {
        return res.status(SERVICE_EXCEPTION.EXCEPTION_CATCH).send({
          errorMessage: 'defaultIssueType cannot be editted',
          statusCode: 2539,
        });
      } else {
        this.logger.error('edit issue type' + error);
        return res
          .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
          .send(new CustomValidation('exception caught in catch'));
      }
    }
  }
  //sub function for edit issue
  async editIssueElse(editIssue, issueType, user, res) {
    let saved;
    try {
      editIssue.issue_name = issueType.issue_type.trim();
      editIssue.updated_by_issue = user;
      saved = await this.issueRepo.save(editIssue);
      if (saved) {
        return res.status(SERVICE_EXCEPTION.SUCCESS_RESPONSE).send({
          successMessage: 'Issue_Type Editted Successfully',
          statusCode: 200,
        });
      }
    } catch (error) {
      this.logger.error('edit issue type sub function' + error);
      return res
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }
  //edit category
  async editcategory(
    category: AddCategory,
    category_id,
    req: Request,
    res: Response,
  ) {
    let defaultCategory = [];
    try {
      let user = req['currentUser'];

      if (
        !category.category_name.match(
          /^(?! )(?!\s)(?!.* {2})[\s\S]*(?<!\s)(?! )$/,
        )
      ) {
        return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage:
            'category_name name only consists of Alphabetic characters',
          statusCode: 1412,
        });
      }
      const categorys = await this.categoryRepo.findOne({
        where: {
          status: STATUS.ACTIVE,
          category_name: category.category_name,
        },
      });

      const editCategory = await this.categoryRepo.findOne({
        where: {
          status: STATUS.ACTIVE,
          category_id: category_id,
        },
      });
      if (!editCategory) {
        return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage: 'Category not found',
          statusCode: 633,
        });
      }
      defaultCategory = [1, 2, 3, 4];

      if (defaultCategory.includes(category_id)) {
        throw new HttpException(
          { reason: 'Method Not Allowed', statusCode: 405 },
          HttpStatus.BAD_REQUEST,
        );
      } else {
        if (categorys) {
          if (editCategory.category_id != categorys.category_id) {
            return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
              errorMessage: 'Category name must be unique',
              statusCode: 1439,
            });
          } else {
            return this.editCategoryElse(editCategory, category, user, res);
          }
        } else {
          return this.editCategoryElse(editCategory, category, user, res);
        }
      }
    } catch (error) {
      if (defaultCategory.includes(category_id)) {
        return res.status(SERVICE_EXCEPTION.EXCEPTION_CATCH).send({
          errorMessage: 'defaultCategory cannot be editted',
          statusCode: 2538,
        });
      } else {
        this.logger.error('edit category' + error);
        return res
          .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
          .send(new CustomValidation('exception caught in catch'));
      }
    }
  }
  //sub function for edit category
  async editCategoryElse(editCategory, category, user, res) {
    let saved;
    try {
      editCategory.category_name = category.category_name.trim();
      editCategory.updated_by_category = user;
      saved = await this.categoryRepo.save(editCategory);
      if (saved) {
        return res.status(SERVICE_EXCEPTION.SUCCESS_RESPONSE).send({
          successMessage: 'Category Editted Successfully',
          statusCode: 200,
        });
      }
    } catch (error) {
      this.logger.error('edit category sub function' + error);
      return res
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }

  //delete category
  async deletecategory(
    replaceCategory: ReplaceCategory,
    category_id,
    req: Request,
    res: Response,
  ) {
    let defaultCategory = [];
    let replacementCategory = [];
    try {
      const categoryDelete = await this.categoryRepo.findOne({
        where: { category_id: category_id, status: STATUS.ACTIVE },
      });

      if (!categoryDelete) {
        return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage: 'Category not found',
          statusCode: 633,
        });
      }
      defaultCategory = [1, 2, 3, 4];
      if (defaultCategory.includes(category_id)) {
        throw new HttpException(
          { reason: 'Access Denied', statusCode: 405 },
          HttpStatus.BAD_REQUEST,
        );
      }
      const categoryLIst = await this.categoryRepo.find({
        where: { status: STATUS.ACTIVE, category_id: Not(category_id) },
      });
      const taskCategory = await this.taskRepo.find({
        where: { task_category: categoryDelete, status: STATUS.ACTIVE },
      });

      if (taskCategory.length != 0) {
        if (!replaceCategory.replace_category) {
          return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
            errorMessage:
              'if active taskexist,replace_category should not be null',
            statusCode: 1589,
          });
        }
        replacementCategory = await this.categoryRepo.find({
          where: {
            category_id: replaceCategory.replace_category,
            status: Status.ACTIVE,
          },
        });

        if (replacementCategory.length == 0) {
          return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
            errorMessage: 'replacementCategory not found',
            statusCode: 2524,
          });
        }
        return this.deleteCategoryForloop(
          categoryDelete,
          categoryLIst,
          replacementCategory,
          replaceCategory,
          category_id,
          req,
          res,
        );
      } else {
        if (replaceCategory.replace_category) {
          return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
            errorMessage:
              'replacementCategory should be null if no active task exist',
            statusCode: 2553,
          });
        }
        categoryDelete.status = STATUS.INACTIVE;
        categoryDelete.updated_date = new Date();
        categoryDelete.updated_by_category = req['currentUser'];
        const saved = await this.categoryRepo.save(categoryDelete);
        if (saved) {
          return res.status(SERVICE_EXCEPTION.SUCCESS_RESPONSE).send({
            errorMessage: 'Category Deleted Succesfully',
            statusCode: 200,
          });
        }
      }
    } catch (error) {
      if (defaultCategory.includes(category_id)) {
        return res.status(SERVICE_EXCEPTION.EXCEPTION_CATCH).send({
          errorMessage: 'defaultCategory cannot be delete',
          statusCode: 2537,
        });
      }
      this.logger.error('delete category' + error);
      return res
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }
  //sub function deletecategoryforloop
  async deleteCategoryForloop(
    categoryDelete,
    categoryLIst,
    replacementCategory,
    replaceCategory,
    category_id,
    req,
    res,
  ) {
    let categorySaved;

    try {
      let saved;
      if (replaceCategory.replace_category == category_id) {
        return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage:
            'replace_category must be a category_id other than deleting category',
          statusCode: 2523,
        });
      }

      for (let category of categoryLIst) {
        for (let replacement of replacementCategory) {
          if (category.category_id === replacement.category_id) {
            const replaceList = await this.taskRepo.find({
              relations: ['task_category'],
              where: { task_category: categoryDelete, status: STATUS.ACTIVE },
            });
            for (let replace of replaceList) {
              replace.task_category.category_id =
                replaceCategory.replace_category;
              categoryDelete.status = STATUS.INACTIVE;
              categoryDelete.updated_date = new Date();
              categoryDelete.updated_by_category = req['currentUser'];
              saved = await this.taskRepo.save(replace);
              categorySaved = await this.categoryRepo.save(categoryDelete);
            }
            break;
          }
        }
        if (categorySaved) {
          return res.status(SERVICE_EXCEPTION.SUCCESS_RESPONSE).send({
            errorMessage: 'Category Deleted Succesfully',
            statusCode: 200,
          });
        }
      }
    } catch (error) {
      this.logger.error('sub function delete category' + error);
      return res
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }
  //delete issue Type
  async deleteissueType(
    replaceIssueType: ReplaceIssueType,
    issue_id,
    req: Request,
    res: Response,
  ) {
    let defaultCategory = [];
    let replacementIssue;
    try {
      const issueTypeDelete = await this.issueRepo.findOne({
        where: { issue_id: issue_id, status: STATUS.ACTIVE },
      });

      if (!issueTypeDelete) {
        return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage: 'Issue type not found',
          statusCode: 634,
        });
      }
      defaultCategory = [1, 2, 3, 4];
      if (defaultCategory.includes(issue_id)) {
        throw new HttpException(
          { reason: 'Access Denied', statusCode: 405 },
          HttpStatus.BAD_REQUEST,
        );
      }
      const issueTypeLIst = await this.issueRepo.find({
        where: { status: STATUS.ACTIVE, issue_id: Not(issue_id) },
      });

      const taskIssueType = await this.taskRepo.find({
        where: { task_issue: issueTypeDelete, status: STATUS.ACTIVE },
      });

      if (taskIssueType.length != 0) {
        if (!replaceIssueType.replace_issueType) {
          return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
            errorMessage:
              'if active taskexist,replace_issueType should not be null',
            statusCode: 1590,
          });
        }
        replacementIssue = await this.issueRepo.find({
          where: {
            issue_id: replaceIssueType.replace_issueType,
            status: Status.ACTIVE,
          },
        });

        if (replacementIssue.length == 0) {
          return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
            errorMessage: 'replacement Issue_type not found',
            statusCode: 1438,
          });
        }
        return this.deleteIssueTypeForloop(
          issueTypeDelete,
          issueTypeLIst,
          replacementIssue,
          replaceIssueType,
          issue_id,
          req,
          res,
        );
      } else {
        if (replaceIssueType.replace_issueType) {
          return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
            errorMessage:
              'replaceIssueType should be null if no active task exist',
            statusCode: 2554,
          });
        }
        issueTypeDelete.status = STATUS.INACTIVE;
        issueTypeDelete.updated_by_issue = req['currentUser'];
        issueTypeDelete.updated_date = new Date();
        const saved = await this.issueRepo.save(issueTypeDelete);
        if (saved) {
          return res.status(SERVICE_EXCEPTION.SUCCESS_RESPONSE).send({
            errorMessage: 'IssueType Deleted Succesfully',
            statusCode: 200,
          });
        }
      }
    } catch (error) {
      if (defaultCategory.includes(issue_id)) {
        return res.status(SERVICE_EXCEPTION.EXCEPTION_CATCH).send({
          errorMessage: 'defaultissueType cannot be deleted',
          statusCode: 2537,
        });
      }
      this.logger.error('delete issue Type' + error);
      return res
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }
  //sub function deleteIssuetypeforloop
  async deleteIssueTypeForloop(
    issueTypeDelete,
    issueTypeLIst,
    replacementIssue,
    replaceIssueType,
    issue_id,
    req,
    res,
  ) {
    let issueTypeSaved;
    try {
      let saved;
      if (replaceIssueType.replace_issueType == issue_id) {
        return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
          errorMessage:
            'replace_issueType must be a issue_id other than deleting issueType',
          statusCode: 1514,
        });
      }
      for (let issue of issueTypeLIst) {
        for (let replacement of replacementIssue) {
          if (issue.issue_id === replacement.issue_id) {
            const replaceList = await this.taskRepo.find({
              relations: ['task_issue'],
              where: { task_issue: issueTypeDelete, status: STATUS.ACTIVE },
            });

            for (let replace of replaceList) {
              replace.task_issue.issue_id = replaceIssueType.replace_issueType;
              issueTypeDelete.status = STATUS.INACTIVE;
              issueTypeDelete.updated_by_issue = req['currentUser'];
              issueTypeDelete.updated_date = new Date();
              saved = await this.taskRepo.save(replace);
              issueTypeSaved = await this.issueRepo.save(issueTypeDelete);
            }
            break;
          }
        }
      }

      if (issueTypeSaved) {
        return res.status(SERVICE_EXCEPTION.SUCCESS_RESPONSE).send({
          errorMessage: 'IssueType Deleted Succesfully',
          statusCode: 200,
        });
      }
    } catch (error) {
      this.logger.error('sub function delete issue Type' + error);
      return res
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }
  async validateDate(date) {
    this.logger.debug('validate' + date);

    let dateObject = new Date(date);
    let dateString = dateObject.toISOString().slice(0, 10).toString();
    if (date.toString() != dateString) {
      this.logger.debug('1');
      return false;
    } else {
      this.logger.debug('2');
      return true;
    }
  }

  async validateNotifyIsNumber(taskData, numberUser, stringUser, noifyUsers) {
    if (taskData.notify) {
      if (taskData.notify.length > 0) {
        taskData.notify.forEach((element) => {
          if (typeof element == 'number') {
            numberUser.push(element);
          } else {
            stringUser.push(element);
          }
        });
        noifyUsers.push(taskData.notify);
      }
    }
    if (stringUser.length > 0) {
      return 1;
    }
  }
  async validateNotifyAndCommentInUpdateTask(
    taskData,
    task,
    task_id,
    commentSuccess,
    req,
    array,
  ) {
    if (taskData.comment) {
      if (taskData.comment.toString().length > 0) {
        let commenttaskData = await this.validateTaskdataComment(
          req,
          taskData,
          task_id,
          task,
          commentSuccess,
          array,
        );
        if (commenttaskData == 1) {
          return 1;
        }
      }
      if (taskData.notify) {
        let taskDataNotify1 = await this.taskDataNotifyMethod(
          array,
          taskData,
          task,
          req,
        );
        if (taskDataNotify1 == 2) {
          return 2;
        }
      }
    }
  }
  async validateDateAndNotify(
    taskData,
    noChangeArrray,
    commentSuccess,
    noifyUsers,
    task,
    req,
  ) {
    this.logger.debug('pipe2');
    if (commentSuccess.length > 0 && noChangeArrray.length > 0) {
      return 1;
    }
    if (
      noChangeArrray.length > 0 &&
      noifyUsers.length > 0 &&
      commentSuccess.length == 0
    ) {
      return 2;
    }
    if (noChangeArrray.length > 0) {
      return 3;
    }

    let projectEndDate = new Date(task.project_id.end_date);
    let projectStartDate = new Date(task.project_id.start_date);

    if (req.body.start_date == 0) {
      return 4;
    }
    if (req.body.end_date == 0) {
      return 5;
    }
    if (taskData.start_date) {
      this.logger.debug('staart');
      let case1 = await this.taskDataStartDate(
        taskData,
        projectStartDate,
        projectEndDate,
      );
      if (case1) {
        return case1;
      }
      this.logger.debug(case1);
    }
    this.logger.debug('fttftft');
    if (taskData.end_date) {
      let case2 = await this.taskDataEndDateValidate(
        taskData,
        projectEndDate,
        projectStartDate,
      );
      if (case2) {
        return case2;
      }
    }
    if (taskData.task_description.trim().length < 10) {
      return 9;
    }
    if (
      !taskData.task_name.match(/^(?! )(?!\s)(?!.* {2})[\s\S]*(?<!\s)(?! )$/)
    ) {
      return 10;
    }
  }
  async validateNotfyOnly(
    taskData,
    task,
    req,
    rejectUsersNotify,
    allocatedUsersNotify,
  ) {
    if (taskData.notify) {
      let rejectUsers = rejectUsersNotify;
      let allocatedUsers = allocatedUsersNotify;
      if (taskData.notify.length != 0) {
        await this.validateNotify12(
          taskData,
          rejectUsers,
          task,
          allocatedUsers,
        );
        if (rejectUsers.length > 0 && allocatedUsers.length == 0) {
          return 1;
        }
        if (rejectUsers.length > 0) {
          return 2;
        }
        if (allocatedUsers.length > 0) {
          await Promise.all(
            allocatedUsers.map(async (user) => {
              let notify = this.notifcationRepo.create({
                project_id_notification: task.project_id,
                task_id_notification: task,
                user_id_notification: user,
                status: STATUS.ACTIVE,
                view_status: NOTIFCATION_STATUS.NOTVIEWED,
                created_date: new Date(),
                updated_date: new Date(),
                user_created_notification: req['currentUser'],
                content: 'Update Task',
                action: NOTIFICATION_ENUM.NOTIFY,
              });
              await this.notifcationRepo.save(notify);
              let email = user['email'];
              // await this.sentNotify(task, email);
            }),
          );
        }
      }
    }
  }
  async validateNotify(allocatedUsers, task, req) {
    if (allocatedUsers.length > 0) {
      await Promise.all(
        allocatedUsers.map(async (user) => {
          let notify = this.notifcationRepo.create({
            project_id_notification: task.project_id,
            task_id_notification: task,
            user_id_notification: user,
            status: STATUS.ACTIVE,
            view_status: NOTIFCATION_STATUS.NOTVIEWED,
            created_date: new Date(),
            user_created_notification: req['currentUser'],
            updated_date: new Date(),
            content: 'Update Task',
            action: NOTIFICATION_ENUM.COMMENT_NOTIFY,
          });
          await this.notifcationRepo.save(notify);
          let email = user['email'];
          // await this.sentNotify(task, email);
        }),
      );
    }
  }
  async validateTaskdataComment(
    req,
    taskData,
    task_id,
    task,
    commentSuccess,
    array,
  ) {
    let user = req['currentUser'];
    let Comment = taskData.comment.trim();
    let history = this.historyRepo.create({
      comment: Comment,
      created_date: new Date(),
      updated_date: new Date(),
      task_history: task.project_id,
      task_id: task_id,
      task_name: task.task_name,
      task_description: task.task_description,
      priority: task.priority,
      assignee_history: user,
      task_history_status: Status.ACTIVE,
      action: TASK_HISTORY_ACTION.COMMENT,
      created_by_history: user,
      updated_by_history: user,
      task_created_date: task.created_date,
      history_type: HISTORY_TYPE.TASK_HISTORY,
    });

    let data = new Array();
    let unique = [];
    let data1 = new Set(data);

    await this.loopValidateTaskdataComment(data, unique, history, data1);

    if (unique.length == 0) {
      let _comment = await this.historyRepo.save(history);
      if (_comment) {
        commentSuccess.push(_comment.task_id);
      }
    } else {
      let userNotFound = array[0];
      let userArray = array[3];

      await Promise.all(
        unique.map(async (value) => {
          let userExist = await this.userRepo.findOne({
            where: {
              email: value,
              status: Status.ACTIVE,
            },
          });
          if (!userExist) {
            userNotFound.push(value);
          } else {
            let projectAllocated = await this.resourceAllocationRepo.findOne({
              where: {
                allocated_user: userExist,
                project_id_resource_alloc: task.project_id,
                status: Status.ACTIVE,
                allocation_status: ALLOCATION_STATUS.ALLOCATED,
              },
            });
            if (!projectAllocated) {
              userNotFound.push(value);
            } else {
              userArray.push(userExist);
            }
          }
        }),
      );
      if (userNotFound.length > 0) {
        return 1;
      }

      await this.validate123(userNotFound, userArray, history, user, task);
    }
  }

  async loopValidateTaskdataComment(data, unique, history, data1) {
    let array1: any;
    const regex1 = RegExp('@[\\w.+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', 'g');

    while ((array1 = regex1.exec(history.comment)) !== null) {
      data.push(array1[0].slice(1));
    }
    Array.from(data).forEach((element) => {
      if (!unique.includes(element)) {
        unique.push(element);
      }
    });
  }
  async taskDataNotifyMethod(array, taskData, task, req) {
    let rejectUsers = array[1];
    let allocatedUsers = array[2];
    if (taskData.notify.length != 0) {
      let users = new Set(taskData.notify);
      await Promise.all(
        Array.from(users).map(async (userObject) => {
          let UserExists = await this.userRepo.findOne({
            where: {
              user_id: Number(userObject),
              status: Status.ACTIVE,
            },
          });
          if (!UserExists) {
            rejectUsers.push(userObject);
          } else {
            let projectAllocated = await this.resourceAllocationRepo.findOne({
              where: {
                project_id_resource_alloc: task.project_id,
                allocated_user: UserExists,
                allocation_status: ALLOCATION_STATUS.ALLOCATED,
                status: STATUS.ACTIVE,
              },
            });

            if (!projectAllocated) {
              rejectUsers.push(UserExists.user_name);
            } else {
              allocatedUsers.push(UserExists);
            }
          }
        }),
      );
      if (rejectUsers.length > 0 && allocatedUsers.length == 0) {
        return 2;
      }
      if (rejectUsers.length > 0) {
        return 2;
      }
      await this.validateNotify(allocatedUsers, task, req);
    }
  }
  async validateNotify12(taskData, rejectUsers, task, allocatedUsers) {
    let users = new Set(taskData.notify);
    await Promise.all(
      Array.from(users).map(async (user) => {
        let UserExists = await this.userRepo.findOne({
          where: {
            user_id: Number(user),
            status: Status.ACTIVE,
          },
        });
        if (!UserExists) {
          rejectUsers.push(user);
        } else {
          let projectAllocated = await this.resourceAllocationRepo.findOne({
            where: {
              project_id_resource_alloc: task.project_id,
              allocated_user: UserExists,
              allocation_status: ALLOCATION_STATUS.ALLOCATED,
              status: STATUS.ACTIVE,
            },
          });

          if (!projectAllocated) {
            rejectUsers.push(UserExists.user_name);
          } else {
            allocatedUsers.push(UserExists);
          }
        }
      }),
    );
  }
  async validate123(userNotFound, userArray, history, user, task) {
    if (userNotFound.length == 0 && userArray.length > 0) {
      await this.historyRepo.save(history);
      await Promise.all(
        userArray.map(async (value) => {
          let _notify = this.notifcationRepo.create({
            created_date: new Date(),
            status: Status.ACTIVE,
            view_status: Status.ACTIVE,
            updated_date: new Date(),
            content: user.user_name + ' mention you in a comment',
            user_created_notification: user,
            user_id_notification: value,
            project_id_notification: task.project_id,
            task_id_notification: task,
            action: NOTIFICATION_ENUM.COMMENT_MENTION,
          });
          await this.notifcationRepo.save(_notify);
        }),
      );
    }
  }
  async taskDataEndDateValidate(taskData, projectEndDate, projectStartDate) {
    this.logger.debug(taskData.end_date);
    this.logger.debug(projectEndDate);
    this.logger.debug(projectStartDate);
    if (!isString(taskData.end_date)) {
      return 5;
    }
    let validatedEndDate = await this.validateDate(taskData.end_date);
    if (!validatedEndDate) {
      return 5;
    }
    let end_date = new Date(taskData.end_date);
    if (end_date > projectEndDate) {
      return 7;
    } else if (end_date < projectStartDate) {
      return 12;
    }
    if (taskData.start_date) {
      let start_date = new Date(taskData.start_date);
      if (end_date < start_date) {
        return 8;
      }
    }
  }
  async taskDataStartDate(taskData, projectStartDate, projectEndDate) {
    if (!isString(taskData.start_date)) {
      return 4;
    }
    let validatedStartDate = await this.validateDate(taskData.start_date);
    if (!validatedStartDate) {
      return 4;
    }
    let start_date = new Date(taskData.start_date);
    if (projectStartDate > start_date) {
      return 6;
    } else if (start_date > projectEndDate) {
      return 11;
    }
  }
  //projectpallocation checking
  async projectAllocationChecking(req, project_id) {
    try {
      let projectArray = [];
      let user = req['currentUser'];
      let project = await this.projectRepo.findOne({
        where: { project_id: project_id, status: Status.ACTIVE },
      });
      projectArray.push(project);
      if (!project) {
        return 1;
      }
      let projectAlloc = await this.resourceAllocationRepo.findOne({
        where: {
          allocated_user: user,
          project_id_resource_alloc: project,
          status: Status.ACTIVE,
          allocation_status: ALLOCATION_STATUS.ALLOCATED,
        },
      });

      projectArray.push(projectAlloc);
      if (!projectAlloc) {
        return 2;
      }
      return projectArray;
    } catch (error) {}
  }

  async validateTaskNameandTaskDesc(taskData, arrayOfList, res) {
    if (
      !taskData.task_name.match(/^(?! )(?!\s)(?!.* {2})[\s\S]*(?<!\s)(?! )$/)
    ) {
      return 1;
    }
    if (taskData.task_description.trim().length < 10) {
      return 2;
    }
    if (taskData.notify) {
      let noifyUsers = arrayOfList[0];
      let stringUser = arrayOfList[1];
      let numberUser = arrayOfList[2];
      let value = await this.validateNotifyIsNumber(
        taskData,
        numberUser,
        stringUser,
        noifyUsers,
      );
      if (value == 1) {
        return 3;
      }
    }
  }
  async getRecentUpdateDashboard(
    projects: RecentUpdatesDashboard,
    req: Request,
    res: Response,
  ) {
    try {
      let projectArray = projects.projects;

      let errorValidate = [];
      await this.validateProjectList(projectArray, req, errorValidate);
      if (errorValidate.length > 0) {
        switch (errorValidate[0]['error']) {
          case 1:
            return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
              errorMessage:
                'Invalid project id at index ' + errorValidate[0]['index'],
              statusCode: 3022,
            });
          case 2:
            return res
              .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
              .send(new CustomValidation('Duplication in project'));
          case 3:
            return res.status(SERVICE_EXCEPTION.ERROR_RESPONSE).send({
              errorMessage:
                'Project not found at index ' + errorValidate[0]['index'],
              statusCode: 3021,
            });

          default:
        }
      }

      let hasNext: any;

      let validateUserActivityParamsRes = await this.validateUserActivityParams(
        req,
      );

      switch (validateUserActivityParamsRes) {
        case 1:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('invalid last data'));
        case 2:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('last data not found'));
        case 3:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('invalid limit'));
        case 4:
          return res
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('limit must not be greater than 3000'));
        default:
      }
      let lastData = req.query.last_data || null;
      const page = Number(req.query.page) || 1;
      let limit = Number(req.query.limit) || null;
      const startIndex = (page - 1) * limit;
      let recentUpdates = [];

      let taskHistory = this.historyRepo
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
        //
        .leftJoinAndSelect('taskHistoryObj.taskHistory', 'taskHistory')
        .leftJoinAndSelect('taskHistoryObj.allocation_data', 'allocation_data')
        .leftJoinAndSelect('allocation_data.allocated_user', 'allocated_user')
        .leftJoinAndSelect('allocation_data.role', 'role')
        .where('taskHistoryObj.project_id IN (:...project_id)', {
          project_id: projectArray,
        })
        .andWhere('taskHistoryObj.task_history_status = :task_history_status', {
          task_history_status: STATUS.ACTIVE,
        })
        .orderBy('taskHistoryObj.task_history_id', 'DESC');
      let taskHistorySubOffQuery = this.historyRepo
        .createQueryBuilder('taskHistoryObj1')
        .leftJoinAndSelect(
          'taskHistoryObj1.assignee_history',
          'assignee_history',
        )
        .leftJoinAndSelect(
          'taskHistoryObj1.new_assignee_history',
          'new_assignee_history',
        )
        .leftJoinAndSelect(
          'taskHistoryObj1.assigner_history',
          'assigner_history',
        )
        .leftJoinAndSelect(
          'taskHistoryObj1.new_assigner_history',
          'new_assigner_history',
        )
        .leftJoinAndSelect(
          'taskHistoryObj1.created_by_history',
          'created_by_history',
        )
        .leftJoinAndSelect('taskHistoryObj1.file_history', 'file_history')
        .leftJoinAndSelect(
          'taskHistoryObj1.task_category_history',
          'task_category_history',
        )
        .leftJoinAndSelect(
          'taskHistoryObj1.task_issue_history',
          'task_issue_history',
        )
        .leftJoinAndSelect(
          'taskHistoryObj1.new_task_category_history',
          'new_task_category_history',
        )
        .leftJoinAndSelect(
          'taskHistoryObj1.new_task_issue_history',
          'new_task_issue_history',
        )
        .leftJoinAndSelect('taskHistoryObj1.task_history', 'task_history')
        //
        .leftJoinAndSelect('taskHistoryObj1.taskHistory', 'taskHistory')
        .leftJoinAndSelect('taskHistoryObj1.allocation_data', 'allocation_data')
        .leftJoinAndSelect('allocation_data.allocated_user', 'allocated_user')
        .leftJoinAndSelect('allocation_data.role', 'role')
        .where('taskHistoryObj1.project_id IN (:...project_id)', {
          project_id: projectArray,
        })
        .andWhere(
          'taskHistoryObj1.task_history_status = :task_history_status',
          {
            task_history_status: STATUS.ACTIVE,
          },
        )
        .orderBy('taskHistoryObj1.task_history_id', 'DESC');

      let total = await taskHistory.getCount();

      if (!limit) {
        limit = total;
      }
      if (lastData) {
        let lastValue = await taskHistorySubOffQuery
          .andWhere('taskHistoryObj1.task_history_id >=:id', { id: lastData })
          .getCount();

        this.logger.debug('Notication: has last data');

        taskHistory.offset(lastValue).limit(limit);

        hasNext = total > limit + lastValue;
      } else {
        taskHistory.offset(startIndex).limit(limit);
        hasNext = total > limit;
      }

      this.logger.debug(
        'Get recent updates dashboard: took task history, Task history length: ' +
          taskHistory +
          ' User: ' +
          req['currentUser'].user_name,
      );
      let task_history = await taskHistory.getMany();

      Promise.all(
        task_history.map(async (value) => {
          recentUpdates.push(new TaskHistoryView(value));
        }),
      );
      const dataCount = recentUpdates.length;

      return res
        .status(SERVICE_EXCEPTION.SUCCESS_RESPONSE)
        .send({ dataCount, total, hasNext, recentUpdates });
    } catch (error) {
      this.logger.error('get task history in task service  ,   ' + error);
      return res
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }
  async validateUserActivityParams(req) {
    if (req.query.limit) {
      let limitPerPage = Number(req.query.limit);
      if (isNaN(limitPerPage) || !isInt(limitPerPage) || limitPerPage <= 0) {
        return 3;
      } else if (limitPerPage > 3000) {
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
    let lastValue = await this.historyRepo
      .createQueryBuilder('historyOffset')
      .where('historyOffset.task_history_id =:id', {
        id: req.query.last_data,
      })
      .getOne();

    if (!lastValue) {
      return 2;
    }
  }
  async validateProjectList(projectArray, req, errorValidate) {
    for (let i in projectArray) {
      let count = 0;
      for (let j in projectArray) {
        if (projectArray[i] == projectArray[j]) {
          count = count + 1;
        }
      }

      if (!Number.isInteger(projectArray[i]) || projectArray[i] < 1) {
        return errorValidate.push({ error: 1, index: i });
      }
      if (count > 1) {
        return errorValidate.push({ error: 2 });
      }
      this.logger.debug(
        'Get recent updates dashboard: Validations passed, User: ' +
          req['currentUser'].user_name,
      );
      let checkProjectAllocation = await this.resourceAllocationRepo
        .createQueryBuilder('project')
        .where('project.project_id = :project_id', {
          project_id: projectArray[i],
        })
        .andWhere('project.status = :status', {
          status: STATUS.ACTIVE,
        })
        .andWhere('project.allocation_status = :allocation_status', {
          allocation_status: ALLOCATION_STATUS.ALLOCATED,
        })
        .andWhere('project.user_id = :user_id', {
          user_id: req['currentUser'].user_id,
        })
        .getOne();

      if (!checkProjectAllocation) {
        return errorValidate.push({ error: 3, index: i });
      }
    }
  }
}
