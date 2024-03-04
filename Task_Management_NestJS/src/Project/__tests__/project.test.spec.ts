import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Category } from '../../Entity/Category';
import { Files } from '../../Entity/Files';
import { Issue } from '../../Entity/Issue';
import { Notifications } from '../../Entity/Notifications';
import { Profile } from '../../Entity/Profile';
import { Project } from '../../Entity/Project';
import { ProjectHistory } from '../../Entity/Project_history';
import { ProjectResourceAllocation } from '../../Entity/Project_resource_allocation';
import { RecentlyViewed } from '../../Entity/Recently_viewed';
import { Task } from '../../Entity/Task';
import { TaskRelationship } from '../../Entity/TaskRelationship';
import { TaskHistory } from '../../Entity/Task_History';
import { User } from '../../Entity/User';
import {
  ALLOCATION_STATUS,
  HISTORY_TYPE,
  ROLE_AUTHORITY,
  STATUS,
  TASK_HISTORY_ACTION,
} from '../../Enum/Enums.enum';
import { ProjectController } from '.././project.controller';
import { ProjectService } from '.././project.service';
import * as jwt from 'jsonwebtoken';
import { Folders } from '../../Entity/Folders';
import { Roles } from '../../Entity/Roles';
import { PinProject } from '../../Entity/Pin_project';
import { Request, Response } from 'express';
import { Status } from '../../Entity/Status';
import { Repository } from 'typeorm';
import { Role } from '../../Enum/Role.enum';
import {
  AllocateUserDto,
  EditAllocateUserDto,
  PinProjectDto,
  UpdateProjectDto,
} from '.././Project.dto';
import {
  _allocatedUserDetail,
  categoryList,
  deleteProject,
  deleteProjectResource,
  deleteProjectResource2,
  deleteProjectResource3,
  dummyDeveloper,
  dummyUnauthorized,
  getProjectRoleAllocationDetail,
  getUnAllocatedUsersFromRepo,
  lastRole,
  memberListRole3,
  pinProjectFindData,
  pinnedProjectDescOrder,
  projectInProjectRole,
  projectList,
  projectMemberListAllocateProject,
  projectUserExistEditAllocation,
  project_3,
  project_4,
  resourceAllocationPinProject,
  resourceInProjectStatus,
  resourceListDeleteTask,
  taskListProjectStatus,
  unallocatedUserList,
  userEditingAllocation,
  userEditingAllocation2,
  deleteProject2,
  deleteProjectResource1,
  project_5,
  project_6,
} from './data';
import { notificationListGetMany } from '../../notification/__tests__/data';
import {
  _userList,
  resourceAllocationAdminDataDeleteTask,
} from '../../Task/__tests__/data';
import { ProjectAddDetails, ProjectUpdateDetails } from '../Project.type';
// import { notificationListGetMany } from '../notification/__tests__/data';
let userList = [
  {
    user_id: 142,
    user_name: 'YaduAdmin',
    email: 'YkrishAd@gmail.com',
    password: '$2b$10$wWhvmky5gCYuLm21gdIYH.l3gabB/7YNoZCyPJE7twzzHhmSOZ39y',
    password_token: null,
    notification_url: null,
    status: 1,
    updated_date: '2023-04-03T06:50:57.000Z',
    created_date: '2023-04-03T06:50:57.000Z',
    active_projects: 82,
    new_user: 0,
    login_status: null,
    last_login: null,
    first_name: null,
    last_name: null,
    middle_name: null,
    phone_number: null,
    profile_photo: null,
    change_password_status: null,
    role: {
      role_id: 1,
      role_name: 'Admin',
      status: 1,
      created_date: '2023-01-02T18:30:00.000Z',
      updated_date: '2023-01-02T18:30:00.000Z',
      authority: 1,
    },
  },
];
export const _task = {
  task_id: 17,
  task_name: 'dummy task',
  task_description: 'tabvnvsmsjh,gsh j,bnh',
  status: 1,
  task_status: 1,
  created_date: new Date('2023-03-31T05:10:43.000Z'),
  updated_date: new Date('2023-03-31T05:10:43.000Z'),
  priority: 1,
  actual_hours: '72.00',
  estimated_hours: '72.00',
  start_date: '2023-02-28',
  end_date: '2023-03-02',
  task_relation: 3,
  attachment_status: null,
  project_id: {
    project_id: 2,
    project_name: 'Project 1',
    project_code: 'Proj_101',
    project_description: 'dummy project is live 1',
    status: 1,
    project_status: null,
    end_date: '2023-08-15',
    start_date: '2023-02-15',
    created_date: new Date('2023-02-15T04:58:04.000Z'),
    updated_date: new Date('2023-02-15T04:58:04.000Z'),
    total_resource: 5,
    total_task: 4,
  },
};
let currentUserObj = {
  user_id: 1,
  user_name: 'Hemandh',
  email: 'hemandh.hemandh@gmail.com',
  password: '$2b$10$5iC4f./ytO3zDfVqsYeHGuHJVWwtZp/Qo7zZksXfFXiyklAd5Ajxu',
  password_token: null,
  notification_url: null,
  status: 1,
  updated_date: new Date('2023-01-02T18:30:00.000Z'),
  created_date: new Date('2023-01-02T18:30:00.000Z'),
  active_projects: 18,
  new_user: 1,
  login_status: null,
  last_login: '1680167820',
  first_name: 'ddsfgd@@',
  last_name: 'vtgtgggg@@@',
  middle_name: 'ghhyhyhyh@@',
  phone_number: '33333332200',
  profile_photo:
    'https://dev-tm-images.innovaturelabs.com/GtGVdgUMIW_1680148392311.png',
  change_password_status: 1,
  role: {
    role_id: 1,
    role_name: 'Admin',
    status: 1,
    created_date: new Date('2023-01-02T18:30:00.000Z'),
    updated_date: new Date('2023-01-02T18:30:00.000Z'),
    authority: 1,
  },
};
const requestMock: Request<any, any, any, any, any> = {
  currentUser: currentUserObj,
} as unknown as Request;

const responseMock: Response = {
  status: jest.fn((x) => statusResponseMock),
  send: jest.fn((x) => x),
} as unknown as Response;
const statusResponseMock = {
  send: jest.fn((x) => x),
};

const project_2 = {
  project_id: 2,
  project_name: 'Project 1',
  project_code: 'Proj_101',
  project_description: 'dummy project is live 1',
  status: 1,
  project_status: null,
  end_date: '2023-08-15',
  start_date: '2023-02-15',
  created_date: new Date('2023-02-15T04:58:04.000Z'),
  updated_date: new Date('2023-02-15T04:58:04.000Z'),
  total_resource: 5,
  total_task: 4,
};
let project1 = {
  project_name: 'string',
  project_code: 'Proj_101',
  start_date: '2024-04-04',
  end_date: '2024-04-09',
  project_description: 'string',
  status: Status.ACTIVE,
  created_date: new Date(),
  updated_date: new Date(),
  project_created_by: requestMock['currentUser'],
  project_updated_by: requestMock['currentUser'],
};

// match
const resourceAllocationData = {
  create: jest.fn((options: any) => {
    return true;
  }),
  save: jest.fn((options: any) => {
    return true;
  }),
  findOne: jest.fn().mockImplementation((options: any) => {
    if (
      options.where.project_id_resource_alloc === project_2 &&
      options.where.allocated_user == currentUserObj &&
      options.where.allocation_status === ALLOCATION_STATUS.ALLOCATED
    ) {
      return resourceAllocationAdminDataDeleteTask;
    } else if (
      options.where.project_id_resource_alloc === project_3 &&
      options.where.allocated_user == currentUserObj &&
      options.where.allocation_status === ALLOCATION_STATUS.ALLOCATED
    ) {
      return resourceAllocationPinProject;
    } else {
      return true;
    }
  }),
  find: jest.fn((options: any) => {
    return true;
  }),
  createQueryBuilder: jest.fn().mockImplementation((options: any) => {
    return true;
  }),
};
let projectData = {
  findOne: jest.fn().mockImplementation((options: any) => {
    if (
      options.where.project_id === 2 &&
      options.where.status === STATUS.ACTIVE
    ) {
      return project_2;
    } else if (
      options.where.project_id === 22 &&
      options.where.status === STATUS.ACTIVE
    ) {
      return project_3;
    } else if (
      options.where.project_id === 23 &&
      options.where.status === STATUS.ACTIVE
    ) {
      return project_4;
    } else if (
      options.where.project_id === 34 &&
      options.where.status === STATUS.ACTIVE
    ) {
      return deleteProject;
    } else if (options.where.project_code === 'Proj_101') {
      return project_2;
    } else {
      return null;
    }
  }),
  create: jest.fn().mockImplementation((options: any) => {
    return project1;
  }),
  save: jest.fn().mockImplementation((options: any) => {
    return project1;
  }),
  find: jest.fn().mockImplementation((options: any) => {
    return true;
  }),
  update: jest.fn().mockImplementation((options: any) => {
    return true;
  }),
};

let categoryData = {
  find: jest.fn((options: any) => {
    return true;
  }),
  findOne: jest.fn((options: any) => {
    return true;
  }),
  create: jest.fn((options: any) => {
    return true;
  }),
  update: jest.fn((options: any) => {
    return true;
  }),
  createQueryBuilder: jest.fn().mockImplementation((options: any) => {
    return true;
  }),
};

describe('project', () => {
  let controller: ProjectController;
  let service: ProjectService;
  let userRepository: Repository<User>;
  let taskRepository: Repository<Task>;
  let historyRepo: Repository<TaskHistory>;
  let resourceRepo: Repository<ProjectResourceAllocation>;
  let roleRepo: Repository<Roles>;
  let projectRepo: Repository<Project>;
  let notificationRepo: Repository<Notifications>;
  let categoryRepo: Repository<Category>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [
        ProjectService,
        JwtService,
        {
          provide: JwtService,
          useValue: {
            sign: (payload: any) => jwt.sign(payload, 'secret'),
          },
        },
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn().mockImplementation((options: any) => {
              return true;
            }),
          },
        },
        {
          provide: getRepositoryToken(Task),
          useValue: {
            createQueryBuilder: jest.fn().mockImplementation((options: any) => {
              return true;
            }),
            save: jest.fn().mockImplementation((options: any) => {
              return true;
            }),
            update: jest.fn((options: any) => {
              return true;
            }),
          },
        },
        {
          provide: getRepositoryToken(Project),
          useValue: projectData,
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            createQueryBuilder: jest
              .fn()
              .mockImplementation((options: any) => ({
                where: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                getMany: jest.fn().mockResolvedValue(userList),
              })),
            findOne: jest.fn().mockImplementation((options: any) => {
              if (options.where.user_id == 142) {
                return userList[0];
              } else {
                return null;
              }
            }),
            save: jest.fn().mockImplementation((options: any) => {
              return true;
            }),
            find: jest.fn().mockImplementation((options: any) => {
              return true;
            }),
          },
        },
        {
          provide: getRepositoryToken(PinProject),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Roles),
          useValue: {
            findOne: jest.fn((options: any) => {
              if (
                options.where.role_id === Role.ADMIN &&
                options.where.authority === ROLE_AUTHORITY.TOP_LEVEL
              ) {
                return {
                  role_id: Role.ADMIN,
                  role_name: 'Admin',
                  created_date: new Date(),
                  updated_date: new Date(),
                };
              } else if (
                options.where.role_id === Role.USER &&
                options.where.authority === ROLE_AUTHORITY.TOP_LEVEL
              ) {
                return {
                  role_id: Role.USER,
                  role_name: 'User',
                  created_date: new Date(),
                  updated_date: new Date(),
                };
              } else if (options.where.role_id === 3) {
                return {
                  role_id: 3,
                  role_name: 'Project_Admin',
                  created_date: new Date(),
                  updated_date: new Date(),
                };
              } else {
                return null;
              }
            }),
            createQueryBuilder: jest.fn().mockImplementation((options: any) => {
              return true;
            }),
          },
        },
        {
          provide: getRepositoryToken(Files),
          useValue: {
            update: jest.fn((options: any) => {
              return true;
            }),
          },
        },
        {
          provide: getRepositoryToken(TaskHistory),
          useValue: {
            create: jest.fn().mockImplementation((options: any) => {
              return true;
            }),
            save: jest.fn().mockImplementation((options: any) => {
              return true;
            }),
          },
        },
        {
          provide: getRepositoryToken(Notifications),
          useValue: {
            create: jest.fn().mockImplementation((options: any) => {
              return true;
            }),
            save: jest.fn().mockImplementation((options: any) => {
              return true;
            }),
            createQueryBuilder: jest.fn().mockImplementation((options: any) => {
              return true;
            }),
          },
        },
        {
          provide: getRepositoryToken(ProjectResourceAllocation),
          useValue: resourceAllocationData,
        },
        {
          provide: getRepositoryToken(Category),
          useValue: categoryData,
        },
        {
          provide: getRepositoryToken(Issue),
          useValue: {},
        },
        {
          provide: getRepositoryToken(ProjectHistory),
          useValue: {},
        },
        {
          provide: getRepositoryToken(TaskRelationship),
          useValue: {
            update: jest.fn((options: any) => {
              return true;
            }),
          },
        },
        {
          provide: getRepositoryToken(RecentlyViewed),
          useValue: {
            update: jest.fn((options: any) => {
              return true;
            }),
          },
        },
        {
          provide: getRepositoryToken(Profile),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Folders),
          useValue: {
            create: jest.fn((options: any) => {
              return true;
            }),
            save: jest.fn((options: any) => {
              return true;
            }),
            update: jest.fn((options: any) => {
              return true;
            }),
          },
        },
        {
          provide: getRepositoryToken(Files),
          useValue: {
            update: jest.fn((options: any) => {
              return true;
            }),
          },
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: {
            debug: jest.fn().mockImplementation((options: any) => {
              return true;
            }),
            info: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProjectController>(ProjectController);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    service = module.get<ProjectService>(ProjectService);
    taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
    roleRepo = module.get<Repository<Roles>>(getRepositoryToken(Roles));
    projectRepo = module.get<Repository<Project>>(getRepositoryToken(Project));
    historyRepo = module.get<Repository<TaskHistory>>(
      getRepositoryToken(TaskHistory),
    );
    resourceRepo = module.get<Repository<ProjectResourceAllocation>>(
      getRepositoryToken(ProjectResourceAllocation),
    );
    notificationRepo = module.get<Repository<Notifications>>(
      getRepositoryToken(Notifications),
    );
    categoryRepo = module.get<Repository<Category>>(
      getRepositoryToken(Category),
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should be defined', () => {
    expect(controller.addProject).toBeDefined();
  });
  it('should be defined', () => {
    expect(service.addProjectService).toBeDefined();
  });
  it('should be defined', () => {
    expect(service.updateProjectService).toBeDefined();
  });
  it('should be defined', () => {
    expect(controller.updateProject).toBeDefined();
  });
  it('should be defined', () => {
    expect(controller.batchUpdate).toBeDefined();
  });
  it('should be defined', () => {
    expect(service.batchUpdateService).toBeDefined();
  });
  describe('when add project project code already exists', () => {
    it('should get 400 success status', async () => {
      let addProjetDto = {
        project_name: 'string',
        project_code: 'Proj_101',
        start_date: '2024-04-04',
        end_date: '2024-04-09',
        project_description: 'string string',
      };
      const result = await service.addProjectService(
        addProjetDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'project code already exists',
        statusCode: 100,
      });
    });
  });
  describe('when add project in service', () => {
    it('should get 200 success status', async () => {
      let addProjetDto = {
        project_name: 'string',
        project_code: 'Proj_1011',
        start_date: '2024-04-04',
        end_date: '2024-04-09',
        project_description: 'string string',
      };

      const result = await service.addProjectService(
        addProjetDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        successMessage: 'Project created',
        statusCode: 200,
      });
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('when add project in controller', () => {
    it('should get 200 success status', async () => {
      let addProjetDto = {
        project_name: 'string',
        project_code: 'Proj_1011',
        start_date: '2024-04-04',
        end_date: '2024-04-09',
        project_description: 'string string',
      };
      (userRepository.createQueryBuilder as jest.Mock).mockImplementation(
        () => ({
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          getMany: jest.fn().mockResolvedValue(_userList),
        }),
      );
      const result = await controller.addProject(
        addProjetDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        successMessage: 'Project created',
        statusCode: 200,
      });
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('when add project date less than current date', () => {
    it('should get 400 success status', async () => {
      let addProjetDto = {
        project_name: 'string',
        project_code: 'Proj_1011',
        start_date: '2023-03-04',
        end_date: '2024-04-09',
        project_description: 'string string',
      };

      const result = await service.addProjectService(
        addProjetDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage:
          'start date must be greater than or equal to current date',
        statusCode: 1012,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('when add project date end date less than start date', () => {
    it('should get 400 success status', async () => {
      let addProjetDto = {
        project_name: 'string',
        project_code: 'Proj_1011',
        start_date: '2024-04-04',
        end_date: '2023-04-01',
        project_description: 'string string',
      };

      const result = await service.addProjectService(
        addProjetDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'end date must be greater than or equal to current date',
        statusCode: 1013,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('when add project date end date less than start date and greater than current date', () => {
    it('should get 400 success status', async () => {
      let addProjetDto = {
        project_name: 'string',
        project_code: 'Proj_1011',
        start_date: '2024-04-05',
        end_date: '2024-04-04',
        project_description: 'string string',
      };

      const result = await service.addProjectService(
        addProjetDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'end date must be greater than start date',
        statusCode: 75,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('when add project valid project name', () => {
    it('should get 400 success status', async () => {
      let addProjetDto = {
        project_name: 'stri   ng',
        project_code: 'Proj_1011',
        start_date: '2024-04-05',
        end_date: '2024-04-06',
        project_description: 'string string',
      };

      const result = await service.addProjectService(
        addProjetDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage:
          'project name must contain only alphabets,numbers and single space',
        statusCode: 1601,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('when add project invalid project code', () => {
    it('should get 400 success status', async () => {
      let addProjetDto = {
        project_name: 'string',
        project_code: 'Proj  _1011',
        start_date: '2024-04-05',
        end_date: '2024-04-06',
        project_description: 'string string',
      };

      const result = await service.addProjectService(
        addProjetDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'invalid project code',
        statusCode: 3772,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('when add project invalid start date', () => {
    it('should get 400 success status', async () => {
      let addProjetDto = {
        project_name: 'string',
        project_code: 'xyhgxya',
        start_date: '2024-02-30',
        end_date: '2024-04-06',
        project_description: 'string string',
      };

      const result = await service.addProjectService(
        addProjetDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Invalid start date',
        statusCode: 3001,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('when add project invalid end date', () => {
    it('should get 400 success status', async () => {
      let addProjetDto = {
        project_name: 'string',
        project_code: 'xyhgxya',
        start_date: '2024-02-28',
        end_date: '2024-02-30',
        project_description: 'string string',
      };
      const result = await service.addProjectService(
        addProjetDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Invalid end date',
        statusCode: 3002,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('when add project exception', () => {
    it('should get 400 success status', async () => {
      let addProjetDto = {
        project_name: 'string',
        project_code: 'Proj_1011',
        start_date: '2024-04-04',
        end_date: '2024-04-09',
        project_description: 'string string',
      };
      (userRepository.createQueryBuilder as jest.Mock).mockImplementationOnce(
        () => {
          throw new Error('new error');
        },
      );
      const result = await controller.addProject(
        addProjetDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Exception',
        statusCode: 400,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('when batch update where project not found', () => {
    it('should get 400 success status', async () => {
      let project_id = 18;
      let batchUpdateDto = {
        tasks: [],
        status: 1,
        assigne: null,
        comment: '',
      };
      const result = await service.batchUpdateService(
        project_id,
        batchUpdateDto,
        requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Project not found',
        statusCode: 50,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('when batch update where atleast need one task', () => {
    it('should get 400 success status', async () => {
      let project_id = project_2.project_id;
      let batchUpdateDto = {
        tasks: [],
        status: 1,
        assigne: null,
        comment: '',
      };
      const result = await service.batchUpdateService(
        project_id,
        batchUpdateDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'atleast one task requied',
        statusCode: 3513,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('when batch update task not found', () => {
    it('should get 400 success status', async () => {
      let project_id = project_2.project_id;
      let batchUpdateDto = {
        tasks: [1, 2, 3],
        status: 1,
        assigne: null,
        comment: '',
      };
      (taskRepository.createQueryBuilder as jest.Mock).mockImplementation(
        () => ({
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          getOne: jest.fn().mockResolvedValue(null),
        }),
      );
      const result = await service.batchUpdateService(
        project_id,
        batchUpdateDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: '1,2,3 not found',
        statusCode: 777,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('when batch update ', () => {
    it('should get 200 success status', async () => {
      let project_id = project_2.project_id;
      let batchUpdateDto = {
        tasks: [1, 2, 3],
        status: 1,
        assigne: null,
        comment: '',
      };
      (taskRepository.createQueryBuilder as jest.Mock).mockImplementation(
        () => ({
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          getOne: jest.fn().mockResolvedValue(_task),
        }),
      );
      (historyRepo.create as jest.Mock).mockResolvedValue(() => {
        return {
          status: STATUS.ACTIVE,
          task_id: _task,
          task_history_status: STATUS.ACTIVE,
          action: TASK_HISTORY_ACTION.UPDATE_TASK,
          created_date: new Date(),
          updated_date: new Date(),
          created_by_history: requestMock['currentUser'],
          updated_by_history: requestMock['currentUser'],
          task_history: project_2,
          task_name: _task.task_name,
          task_description: _task.task_description,
          task_created_date: _task.created_date,
          history_type: HISTORY_TYPE.TASK_HISTORY,
        };
      });
      const result = await service.batchUpdateService(
        project_id,
        batchUpdateDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        statusCode: 200,
        successMessage: 'batch update successfully',
      });
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('when batch update in controller', () => {
    it('should get 200 success status', async () => {
      let project_id = project_2.project_id;
      let batchUpdateDto = {
        tasks: [1, 2, 3],
        status: 1,
        assigne: null,
        comment: '',
      };
      (taskRepository.createQueryBuilder as jest.Mock).mockImplementation(
        () => ({
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          getOne: jest.fn().mockResolvedValue(_task),
        }),
      );
      (historyRepo.create as jest.Mock).mockResolvedValue(() => {
        return {
          status: STATUS.ACTIVE,
          task_id: _task,
          task_history_status: STATUS.ACTIVE,
          action: TASK_HISTORY_ACTION.UPDATE_TASK,
          created_date: new Date(),
          updated_date: new Date(),
          created_by_history: requestMock['currentUser'],
          updated_by_history: requestMock['currentUser'],
          task_history: project_2,
          task_name: _task.task_name,
          task_description: _task.task_description,
          task_created_date: _task.created_date,
          history_type: HISTORY_TYPE.TASK_HISTORY,
          comment: batchUpdateDto.comment,
        };
      });
      const result = await controller.batchUpdate(
        project_id,
        batchUpdateDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        statusCode: 200,
        successMessage: 'batch update successfully',
      });
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('when batch update comment only', () => {
    it('should get 200 success status', async () => {
      let project_id = project_2.project_id;
      let batchUpdateDto = {
        tasks: [1, 2, 3],
        status: null,
        assigne: null,
        comment: 'sdftgyhuj',
      };
      (taskRepository.createQueryBuilder as jest.Mock).mockImplementation(
        () => ({
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          getOne: jest.fn().mockResolvedValue(_task),
        }),
      );
      (historyRepo.create as jest.Mock).mockResolvedValue(() => {
        return {
          status: STATUS.ACTIVE,
          task_id: _task,
          task_history_status: STATUS.ACTIVE,
          action: TASK_HISTORY_ACTION.UPDATE_TASK,
          created_date: new Date(),
          updated_date: new Date(),
          created_by_history: requestMock['currentUser'],
          updated_by_history: requestMock['currentUser'],
          task_history: project_2,
          task_name: _task.task_name,
          task_description: _task.task_description,
          task_created_date: _task.created_date,
          history_type: HISTORY_TYPE.TASK_HISTORY,
          comment: batchUpdateDto.comment,
        };
      });
      const result = await service.batchUpdateService(
        project_id,
        batchUpdateDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        statusCode: 200,
        successMessage: 'batch update successfully',
      });
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('when batch update assigne not found', () => {
    it('should get 200 success status', async () => {
      let project_id = project_2.project_id;
      let batchUpdateDto = {
        tasks: [1, 2, 3],
        status: null,
        assigne: 18,
        comment: 'sdftgyhuj',
      };
      (taskRepository.createQueryBuilder as jest.Mock).mockImplementation(
        () => ({
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          getOne: jest.fn().mockResolvedValue(_task),
        }),
      );
      (historyRepo.create as jest.Mock).mockResolvedValue(() => {
        return {
          status: STATUS.ACTIVE,
          task_id: _task,
          task_history_status: STATUS.ACTIVE,
          action: TASK_HISTORY_ACTION.UPDATE_TASK,
          created_date: new Date(),
          updated_date: new Date(),
          created_by_history: requestMock['currentUser'],
          updated_by_history: requestMock['currentUser'],
          task_history: project_2,
          task_name: _task.task_name,
          task_description: _task.task_description,
          task_created_date: _task.created_date,
          history_type: HISTORY_TYPE.TASK_HISTORY,
          comment: batchUpdateDto.comment,
        };
      });
      const result = await service.batchUpdateService(
        project_id,
        batchUpdateDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'User not found',
        statusCode: 31,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('when batch update when unauthorised user batch update', () => {
    it('should get 400 success status', async () => {
      const project = {
        project_id: 2,
        project_name: 'Project 1',
        project_code: 'Proj_101',
        project_description: 'dummy project is live 1',
        status: 1,
        project_status: null,
        end_date: '2023-08-15',
        start_date: '2023-02-15',
        created_date: new Date('2023-02-15T04:58:04.000Z'),
        updated_date: new Date('2023-02-15T04:58:04.000Z'),
        total_resource: 5,
        total_task: 4,
      };
      let project_id = project_2.project_id;
      let batchUpdateDto = {
        tasks: [1, 2, 3],
        status: null,
        assigne: 1,
        comment: 'sdftgyhuj',
      };
      let _resource: {
        project_resource_allocation_id: 2;
        allocation_status: 1;
        status: 1;
        from_date: '2023-02-15';
        to_date: '2023-03-15';
        pin_status: 1;
        pin_order: 2;
        created_date: '2023-02-15T04:58:06.000Z';
        updated_date: '2023-02-15T04:58:06.000Z';
        role: {
          role_id: 3;
          role_name: 'Project_Admin';
          status: 1;
          created_date: '2023-01-02T18:30:00.000Z';
          updated_date: '2023-01-02T18:30:00.000Z';
          authority: 2;
        };
      };
      (taskRepository.createQueryBuilder as jest.Mock).mockImplementation(
        () => ({
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          getOne: jest.fn().mockResolvedValue(_task),
        }),
      );
      (historyRepo.create as jest.Mock).mockResolvedValue(() => {
        return {
          status: STATUS.ACTIVE,
          task_id: _task,
          task_history_status: STATUS.ACTIVE,
          action: TASK_HISTORY_ACTION.UPDATE_TASK,
          created_date: new Date(),
          updated_date: new Date(),
          created_by_history: requestMock['currentUser'],
          updated_by_history: requestMock['currentUser'],
          task_history: project_2,
          task_name: _task.task_name,
          task_description: _task.task_description,
          task_created_date: _task.created_date,
          history_type: HISTORY_TYPE.TASK_HISTORY,
          comment: batchUpdateDto.comment,
        };
      });

      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc == project &&
          options.where.allocated_user.user_id == 1 &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.status == STATUS.ACTIVE
        ) {
          return true;
        }
      });
      const result = await service.batchUpdateService(
        project_id,
        batchUpdateDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Unauthorized access',
        statusCode: 399,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('when batch update when assign not found', () => {
    it('should get 400 success status', async () => {
      const project = {
        project_id: 2,
        project_name: 'Project 1',
        project_code: 'Proj_101',
        project_description: 'dummy project is live 1',
        status: 1,
        project_status: null,
        end_date: '2023-08-15',
        start_date: '2023-02-15',
        created_date: new Date('2023-02-15T04:58:04.000Z'),
        updated_date: new Date('2023-02-15T04:58:04.000Z'),
        total_resource: 5,
        total_task: 4,
      };
      let project_id = project_2.project_id;
      let batchUpdateDto = {
        tasks: [1, 2, 3],
        status: null,
        assigne: 1,
        comment: 'sdftgyhuj',
      };
      let _resource: {
        project_resource_allocation_id: 2;
        allocation_status: 1;
        status: 1;
        from_date: '2023-02-15';
        to_date: '2023-03-15';
        pin_status: 1;
        pin_order: 2;
        created_date: '2023-02-15T04:58:06.000Z';
        updated_date: '2023-02-15T04:58:06.000Z';
        role: {
          role_id: 3;
          role_name: 'Project_Admin';
          status: 1;
          created_date: '2023-01-02T18:30:00.000Z';
          updated_date: '2023-01-02T18:30:00.000Z';
          authority: 2;
        };
      };
      (taskRepository.createQueryBuilder as jest.Mock).mockImplementation(
        () => ({
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          getOne: jest.fn().mockResolvedValue(_task),
        }),
      );
      (historyRepo.create as jest.Mock).mockResolvedValue(() => {
        return {
          status: STATUS.ACTIVE,
          task_id: _task,
          task_history_status: STATUS.ACTIVE,
          action: TASK_HISTORY_ACTION.UPDATE_TASK,
          created_date: new Date(),
          updated_date: new Date(),
          created_by_history: requestMock['currentUser'],
          updated_by_history: requestMock['currentUser'],
          task_history: project_2,
          task_name: _task.task_name,
          task_description: _task.task_description,
          task_created_date: _task.created_date,
          history_type: HISTORY_TYPE.TASK_HISTORY,
          comment: batchUpdateDto.comment,
        };
      });

      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc == project &&
          options.where.allocated_user.user_id == 1 &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.status == STATUS.ACTIVE
        ) {
          return true;
        } else {
          return resourceAllocationAdminDataDeleteTask;
        }
      });
      const result = await service.batchUpdateService(
        project_id,
        batchUpdateDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'User not found',
        statusCode: 31,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('when batch update when assign not found in project', () => {
    it('should get 400 success status', async () => {
      const project = {
        project_id: 2,
        project_name: 'Project 1',
        project_code: 'Proj_101',
        project_description: 'dummy project is live 1',
        status: 1,
        project_status: null,
        end_date: '2023-08-15',
        start_date: '2023-02-15',
        created_date: new Date('2023-02-15T04:58:04.000Z'),
        updated_date: new Date('2023-02-15T04:58:04.000Z'),
        total_resource: 5,
        total_task: 4,
      };
      let project_id = project_2.project_id;
      let batchUpdateDto = {
        tasks: [1, 2, 3],
        status: null,
        assigne: 1,
        comment: 'sdftgyhuj',
      };
      let _resource: {
        project_resource_allocation_id: 2;
        allocation_status: 1;
        status: 1;
        from_date: '2023-02-15';
        to_date: '2023-03-15';
        pin_status: 1;
        pin_order: 2;
        created_date: '2023-02-15T04:58:06.000Z';
        updated_date: '2023-02-15T04:58:06.000Z';
        role: {
          role_id: 3;
          role_name: 'Project_Admin';
          status: 1;
          created_date: '2023-01-02T18:30:00.000Z';
          updated_date: '2023-01-02T18:30:00.000Z';
          authority: 2;
        };
      };
      (taskRepository.createQueryBuilder as jest.Mock).mockImplementation(
        () => ({
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          getOne: jest.fn().mockResolvedValue(_task),
        }),
      );
      (historyRepo.create as jest.Mock).mockResolvedValue(() => {
        return {
          status: STATUS.ACTIVE,
          task_id: _task,
          task_history_status: STATUS.ACTIVE,
          action: TASK_HISTORY_ACTION.UPDATE_TASK,
          created_date: new Date(),
          updated_date: new Date(),
          created_by_history: requestMock['currentUser'],
          updated_by_history: requestMock['currentUser'],
          task_history: project_2,
          task_name: _task.task_name,
          task_description: _task.task_description,
          task_created_date: _task.created_date,
          history_type: HISTORY_TYPE.TASK_HISTORY,
          comment: batchUpdateDto.comment,
        };
      });

      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc == project &&
          options.where.allocated_user.user_id == 1 &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.status == STATUS.ACTIVE
        ) {
          return true;
        } else if (
          options.where.project_id_resource_alloc === project_2 &&
          options.where.allocated_user == currentUserObj &&
          options.where.allocation_status === ALLOCATION_STATUS.ALLOCATED
        ) {
          return resourceAllocationAdminDataDeleteTask;
        } else {
          return null;
        }
      });

      (userRepository.findOne as jest.Mock).mockImplementation(
        (options: any) => {
          if (options.where.user_id == 142) {
            return userList[0];
          } else if (options.where.user_id == 1) {
            return userList[0];
          } else {
            return null;
          }
        },
      );
      const result = await service.batchUpdateService(
        project_id,
        batchUpdateDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'User not found',
        statusCode: 31,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('when batch update when assign  found in project', () => {
    it('should get 400 success status', async () => {
      const project = {
        project_id: 2,
        project_name: 'Project 1',
        project_code: 'Proj_101',
        project_description: 'dummy project is live 1',
        status: 1,
        project_status: null,
        end_date: '2023-08-15',
        start_date: '2023-02-15',
        created_date: new Date('2023-02-15T04:58:04.000Z'),
        updated_date: new Date('2023-02-15T04:58:04.000Z'),
        total_resource: 5,
        total_task: 4,
      };
      let project_id = project_2.project_id;
      let batchUpdateDto = {
        tasks: [1, 2, 3],
        status: null,
        assigne: 1,
        comment: 'sdftgyhuj',
      };
      let _resource: {
        project_resource_allocation_id: 2;
        allocation_status: 1;
        status: 1;
        from_date: '2023-02-15';
        to_date: '2023-03-15';
        pin_status: 1;
        pin_order: 2;
        created_date: '2023-02-15T04:58:06.000Z';
        updated_date: '2023-02-15T04:58:06.000Z';
        role: {
          role_id: 3;
          role_name: 'Project_Admin';
          status: 1;
          created_date: '2023-01-02T18:30:00.000Z';
          updated_date: '2023-01-02T18:30:00.000Z';
          authority: 2;
        };
      };
      (taskRepository.createQueryBuilder as jest.Mock).mockImplementation(
        () => ({
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          getOne: jest.fn().mockResolvedValue(_task),
        }),
      );
      (historyRepo.create as jest.Mock).mockResolvedValue(() => {
        return {
          status: STATUS.ACTIVE,
          task_id: _task,
          task_history_status: STATUS.ACTIVE,
          action: TASK_HISTORY_ACTION.UPDATE_TASK,
          created_date: new Date(),
          updated_date: new Date(),
          created_by_history: requestMock['currentUser'],
          updated_by_history: requestMock['currentUser'],
          task_history: project_2,
          task_name: _task.task_name,
          task_description: _task.task_description,
          task_created_date: _task.created_date,
          history_type: HISTORY_TYPE.TASK_HISTORY,
          comment: batchUpdateDto.comment,
          new_assignee_history: null,
          assignee: null,
        };
      });

      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc == project &&
          options.where.allocated_user.user_id == 1 &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.status == STATUS.ACTIVE
        ) {
          return true;
        } else if (
          options.where.project_id_resource_alloc === project_2 &&
          options.where.allocated_user == currentUserObj &&
          options.where.allocation_status === ALLOCATION_STATUS.ALLOCATED
        ) {
          return resourceAllocationAdminDataDeleteTask;
        } else {
          return resourceAllocationAdminDataDeleteTask;
        }
      });

      (userRepository.findOne as jest.Mock).mockImplementation(
        (options: any) => {
          if (options.where.user_id == 142) {
            return userList[0];
          } else if (options.where.user_id == 1) {
            return userList[0];
          } else {
            return null;
          }
        },
      );
      const result = await service.batchUpdateService(
        project_id,
        batchUpdateDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        statusCode: 200,
        successMessage: 'batch update successfully',
      });
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('when batch update when no change', () => {
    it('should get 400 success status', async () => {
      const project = {
        project_id: 2,
        project_name: 'Project 1',
        project_code: 'Proj_101',
        project_description: 'dummy project is live 1',
        status: 1,
        project_status: null,
        end_date: '2023-08-15',
        start_date: '2023-02-15',
        created_date: new Date('2023-02-15T04:58:04.000Z'),
        updated_date: new Date('2023-02-15T04:58:04.000Z'),
        total_resource: 5,
        total_task: 4,
      };
      let project_id = project_2.project_id;
      let batchUpdateDto = {
        tasks: [1, 2, 3],
        status: null,
        assigne: null,
        comment: null,
      };
      let _resource: {
        project_resource_allocation_id: 2;
        allocation_status: 1;
        status: 1;
        from_date: '2023-02-15';
        to_date: '2023-03-15';
        pin_status: 1;
        pin_order: 2;
        created_date: '2023-02-15T04:58:06.000Z';
        updated_date: '2023-02-15T04:58:06.000Z';
        role: {
          role_id: 3;
          role_name: 'Project_Admin';
          status: 1;
          created_date: '2023-01-02T18:30:00.000Z';
          updated_date: '2023-01-02T18:30:00.000Z';
          authority: 2;
        };
      };
      (taskRepository.createQueryBuilder as jest.Mock).mockImplementation(
        () => ({
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          getOne: jest.fn().mockResolvedValue(_task),
        }),
      );
      (historyRepo.create as jest.Mock).mockResolvedValue(() => {
        return {
          status: STATUS.ACTIVE,
          task_id: _task,
          task_history_status: STATUS.ACTIVE,
          action: TASK_HISTORY_ACTION.UPDATE_TASK,
          created_date: new Date(),
          updated_date: new Date(),
          created_by_history: requestMock['currentUser'],
          updated_by_history: requestMock['currentUser'],
          task_history: project_2,
          task_name: _task.task_name,
          task_description: _task.task_description,
          task_created_date: _task.created_date,
          history_type: HISTORY_TYPE.TASK_HISTORY,
          comment: batchUpdateDto.comment,
          new_assignee_history: null,
          assignee: null,
        };
      });

      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc == project &&
          options.where.allocated_user.user_id == 1 &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.status == STATUS.ACTIVE
        ) {
          return true;
        } else if (
          options.where.project_id_resource_alloc === project_2 &&
          options.where.allocated_user == currentUserObj &&
          options.where.allocation_status === ALLOCATION_STATUS.ALLOCATED
        ) {
          return resourceAllocationAdminDataDeleteTask;
        } else {
          return resourceAllocationAdminDataDeleteTask;
        }
      });

      (userRepository.findOne as jest.Mock).mockImplementation(
        (options: any) => {
          if (options.where.user_id == 142) {
            return userList[0];
          } else if (options.where.user_id == 1) {
            return userList[0];
          } else {
            return null;
          }
        },
      );
      const result = await service.batchUpdateService(
        project_id,
        batchUpdateDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'No change in data',
        statusCode: 1033,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('when batch update task not found', () => {
    it('should get 400 success status', async () => {
      let project_id = project_2.project_id;
      let batchUpdateDto = {
        tasks: [1, 2, 3],
        status: 1,
        assigne: null,
        comment: '',
      };
      (taskRepository.createQueryBuilder as jest.Mock).mockImplementationOnce(
        () => {
          throw new Error('new Error');
        },
      );
      const result = await service.batchUpdateService(
        project_id,
        batchUpdateDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Exception',
        statusCode: 400,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  //   describe('when update project', () => {
  //     it('should get 400 success status', async () => {
  //       let project_id = project_2.project_id
  //     let updateProjectDto={
  //       project_name:project_2.project_name,
  //       project_description:project_2.project_description,
  //       start_date:project_2.start_date,
  //       end_date:project_2.end_date
  //     }
  //     const result = await service.updateProjectService(
  //       project_id,
  //       updateProjectDto,
  //       requestMock,
  //       responseMock,
  //     );
  //     });
  //   });

  describe('when un pin project', () => {
    it('should return 200 when pin project', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let pinProjectDto: PinProjectDto = {
        project_id: 2,
      };
      (resourceRepo.find as jest.Mock).mockResolvedValueOnce(
        pinProjectFindData,
      );

      const result = await controller.pinProject(
        pinProjectDto,
        _requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(201);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('when pin project', () => {
    it('should return 200 when pin project', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let pinProjectDto: PinProjectDto = {
        project_id: 22,
      };
      (resourceRepo.find as jest.Mock).mockResolvedValueOnce(
        pinnedProjectDescOrder,
      );

      const result = await service.pinProject(
        pinProjectDto,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(200);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('when pin project not found', () => {
    it('should return 400 when pin project not found', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let pinProjectDto: PinProjectDto = {
        project_id: 1000,
      };
      (resourceRepo.find as jest.Mock).mockResolvedValueOnce(
        pinnedProjectDescOrder,
      );

      const result = await service.pinProject(
        pinProjectDto,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(50);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('when pin project when user is not allocated', () => {
    it('should return 400 when user is not allocated', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;

      let pinProjectDto: PinProjectDto = {
        project_id: 2,
      };

      (resourceRepo.findOne as jest.Mock).mockResolvedValueOnce(null);

      const result = await service.pinProject(
        pinProjectDto,
        _requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(50);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  // describe('when user is already allocated to project to project', () => {
  //   it('should return 200 when user is already allocated to project to project', async () => {
  //     let _requestMock: Request = {
  //       currentUser: currentUserObj,
  //     } as unknown as Request;
  //     let project_id = 22;
  //     let allocateDto: AllocateUserDto = {
  //       users: [142],
  //       from_date: '2050-08-15',
  //       to_date: '2050-08-15',
  //       role: 3,
  //     };
  //     (resourceRepo.save as jest.Mock).mockResolvedValueOnce(
  //       _allocatedUserDetail,
  //     );
  //     const result = await service.allocateUsers(
  //       allocateDto,
  //       _requestMock,
  //       project_id,
  //       responseMock,
  //     );
  //       console.log(result);
        
  //     expect(result).toBeDefined();
  //     expect(result[0].code).toStrictEqual(1);
  //     expect(responseMock.status).toHaveBeenCalledWith(200);
  //   });
  // });

  // describe('allocate user when user is not found', () => {
  //   it('should return 200 when user is not found', async () => {
  //     let _requestMock: Request = {
  //       currentUser: currentUserObj,
  //     } as unknown as Request;
  //     let project_id = 22;
  //     let allocateDto: AllocateUserDto = {
  //       users: [2],
  //       from_date: '2050-08-15',
  //       to_date: '2050-08-15',
  //       role: 3,
  //     };
  //     (resourceRepo.save as jest.Mock).mockResolvedValueOnce(
  //       _allocatedUserDetail,
  //     );
  //     const result = await service.allocateUsers(
  //       allocateDto,
  //       _requestMock,
  //       project_id,
  //       responseMock,
  //     );

  //     expect(result).toBeDefined();
  //     expect(result[0].code).toStrictEqual(0);
  //     expect(responseMock.status).toHaveBeenCalledWith(200);
  //   });
  // });

  describe('allocate user when from date is invalid', () => {
    it('should return 400 when from date is invalid', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let project_id = 22;
      let allocateDto: AllocateUserDto = {
        users: [2],
        from_date: '2023-02-29',
        to_date: '2023-04-07',
        role: 3,
      };
      (resourceRepo.save as jest.Mock).mockResolvedValueOnce(
        _allocatedUserDetail,
      );
      const result = await service.allocateUsers(
        allocateDto,
        _requestMock,
        project_id,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(3042);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('allocate user when to date is invalid', () => {
    it('should return 400 when to date is invalid', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let project_id = 22;
      let allocateDto: AllocateUserDto = {
        users: [2],
        from_date: '2023-02-28',
        to_date: '2023-02-29',
        role: 3,
      };
      (resourceRepo.save as jest.Mock).mockResolvedValueOnce(
        _allocatedUserDetail,
      );
      const result = await service.allocateUsers(
        allocateDto,
        _requestMock,
        project_id,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(3043);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('allocate user when start date < current date', () => {
    it('should return 400 when start date < current date', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let project_id = 22;
      let allocateDto: AllocateUserDto = {
        users: [2],
        from_date: '2023-02-28',
        to_date: '2023-02-28',
        role: 3,
      };
      (resourceRepo.save as jest.Mock).mockResolvedValueOnce(
        _allocatedUserDetail,
      );
      const result = await service.allocateUsers(
        allocateDto,
        _requestMock,
        project_id,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(1012);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('allocate user when end date < current date', () => {
    it('should return 400 when end date < current date', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let project_id = 22;
      let allocateDto: AllocateUserDto = {
        users: [2],
        from_date: '2050-04-06',
        to_date: '2023-02-28',
        role: 3,
      };
      (resourceRepo.save as jest.Mock).mockResolvedValueOnce(
        _allocatedUserDetail,
      );
      const result = await service.allocateUsers(
        allocateDto,
        _requestMock,
        project_id,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(1013);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('allocate user when end date < start date', () => {
    it('should return 400 when end date < start date', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let project_id = 22;
      let allocateDto: AllocateUserDto = {
        users: [2],
        from_date: '2050-08-15',
        to_date: '2050-08-14',
        role: 3,
      };
      (resourceRepo.save as jest.Mock).mockResolvedValueOnce(
        _allocatedUserDetail,
      );
      const result = await service.allocateUsers(
        allocateDto,
        _requestMock,
        project_id,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(75);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('allocate user when end date > projects end date', () => {
    it('should return 400 when end date > projects end date', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let project_id = 22;
      let allocateDto: AllocateUserDto = {
        users: [2],
        from_date: '2050-08-15',
        to_date: '2050-08-19',
        role: 3,
      };
      (resourceRepo.save as jest.Mock).mockResolvedValueOnce(
        _allocatedUserDetail,
      );
      const result = await service.allocateUsers(
        allocateDto,
        _requestMock,
        project_id,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(83);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('allocate user when duplication in user array', () => {
    it('should return 400 when duplication in user array', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let project_id = 22;
      let allocateDto: AllocateUserDto = {
        users: [2, 2],
        from_date: '2050-08-15',
        to_date: '2050-08-15',
        role: 3,
      };
      (resourceRepo.save as jest.Mock).mockResolvedValueOnce(
        _allocatedUserDetail,
      );
      const result = await service.allocateUsers(
        allocateDto,
        _requestMock,
        project_id,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(82);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('allocate user when string in user array', () => {
    it('should return 400 when string in user array', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let project_id = 22;
      let allocateDto: AllocateUserDto = {
        users: [2, 'aaaa'],
        from_date: '2050-08-15',
        to_date: '2050-08-15',
        role: 3,
      };
      (resourceRepo.save as jest.Mock).mockResolvedValueOnce(
        _allocatedUserDetail,
      );
      const result = await service.allocateUsers(
        allocateDto,
        _requestMock,
        project_id,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(78);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('allocate user when start date < projects start date', () => {
    it('should return 400 when start date < projects start date', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let project_id = 23;
      let allocateDto: AllocateUserDto = {
        users: [2],
        from_date: '2050-08-10',
        to_date: '2050-08-15',
        role: 3,
      };
      (resourceRepo.save as jest.Mock).mockResolvedValueOnce(
        _allocatedUserDetail,
      );
      const result = await service.allocateUsers(
        allocateDto,
        _requestMock,
        project_id,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(84);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('allocate user when project not found', () => {
    it('should return 400 when project not found', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let project_id = 1000;
      let allocateDto: AllocateUserDto = {
        users: [2],
        from_date: '2050-08-15',
        to_date: '2050-08-15',
        role: 3,
      };
      (resourceRepo.save as jest.Mock).mockResolvedValueOnce(
        _allocatedUserDetail,
      );
      const result = await service.allocateUsers(
        allocateDto,
        _requestMock,
        project_id,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(50);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('allocate user when unauthorized', () => {
    it('should return 400 when unauthorized', async () => {
      let _requestMock: Request = {
        currentUser: dummyUnauthorized,
      } as unknown as Request;
      let project_id = 22;
      let allocateDto: AllocateUserDto = {
        users: [2],
        from_date: '2050-08-15',
        to_date: '2050-08-15',
        role: 3,
      };
      (resourceRepo.findOne as jest.Mock).mockResolvedValueOnce(null);
      const result = await service.allocateUsers(
        allocateDto,
        _requestMock,
        project_id,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(399);
      expect(responseMock.status).toHaveBeenCalledWith(399);
    });
  });

  describe('allocate user when user is developer', () => {
    it('should return 400 when user is developer', async () => {
      let _requestMock: Request = {
        currentUser: dummyDeveloper,
      } as unknown as Request;
      let project_id = 22;
      let allocateDto: AllocateUserDto = {
        users: [2],
        from_date: '2050-08-15',
        to_date: '2050-08-15',
        role: 3,
      };
      (resourceRepo.findOne as jest.Mock).mockResolvedValueOnce(dummyDeveloper);
      const result = await service.allocateUsers(
        allocateDto,
        _requestMock,
        project_id,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(399);
      expect(responseMock.status).toHaveBeenCalledWith(399);
    });
  });

  // describe('when allocate user to project', () => {
  //   it('should return 200 when user allocated to project', async () => {
  //     let _requestMock: Request = {
  //       currentUser: currentUserObj,
  //     } as unknown as Request;
  //     let project_id = 22;
  //     let allocateDto: AllocateUserDto = {
  //       users: [142],
  //       from_date: '2050-08-15',
  //       to_date: '2050-08-15',
  //       role: 3,
  //     };
  //     (resourceRepo.findOne as jest.Mock).mockImplementation((option) => {
  //       if (
  //         option.where.allocated_user == currentUserObj &&
  //         option.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
  //         option.where.project_id_resource_alloc == project_3
  //       ) {
  //         return resourceAllocationPinProject;
  //       } else if (
  //         option.where.allocated_user == userList[1] &&
  //         option.where.status == STATUS.ACTIVE &&
  //         option.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
  //         option.where.project_id_resource_alloc == project_3
  //       ) {
  //         return null;
  //       }
  //     });
  //     (resourceRepo.find as jest.Mock).mockImplementation((option) => {
  //       return projectMemberListAllocateProject;
  //     });
  //     (resourceRepo.save as jest.Mock).mockResolvedValueOnce(
  //       _allocatedUserDetail,
  //     );
  //     const result = await controller.allocateUser(
  //       allocateDto,
  //       project_id,
  //       _requestMock,
  //       responseMock,
  //     );

  //     expect(result).toBeDefined();
  //     expect(result[0].code).toStrictEqual(2);
  //     expect(responseMock.status).toHaveBeenCalledWith(200);
  //   });
  // });

  describe('get unallocated users - when project not found', () => {
    it('should return 400 when project not found', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let project_id = 1000;
      (resourceRepo.find as jest.Mock).mockResolvedValueOnce(
        getUnAllocatedUsersFromRepo,
      );
      (userRepository.find as jest.Mock).mockResolvedValueOnce(
        unallocatedUserList,
      );
      const result = await controller.getUnallocatedUsers(
        project_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(50);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('get unallocated users - when user is not allocated', () => {
    it('should return 400 when user is not allocated', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let project_id = 22;
      (resourceRepo.findOne as jest.Mock).mockResolvedValueOnce(null);
      const result = await controller.getUnallocatedUsers(
        project_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(399);
      expect(responseMock.status).toHaveBeenCalledWith(399);
    });
  });

  describe('get unallocated users - when user is unauthorized', () => {
    it('should return 400 when user is unauthorized', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let project_id = 22;
      (resourceRepo.findOne as jest.Mock).mockResolvedValueOnce(dummyDeveloper);
      const result = await controller.getUnallocatedUsers(
        project_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(399);
      expect(responseMock.status).toHaveBeenCalledWith(399);
    });
  });

  // describe('get unallocated users - controller', () => {
  //   it('should return 200 get unallocated users', async () => {
  //     let _requestMock: Request = {
  //       currentUser: currentUserObj,
  //     } as unknown as Request;
  //     let project_id = 22;
  //     (resourceRepo.find as jest.Mock).mockResolvedValueOnce(
  //       getUnAllocatedUsersFromRepo,
  //     );
  //     (userRepository.find as jest.Mock).mockResolvedValueOnce(
  //       unallocatedUserList,
  //     );
  //     const result = await controller.getUnallocatedUsers(
  //       project_id,
  //       _requestMock,
  //       responseMock,
  //     );

  //     expect(result).toBeDefined();
  //     expect(result[0].user_id).toBeDefined();
  //     expect(responseMock.status).toHaveBeenCalledWith(200);
  //   });
  // });

  describe('get project member list - controller', () => {
    it('should return 200 get project member list', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: { roleFilter: 3 },
        query: { searchKey: 123 },
      } as unknown as Request;
      let project_id = 22;
      (roleRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method == 'role') {
            return {
              where: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(lastRole),
            };
          }
        },
      );
      (resourceRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method == 'allocation') {
            return {
              addSelect: jest.fn().mockReturnThis(),
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              addOrderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(2),
              getMany: jest.fn().mockResolvedValue(memberListRole3),
            };
          }
        },
      );
      const result = await controller.getProjectMemberList(
        project_id,
        _requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result['listView']).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('get project member list - when role is not number', () => {
    it('should return 400 when role is not number', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: { roleFilter: 'aaa' },
        query: { searchKey: 123 },
      } as unknown as Request;
      let project_id = 22;

      const result = await service.getProjectMemberList(
        project_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(2515);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('get project member list - when project role not found', () => {
    it('should return 400 when project role not found', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: { roleFilter: 80 },
        query: {},
      } as unknown as Request;
      let project_id = 22;
      (roleRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method == 'role') {
            return {
              where: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(lastRole),
            };
          }
        },
      );
      const result = await service.getProjectMemberList(
        project_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(648);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('get project member list - when project role not found 2', () => {
    it('should return 400 when project role not found 2', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: { roleFilter: 3 },
        query: {},
      } as unknown as Request;
      let project_id = 22;
      (roleRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method == 'role') {
            return {
              where: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(lastRole),
            };
          }
        },
      );
      (roleRepo.findOne as jest.Mock).mockResolvedValueOnce(null);
      const result = await service.getProjectMemberList(
        project_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(648);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('get project member list - when project not found', () => {
    it('should return 400 when project not found', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: { roleFilter: 3 },
        query: {},
      } as unknown as Request;
      let project_id = 22;
      (roleRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method == 'role') {
            return {
              where: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(lastRole),
            };
          }
        },
      );
      (projectRepo.findOne as jest.Mock).mockResolvedValueOnce(null);
      const result = await service.getProjectMemberList(
        project_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(50);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('get project member list - when user is unauthorized', () => {
    it('should return 400 when user is unauthorized', async () => {
      let _requestMock: Request = {
        currentUser: dummyDeveloper,
        body: { roleFilter: 3 },
        query: {},
      } as unknown as Request;
      let project_id = 22;
      (roleRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method == 'role') {
            return {
              where: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(lastRole),
            };
          }
        },
      );
      (resourceRepo.findOne as jest.Mock).mockResolvedValueOnce(null);
      const result = await service.getProjectMemberList(
        project_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(399);
      expect(responseMock.status).toHaveBeenCalledWith(399);
    });
  });

  describe('get project member list - when limit is not number', () => {
    it('should return 400 when limit is not number', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: { roleFilter: 3 },
        query: { limit: 'aaaa' },
      } as unknown as Request;
      let project_id = 22;
      (roleRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method == 'role') {
            return {
              where: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(lastRole),
            };
          }
        },
      );

      const result = await service.getProjectMemberList(
        project_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(3073);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('get project member list - when limit is > 3000', () => {
    it('should return 400 when limit is > 3000', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: { roleFilter: 3 },
        query: { limit: 5000 },
      } as unknown as Request;
      let project_id = 22;
      (roleRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method == 'role') {
            return {
              where: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(lastRole),
            };
          }
        },
      );

      const result = await service.getProjectMemberList(
        project_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(3677);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('get project member list - when page and last id is passed', () => {
    it('should return 400 when page and last id is passed', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: { roleFilter: 3 },
        query: { limit: 200, page: 1, last_id: 2 },
      } as unknown as Request;
      let project_id = 22;
      (roleRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method == 'role') {
            return {
              where: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(lastRole),
            };
          }
        },
      );

      const result = await service.getProjectMemberList(
        project_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(2507);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('get project member list - when page and last id is passed', () => {
    it('should return 400 when page and last id is passed', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: { roleFilter: 3 },
        query: { limit: 200, page: 'asdfgh' },
      } as unknown as Request;
      let project_id = 22;
      (roleRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method == 'role') {
            return {
              where: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(lastRole),
            };
          }
        },
      );

      const result = await service.getProjectMemberList(
        project_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(2505);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('get project member list - when last data is not string', () => {
    it('should return 400 when last data is not string', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: { roleFilter: 3 },
        query: { limit: 200, last_data: 123 },
      } as unknown as Request;
      let project_id = 22;
      (roleRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method == 'role') {
            return {
              where: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(lastRole),
            };
          }
        },
      );

      const result = await service.getProjectMemberList(
        project_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(3071);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('get project member list - when last id is not number', () => {
    it('should return 400 when last id is not number', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: { roleFilter: 3 },
        query: { limit: 200, last_data: 'aa', last_id: 'qww' },
      } as unknown as Request;
      let project_id = 22;
      (roleRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method == 'role') {
            return {
              where: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(lastRole),
            };
          }
        },
      );

      const result = await service.getProjectMemberList(
        project_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(2500);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('get project member list - when last id is not given', () => {
    it('should return 400 when last id is not given', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: { roleFilter: 3 },
        query: { limit: 200, last_data: 'aa' },
      } as unknown as Request;
      let project_id = 22;
      (roleRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method == 'role') {
            return {
              where: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(lastRole),
            };
          }
        },
      );

      const result = await service.getProjectMemberList(
        project_id,
        _requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(2502);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('get project member list - when last data is not given', () => {
    it('should return 400 when last data is not given', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: { roleFilter: 3 },
        query: { limit: 200, last_id: 1 },
      } as unknown as Request;
      let project_id = 22;
      (roleRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method == 'role') {
            return {
              where: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(lastRole),
            };
          }
        },
      );

      const result = await service.getProjectMemberList(
        project_id,
        _requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(2503);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('get project member list - when last record not found', () => {
    it('should return 400 when last record not found', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: { roleFilter: 3 },
        query: { limit: 200, last_id: 1, last_data: 'abcd' },
      } as unknown as Request;
      let project_id = 22;
      (roleRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method == 'role') {
            return {
              where: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(lastRole),
            };
          }
        },
      );
      (resourceRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method == 'allocation') {
            return {
              addSelect: jest.fn().mockReturnThis(),
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(null),
            };
          }
        },
      );
      const result = await service.getProjectMemberList(
        project_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(2504);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('get project member list - when startIndex > total', () => {
    it('should return 200 when startIndex > total ', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: { roleFilter: 3 },
        query: { limit: 10, page: 2 },
      } as unknown as Request;
      let project_id = 22;
      (roleRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method == 'role') {
            return {
              where: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(lastRole),
            };
          }
        },
      );
      (resourceRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method == 'allocation') {
            return {
              addSelect: jest.fn().mockReturnThis(),
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              addOrderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(2),
              getMany: jest.fn().mockResolvedValue(memberListRole3),
            };
          }
        },
      );
      const result = await service.getProjectMemberList(
        project_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result['listView']).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('get project member list - with last data', () => {
    it('should return 200 with last data', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        body: { roleFilter: 3 },
        query: { limit: 10, last_data: 'hemandh', last_id: 2 },
      } as unknown as Request;
      let project_id = 22;
      (roleRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method == 'role') {
            return {
              where: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(lastRole),
            };
          }
        },
      );
      (resourceRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method == 'allocation') {
            return {
              addSelect: jest.fn().mockReturnThis(),
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              addOrderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(2),
              getOne: jest.fn().mockResolvedValue(1),
              getMany: jest.fn().mockResolvedValue(memberListRole3),
            };
          }
        },
      );
      const result = await service.getProjectMemberList(
        project_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result['listView']).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('get project list - controller', () => {
    it('should return 200 with project list', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: { searchKey: 'asd' },
      } as unknown as Request;
      (resourceRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method == 'project_resource') {
            return {
              addSelect: jest.fn().mockReturnThis(),
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              addOrderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockReturnValue(3),
              getMany: jest.fn().mockResolvedValue(projectList),
            };
          }
        },
      );
      const result = await controller.getProjectById(
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result['listView']).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('get project list - when limit is < 1', () => {
    it('should return 400 when limit is < 1', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: { limit: -1 },
      } as unknown as Request;
      const result = await service.getProjectById(_requestMock, responseMock);

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(3073);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('get project list - when limit is > 3000', () => {
    it('should return 400 when limit is > 3000', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: { limit: 4000 },
      } as unknown as Request;
      const result = await service.getProjectById(_requestMock, responseMock);

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(3677);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('get project list - when page and last id id given', () => {
    it('should return 400 when page and last id id given', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: { limit: 2, page: 1, last_id: 10 },
      } as unknown as Request;
      const result = await service.getProjectById(_requestMock, responseMock);

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(2507);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('get project list - when page is invalid', () => {
    it('should return 400 when page is invalid', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: { limit: 2, page: -1 },
      } as unknown as Request;
      const result = await service.getProjectById(_requestMock, responseMock);

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(2505);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('get project list - when last data is not string', () => {
    it('should return 400 when last data is not string', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: { limit: 2, last_data: -1 },
      } as unknown as Request;
      const result = await service.getProjectById(_requestMock, responseMock);

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(3071);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('get project list - when last id is not number', () => {
    it('should return 400 when last id is not number', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: { limit: 2, last_data: 'abc', last_id: 'asd' },
      } as unknown as Request;
      const result = await service.getProjectById(_requestMock, responseMock);

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(2500);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('get project list - when last id is not given', () => {
    it('should return 400 when last id is not given', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: { limit: 2, last_data: 'abc' },
      } as unknown as Request;
      const result = await service.getProjectById(_requestMock, responseMock);

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(2502);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('get project list - when last data is not given', () => {
    it('should return 400 when last data is not given', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: { limit: 2, last_id: 2 },
      } as unknown as Request;
      const result = await service.getProjectById(_requestMock, responseMock);

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(2503);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('get project list - when last record is not found', () => {
    it('should return 400 when last record is not found', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: { limit: 2, last_id: 2, last_data: 'asd' },
      } as unknown as Request;
      (resourceRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method == 'project_resource') {
            return {
              addSelect: jest.fn().mockReturnThis(),
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              addOrderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockReturnValue(null),
            };
          }
        },
      );
      const result = await service.getProjectById(_requestMock, responseMock);

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(2504);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('get project list - when startIndex > total', () => {
    it('should return 400 when startIndex > total', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: { limit: 10, page: 20 },
      } as unknown as Request;
      (resourceRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method == 'project_resource') {
            return {
              addSelect: jest.fn().mockReturnThis(),
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              addOrderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockReturnValue(true),
              getCount: jest.fn().mockReturnValue(3),
              getMany: jest.fn().mockResolvedValue(projectList),
            };
          }
        },
      );
      const result = await service.getProjectById(_requestMock, responseMock);

      expect(result).toBeDefined();
      expect(result['listView']).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('get project list - when last record exist', () => {
    it('should return 400 when last record exist', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: { limit: 2, last_data: 'aaaa', last_id: 12 },
      } as unknown as Request;
      (resourceRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method == 'project_resource') {
            return {
              addSelect: jest.fn().mockReturnThis(),
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              addOrderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockReturnValue(true),
              getCount: jest.fn().mockReturnValue(3),
              getMany: jest.fn().mockResolvedValue(projectList),
            };
          }
        },
      );
      const result = await service.getProjectById(_requestMock, responseMock);

      expect(result).toBeDefined();
      expect(result['listView']).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('get project list - controller exception case', () => {
    it('should return 400 with project list exception case', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: { searchKey: 'asd' },
      } as unknown as Request;
      (resourceRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method == 'project_resourdfdfce') {
            return {
              addSelect: jest.fn().mockReturnThis(),
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              addOrderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockReturnValue(3),
              getMany: jest.fn().mockResolvedValue(projectList),
            };
          }
        },
      );
      const result = await controller.getProjectById(
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(400);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  it('should be defined', () => {
    expect(controller.unallocatedUser).toBeDefined();
  });
  it('should be defined', () => {
    expect(service.unallocatedUserService).toBeDefined();
  });
  describe('unallocate a user from project when project id is null', () => {
    it('should return 400 project id is null', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          project_id: null,
        },
      } as unknown as Request;
      let user_id = 25;
      const result = await service.unallocatedUserService(
        user_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'project id required',
        statusCode: 2501,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('unallocate a user from project when project id is string', () => {
    it('should return 400 when project when project id is string', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          project_id: 'null',
        },
      } as unknown as Request;
      let user_id = 25;
      const result = await service.unallocatedUserService(
        user_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'project id must be a number',
        statusCode: 2502,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('unallocate a user from project when user  is not found', () => {
    it('should return 400 when  user  is not found', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          project_id: 2,
        },
      } as unknown as Request;
      let user_id = 25;
      const result = await service.unallocatedUserService(
        user_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'User not found',
        statusCode: 31,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('unallocate a user from project when user  try to remove himself', () => {
    it('should return 400 when  user  try to remove himself', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          project_id: 2,
        },
      } as unknown as Request;
      let user_id = currentUserObj.user_id;
      (userRepository.findOne as jest.Mock).mockImplementation(
        (options: any) => {
          if (
            options.where.user_id == currentUserObj.user_id &&
            options.where.status == 1
          ) {
            return currentUserObj;
          }
        },
      );
      const result = await service.unallocatedUserService(
        user_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'cannot unallocate themself',
        statusCode: 1998,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('unallocate a user from project when project not found', () => {
    it('should return 400 when  project not found', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          project_id: 54,
        },
      } as unknown as Request;
      let user_id = 142;
      (userRepository.findOne as jest.Mock).mockImplementation(
        (options: any) => {
          if (
            options.where.user_id == currentUserObj.user_id &&
            options.where.status == 1
          ) {
            return currentUserObj;
          } else if (
            options.where.user_id == 142 &&
            options.where.status == 1
          ) {
            return userList[0];
          } else {
            return null;
          }
        },
      );
      const result = await service.unallocatedUserService(
        user_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Project not found',
        statusCode: 50,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('unallocate a user from project when unauthorised', () => {
    it('should return 400 when when unauthorised', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          project_id: 2,
        },
      } as unknown as Request;
      let user_id = 142;
      (userRepository.findOne as jest.Mock).mockImplementation(
        (options: any) => {
          if (
            options.where.user_id == currentUserObj.user_id &&
            options.where.status == 1
          ) {
            return currentUserObj;
          } else if (
            options.where.user_id == 142 &&
            options.where.status == 1
          ) {
            return userList[0];
          } else {
            return null;
          }
        },
      );
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc === project_2 &&
          options.where.allocated_user == currentUserObj &&
          options.where.allocation_status === ALLOCATION_STATUS.ALLOCATED
        ) {
          return null;
        }
      });
      const result = await service.unallocatedUserService(
        user_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Unauthorized access',
        statusCode: 399,
      });
      expect(responseMock.status).toHaveBeenCalledWith(399);
    });
  });

  describe('unallocate a user from project when authorised person', () => {
    it('should return 400 when when unauthorised', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          project_id: 2,
        },
      } as unknown as Request;
      let user_id = 142;
      (userRepository.findOne as jest.Mock).mockImplementation(
        (options: any) => {
          if (
            options.where.user_id == currentUserObj.user_id &&
            options.where.status == 1
          ) {
            return currentUserObj;
          } else if (
            options.where.user_id == 142 &&
            options.where.status == 1
          ) {
            return userList[0];
          } else {
            return null;
          }
        },
      );
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc === project_2 &&
          options.where.allocated_user == currentUserObj &&
          options.where.allocation_status === ALLOCATION_STATUS.ALLOCATED
        ) {
          let _resource = resourceAllocationAdminDataDeleteTask;
          _resource.role.role_id = 5;

          return _resource;
        }
      });
      const result = await service.unallocatedUserService(
        user_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Unauthorized access',
        statusCode: 399,
      });
      expect(responseMock.status).toHaveBeenCalledWith(399);
    });
  });
  describe('unallocate a user from project when user not alloctaed', () => {
    it('should return 400 when when user not alloctaed', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          project_id: 2,
        },
      } as unknown as Request;
      let user_id = 142;
      (userRepository.findOne as jest.Mock).mockImplementation(
        (options: any) => {
          if (
            options.where.user_id == currentUserObj.user_id &&
            options.where.status == 1
          ) {
            return currentUserObj;
          } else if (
            options.where.user_id == 142 &&
            options.where.status == 1
          ) {
            return userList[0];
          } else {
            return null;
          }
        },
      );
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc === project_2 &&
          options.where.allocated_user == currentUserObj &&
          options.where.allocation_status === ALLOCATION_STATUS.ALLOCATED
        ) {
          resourceAllocationAdminDataDeleteTask.role.role_id = 3;

          return resourceAllocationAdminDataDeleteTask;
        }
      });
      const result = await service.unallocatedUserService(
        user_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'User not found',
        statusCode: 31,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  // describe('unallocated user using service', () => {
  //   it('unallocated user using service    ', async () => {
  //     let _requestMock: Request = {
  //       currentUser: currentUserObj,
  //       query: {
  //         project_id: 2,
  //       },
  //     } as unknown as Request;
  //     let user_id = 142;
  //     (userRepository.findOne as jest.Mock).mockImplementation(
  //       (options: any) => {
  //         if (
  //           options.where.user_id == currentUserObj.user_id &&
  //           options.where.status == 1
  //         ) {
  //           return currentUserObj;
  //         } else if (
  //           options.where.user_id == 142 &&
  //           options.where.status == 1
  //         ) {
  //           return userList[0];
  //         } else {
  //           return null;
  //         }
  //       },
  //     );
  //     (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
  //       resourceAllocationAdminDataDeleteTask.allocated_user = currentUserObj;
  //       return resourceAllocationAdminDataDeleteTask;
  //     });

  //     (notificationRepo.createQueryBuilder as jest.Mock).mockImplementation(
  //       () => ({
  //         where: jest.fn().mockReturnThis(),
  //         update:jest.fn().mockReturnThis(),
  //         set:jest.fn().mockReturnThis(),
  //         andWhere: jest.fn().mockReturnThis(),
  //         execute: jest.fn().mockResolvedValue(true),

  //       }),
  //     );
  //     const result = await service.unallocatedUserService(
  //       user_id,
  //       _requestMock,
  //       responseMock,
  //     );

  //     expect(result).toBeDefined();
  //     expect(result).toStrictEqual({
  //       successMessage: 'Hemandh unallocated successfully',
  //       statusCode: 200,
  //     });
  //     expect(responseMock.status).toHaveBeenCalledWith(200);
  //   });
  // });

  describe('unallocated user using service exception case', () => {
    it('unallocated user using service exception case', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          project_id: 2,
        },
      } as unknown as Request;
      let user_id = 142;
      (userRepository.findOne as jest.Mock).mockImplementation(
        (options: any) => {
          if (
            options.where.user_id == currentUserObj.user_id &&
            options.where.status == 1
          ) {
            return currentUserObj;
          } else if (
            options.where.user_id == 142 &&
            options.where.status == 1
          ) {
            return userList[0];
          } else {
            return null;
          }
        },
      );
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        resourceAllocationAdminDataDeleteTask.allocated_user = currentUserObj;
        return resourceAllocationAdminDataDeleteTask;
      });

      const result = await service.unallocatedUserService(
        user_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(400);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  // describe('unallocated user using controller', () => {
  //   it('unallocated user using controller', async () => {
  //     let _requestMock: Request = {
  //       currentUser: currentUserObj,
  //       query: {
  //         project_id: 2,
  //       },
  //     } as unknown as Request;
  //     let user_id = 142;
  //     (userRepository.findOne as jest.Mock).mockImplementation(
  //       (options: any) => {
  //         if (
  //           options.where.user_id == currentUserObj.user_id &&
  //           options.where.status == 1
  //         ) {
  //           return currentUserObj;
  //         } else if (
  //           options.where.user_id == 142 &&
  //           options.where.status == 1
  //         ) {
  //           return userList[0];
  //         } else {
  //           return null;
  //         }
  //       },
  //     );
  //     (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
  //       resourceAllocationAdminDataDeleteTask.allocated_user = currentUserObj;
  //       return resourceAllocationAdminDataDeleteTask;
  //     });

  //     (notificationRepo.createQueryBuilder as jest.Mock).mockImplementation(
  //       () => ({
  //         where: jest.fn().mockReturnThis(),
  //         update:jest.fn().mockReturnThis(),
  //         set:jest.fn().mockReturnThis(),
  //         andWhere: jest.fn().mockReturnThis(),
  //         execute: jest.fn().mockResolvedValue(true),
  //       }),
  //     );
  //     const result = await controller.unallocatedUser(
  //       user_id,
  //       _requestMock,
  //       responseMock,
  //     );

  //     expect(result).toBeDefined();
  //     expect(result).toStrictEqual({
  //       successMessage: 'Hemandh unallocated successfully',
  //       statusCode: 200,
  //     });
  //     expect(responseMock.status).toHaveBeenCalledWith(200);
  //   });
  // });

  describe('overall project is not found', () => {
    it('overall project is not found', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let project_id = 1000;
      (resourceRepo.find as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.allocated_user == currentUserObj &&
          options.where.status == STATUS.ACTIVE &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.project_id_resource_alloc == null
        ) {
          return resourceInProjectStatus;
        }
      });
      const result = await controller.overallProjectStatus(
        _requestMock,
        project_id,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(50);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  // describe('overall project is unauthorized', () => {
  //   it('overall project is unauthorized', async () => {
  //     let _requestMock: Request = {
  //       currentUser: dummyDeveloper,
  //     } as unknown as Request;
  //     let project_id = 2;
  //     (resourceRepo.find as jest.Mock).mockImplementation((options: any) => {
  //       if (
  //         options.where.allocated_user == dummyDeveloper &&
  //         options.where.status == STATUS.ACTIVE &&
  //         options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
  //         options.where.project_id_resource_alloc == project_2
  //       ) {
  //         return [];
  //       }
  //     });
  //     const result = await controller.overallProjectStatus(
  //       _requestMock,
  //       project_id,
  //       responseMock,
  //     );

  //     expect(result).toBeDefined();
  //     expect(result.statusCode).toStrictEqual(399);
  //     expect(responseMock.status).toHaveBeenCalledWith(399);
  //   });
  // });
  describe('overall project status controller', () => {
    it('overall project status controller', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let project_id = 2;
      (resourceRepo.find as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.allocated_user == currentUserObj &&
          options.where.status == STATUS.ACTIVE &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.project_id_resource_alloc == project_2
        ) {
          return resourceInProjectStatus;
        }
      });
      (categoryRepo.find as jest.Mock).mockResolvedValueOnce(categoryList);
      (taskRepository.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method == 'task') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockReturnValue(2),
              getMany: jest.fn().mockResolvedValue(taskListProjectStatus),
            };
          }
        },
      );
      const result = await controller.overallProjectStatus(
        _requestMock,
        project_id,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result['project_id']).toStrictEqual(2);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('overall project status when category total is 0', () => {
    it('overall project status when category total is 0', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let project_id = 2;
      (resourceRepo.find as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.allocated_user == currentUserObj &&
          options.where.status == STATUS.ACTIVE &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.project_id_resource_alloc == project_2
        ) {
          return resourceInProjectStatus;
        }
      });
      (categoryRepo.find as jest.Mock).mockResolvedValueOnce(categoryList);
      (taskRepository.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method == 'task') {
            return {
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockReturnValue(0),
              getMany: jest.fn().mockResolvedValue([]),
            };
          }
        },
      );
      const result = await controller.overallProjectStatus(
        _requestMock,
        project_id,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result['project_id']).toStrictEqual(2);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('overall project status exception case', () => {
    it('overall project status exception case', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let project_id = 2;
      (resourceRepo.find as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.allocated_user == currentUserObj &&
          options.where.status == STATUS.ACTIVE &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.project_id_resource_alloc == project_2
        ) {
          return resourceInProjectStatus;
        }
      });
      (categoryRepo.find as jest.Mock).mockResolvedValueOnce(categoryList);
      // (taskRepository.createQueryBuilder as jest.Mock).mockImplementation(
      //   (method) => {
      //     if (method == 'task') {
      //       return {
      //         where: jest.fn().mockReturnThis(),
      //         andWhere: jest.fn().mockReturnThis(),
      //         getCount: jest.fn().mockReturnValue(0),
      //         getMany: jest.fn().mockResolvedValue([]),
      //       };
      //     }
      //   },
      // );
      const result = await controller.overallProjectStatus(
        _requestMock,
        project_id,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(400);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('delete project when project not found', () => {
    it('delete project when project not found', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let project_id = 1000;
      const result = await controller.deleteProject(
        project_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(50);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('delete project when unauthorized', () => {
    it('delete project when unauthorized', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let project_id = 2;
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.allocated_user == currentUserObj &&
          options.where.status == STATUS.ACTIVE &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.project_id_resource_alloc == project_2
        ) {
          return null;
        }
      });
      const result = await controller.deleteProject(
        project_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(399);
      expect(responseMock.status).toHaveBeenCalledWith(399);
    });
  });

  describe('delete project when unauthorized 2', () => {
    it('delete project when unauthorized 2', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let project_id = 2;
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.allocated_user == currentUserObj &&
          options.where.status == STATUS.ACTIVE &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.project_id_resource_alloc == project_2
        ) {
          return deleteProjectResource2;
        }
      });
      const result = await controller.deleteProject(
        project_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(399);
      expect(responseMock.status).toHaveBeenCalledWith(399);
    });
  });

  describe('delete project when unauthorized 3', () => {
    it('delete project when unauthorized 3', async () => {
      let _requestMock: Request = {
        currentUser: dummyDeveloper,
      } as unknown as Request;
      let project_id = 2;
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.allocated_user == dummyDeveloper &&
          options.where.status == STATUS.ACTIVE &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.project_id_resource_alloc == project_2
        ) {
          return deleteProjectResource3;
        }
      });
      const result = await controller.deleteProject(
        project_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(399);
      expect(responseMock.status).toHaveBeenCalledWith(399);
    });
  });

  describe('delete project controller', () => {
    it('delete project controller', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let project_id = 2;
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.allocated_user == currentUserObj &&
          options.where.status == STATUS.ACTIVE &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.project_id_resource_alloc == project_2
        ) {
          return deleteProjectResource;
        }
      });
      (resourceRepo.find as jest.Mock).mockResolvedValueOnce(
        resourceListDeleteTask,
      );
      (userRepository.findOne as jest.Mock).mockImplementation(
        (options: any) => {
          if (options.where.user_id == 1) {
            return currentUserObj;
          }
          if (options.where.user_id == 2) {
            return dummyDeveloper;
          }
        },
      );

      const result = await controller.deleteProject(
        project_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(200);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  // describe('delete project controller status inactive case', () => {
  //   it('delete project controller status inactive case', async () => {
  //     let _requestMock: Request = {
  //       currentUser: currentUserObj,
  //     } as unknown as Request;
  //     let project_id = 4;
  //     (projectRepo.findOne as jest.Mock).mockResolvedValueOnce(deleteProject2 );
  //     (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
  //       if (
  //         options.where.allocated_user == currentUserObj &&
  //         options.where.status == STATUS.ACTIVE &&
  //         options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
  //         options.where.project_id_resource_alloc == deleteProject2
  //       ) {
  //         return deleteProjectResource1;
  //       }
  //     });
  //     (resourceRepo.find as jest.Mock).mockResolvedValueOnce(
  //       resourceListDeleteTask,
  //     );
  //     (userRepository.findOne as jest.Mock).mockImplementation(
  //       (options: any) => {
  //         if (options.where.user_id == 1) {
  //           return currentUserObj;
  //         }
  //         if (options.where.user_id == 2) {
  //           return dummyDeveloper;
  //         }
  //       },
  //     );

  //     (projectRepo.save as jest.Mock).mockResolvedValueOnce(deleteProject2 );

  //     const result = await controller.deleteProject(
  //       project_id,
  //       _requestMock,
  //       responseMock,
  //     );
  //     console.log(result,"9876543456");

  //     expect(result).toBeDefined();
  //     expect(result.statusCode).toStrictEqual(1500);
  //     expect(responseMock.status).toHaveBeenCalledWith(400);
  //   });
  // });

  describe('delete project controller exception case', () => {
    it('delete project controller exception case', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let project_id = 4;
      (projectRepo.findOne as jest.Mock).mockResolvedValueOnce(deleteProject2);

      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.allocated_user == currentUserObj &&
          options.where.status == STATUS.ACTIVE &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.project_id_resource_alloc == deleteProject2
        ) {
          return deleteProjectResource1;
        }
      });
      (resourceRepo.find as jest.Mock).mockResolvedValueOnce(
        resourceListDeleteTask,
      );

      const result = await controller.deleteProject(
        project_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(400);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('get project role when project is not found', () => {
    it('get project role when project is not found', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let project_id = 2;
      (projectRepo.find as jest.Mock).mockResolvedValueOnce([]);

      const result = await controller.getUserProjectRole(
        project_id,
        _requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(50);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('get project role when user is not allocated', () => {
    it('get project role when user is not allocated', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let project_id = 2;
      (projectRepo.find as jest.Mock).mockResolvedValueOnce(
        projectInProjectRole,
      );
      (resourceRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method == 'allocation') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(null),
            };
          }
        },
      );

      const result = await controller.getUserProjectRole(
        project_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result['errorCode']).toStrictEqual(240);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('get project role', () => {
    it('get project role', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let project_id = 2;
      (projectRepo.find as jest.Mock).mockResolvedValueOnce(
        projectInProjectRole,
      );
      (resourceRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method == 'allocation') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getOne: jest
                .fn()
                .mockResolvedValue(getProjectRoleAllocationDetail),
            };
          }
        },
      );

      const result = await controller.getUserProjectRole(
        project_id,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result['project_role']).toStrictEqual(3);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('edit allocation when project not found', () => {
    it('edit allocation when project not found  ', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let project_id = 1000;
      let editAllocationDto: EditAllocateUserDto = {
        user_id: 22,
        role: 5,
        end_date: '2023-02-15',
      };

      const result = await controller.editAllocate(
        project_id,
        editAllocationDto,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(50);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('edit allocation when user is unauthorized', () => {
    it('edit allocation when user is unauthorized', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let project_id = 2;
      let editAllocationDto: EditAllocateUserDto = {
        user_id: 22,
        role: 5,
        end_date: '2023-02-15',
      };

      (userRepository.findOne as jest.Mock).mockImplementation(
        (options: any) => {
          if (
            options.where.user_id == editAllocationDto.user_id &&
            options.where.status == STATUS.ACTIVE
          ) {
            return dummyDeveloper;
          }
        },
      );
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc == project_2 &&
          options.where.allocated_user == dummyDeveloper &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.status == STATUS.ACTIVE
        ) {
          return projectUserExistEditAllocation;
        } else {
          return null;
        }
      });

      const result = await controller.editAllocate(
        project_id,
        editAllocationDto,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(399);
      expect(responseMock.status).toHaveBeenCalledWith(399);
    });
  });

  describe('edit allocation when user not found', () => {
    it('edit allocation when user not found', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let project_id = 2;
      let editAllocationDto: EditAllocateUserDto = {
        user_id: 22,
        role: 5,
        end_date: '2023-02-15',
      };

      (userRepository.findOne as jest.Mock).mockImplementation(
        (options: any) => {
          if (
            options.where.user_id == editAllocationDto.user_id &&
            options.where.status == STATUS.ACTIVE
          ) {
            return null;
          }
        },
      );
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc == project_2 &&
          options.where.allocated_user == dummyDeveloper &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.status == STATUS.ACTIVE
        ) {
          return projectUserExistEditAllocation;
        } else {
          return userEditingAllocation;
        }
      });

      const result = await controller.editAllocate(
        project_id,
        editAllocationDto,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(31);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('edit allocation when project user not found', () => {
    it('edit allocation when project user not found', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let project_id = 2;
      let editAllocationDto: EditAllocateUserDto = {
        user_id: 22,
        role: 5,
        end_date: '2023-02-15',
      };

      (userRepository.findOne as jest.Mock).mockImplementation(
        (options: any) => {
          if (
            options.where.user_id == editAllocationDto.user_id &&
            options.where.status == STATUS.ACTIVE
          ) {
            return dummyDeveloper;
          }
        },
      );
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc == project_2 &&
          options.where.allocated_user == dummyDeveloper &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.status == STATUS.ACTIVE
        ) {
          return null;
        } else {
          return userEditingAllocation;
        }
      });

      const result = await controller.editAllocate(
        project_id,
        editAllocationDto,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(31);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('edit allocation when no change in data', () => {
    it('edit allocation when no change in data', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let project_id = 2;
      let editAllocationDto: EditAllocateUserDto = {
        user_id: 22,
        role: 4,
        end_date: '2023-08-15',
      };

      (userRepository.findOne as jest.Mock).mockImplementation(
        (options: any) => {
          if (
            options.where.user_id == editAllocationDto.user_id &&
            options.where.status == STATUS.ACTIVE
          ) {
            return dummyDeveloper;
          }
        },
      );
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc == project_2 &&
          options.where.allocated_user == dummyDeveloper &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.status == STATUS.ACTIVE
        ) {
          return projectUserExistEditAllocation;
        } else {
          return userEditingAllocation;
        }
      });

      const result = await controller.editAllocate(
        project_id,
        editAllocationDto,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(1110);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('edit allocation when role in form not found', () => {
    it('edit allocation when role in form not found', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let project_id = 2;
      let editAllocationDto: EditAllocateUserDto = {
        user_id: 22,
        role: 1000,
        end_date: '2023-02-15',
      };

      (userRepository.findOne as jest.Mock).mockImplementation(
        (options: any) => {
          if (
            options.where.user_id == editAllocationDto.user_id &&
            options.where.status == STATUS.ACTIVE
          ) {
            return dummyDeveloper;
          }
        },
      );
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc == project_2 &&
          options.where.allocated_user == dummyDeveloper &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.status == STATUS.ACTIVE
        ) {
          return projectUserExistEditAllocation;
        } else {
          return userEditingAllocation;
        }
      });

      const result = await controller.editAllocate(
        project_id,
        editAllocationDto,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(90);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('edit allocation when manager edit allocation to admin', () => {
    it('edit allocation when manager edit allocation to admin', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let project_id = 2;
      let editAllocationDto: EditAllocateUserDto = {
        user_id: 22,
        role: 3,
        end_date: '2023-02-15',
      };

      (userRepository.findOne as jest.Mock).mockImplementation(
        (options: any) => {
          if (
            options.where.user_id == editAllocationDto.user_id &&
            options.where.status == STATUS.ACTIVE
          ) {
            return dummyDeveloper;
          }
        },
      );
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc == project_2 &&
          options.where.allocated_user == dummyDeveloper &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.status == STATUS.ACTIVE
        ) {
          return projectUserExistEditAllocation;
        } else {
          return userEditingAllocation2;
        }
      });

      const result = await controller.editAllocate(
        project_id,
        editAllocationDto,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(90);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('edit allocation when manager edit allocation to admin 2', () => {
    it('edit allocation when manager edit allocation to admin 2', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let project_id = 2;
      let editAllocationDto: EditAllocateUserDto = {
        user_id: 22,
        role: 4,
        end_date: '2023-02-15',
      };

      (userRepository.findOne as jest.Mock).mockImplementation(
        (options: any) => {
          if (
            options.where.user_id == editAllocationDto.user_id &&
            options.where.status == STATUS.ACTIVE
          ) {
            return dummyDeveloper;
          }
        },
      );
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc == project_2 &&
          options.where.allocated_user == dummyDeveloper &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.status == STATUS.ACTIVE
        ) {
          return projectUserExistEditAllocation;
        } else {
          return userEditingAllocation2;
        }
      });

      const result = await controller.editAllocate(
        project_id,
        editAllocationDto,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(200);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('edit allocation when manager edit allocation with invalid date', () => {
    it('edit allocation when manager edit allocation with invalid date', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let project_id = 2;
      let editAllocationDto: EditAllocateUserDto = {
        user_id: 22,
        role: 4,
        end_date: '2023-02-30',
      };

      (userRepository.findOne as jest.Mock).mockImplementation(
        (options: any) => {
          if (
            options.where.user_id == editAllocationDto.user_id &&
            options.where.status == STATUS.ACTIVE
          ) {
            return dummyDeveloper;
          }
        },
      );
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc == project_2 &&
          options.where.allocated_user == dummyDeveloper &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.status == STATUS.ACTIVE
        ) {
          return projectUserExistEditAllocation;
        } else {
          return userEditingAllocation2;
        }
      });

      const result = await controller.editAllocate(
        project_id,
        editAllocationDto,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(3002);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('edit allocation when manager edit allocation with endDate < projectDate', () => {
    it('edit allocation when manager edit allocation with endDate < projectDate', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let project_id = 2;
      let editAllocationDto: EditAllocateUserDto = {
        user_id: 22,
        role: 4,
        end_date: '2023-02-01',
      };

      (userRepository.findOne as jest.Mock).mockImplementation(
        (options: any) => {
          if (
            options.where.user_id == editAllocationDto.user_id &&
            options.where.status == STATUS.ACTIVE
          ) {
            return dummyDeveloper;
          }
        },
      );
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc == project_2 &&
          options.where.allocated_user == dummyDeveloper &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.status == STATUS.ACTIVE
        ) {
          return projectUserExistEditAllocation;
        } else {
          return userEditingAllocation2;
        }
      });

      const result = await controller.editAllocate(
        project_id,
        editAllocationDto,
        _requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(3574);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('edit allocation when manager edit allocation with endDate > projectendDate', () => {
    it('edit allocation when manager edit allocation with endDate > projectendDate', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let project_id = 2;
      let editAllocationDto: EditAllocateUserDto = {
        user_id: 22,
        role: 4,
        end_date: '2024-02-01',
      };

      (userRepository.findOne as jest.Mock).mockImplementation(
        (options: any) => {
          if (
            options.where.user_id == editAllocationDto.user_id &&
            options.where.status == STATUS.ACTIVE
          ) {
            return dummyDeveloper;
          }
        },
      );
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc == project_2 &&
          options.where.allocated_user == dummyDeveloper &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.status == STATUS.ACTIVE
        ) {
          return projectUserExistEditAllocation;
        } else {
          return userEditingAllocation2;
        }
      });

      const result = await controller.editAllocate(
        project_id,
        editAllocationDto,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(3520);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('edit allocation', () => {
    it('edit allocation', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let project_id = 2;
      let editAllocationDto: EditAllocateUserDto = {
        user_id: 22,
        role: 5,
        end_date: '2023-02-15',
      };
      (userRepository.findOne as jest.Mock).mockImplementation(
        (options: any) => {
          if (
            options.where.user_id == editAllocationDto.user_id &&
            options.where.status == STATUS.ACTIVE
          ) {
            return dummyDeveloper;
          }
        },
      );
      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        if (
          options.where.project_id_resource_alloc == project_2 &&
          options.where.allocated_user == dummyDeveloper &&
          options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED &&
          options.where.status == STATUS.ACTIVE
        ) {
          return projectUserExistEditAllocation;
        } else {
          return userEditingAllocation;
        }
      });

      const result = await controller.editAllocate(
        project_id,
        editAllocationDto,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(200);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('update project controller when project name is invalid', () => {
    it('return return 400 when project name is invalid', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let project_id = 2;
      let updateProjectData: UpdateProjectDto = {
        project_name: 'aaa  bbbb   ',
        start_date: new Date().toISOString().slice(0, 10),
        end_date: new Date().toISOString().slice(0, 10),
        project_description: 'asdf skms msmskm mdkmkm',
      };

      const result = await controller.updateProject(
        project_id,
        updateProjectData,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(1601);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('update project controller when project not found', () => {
    it('return return 400 when project not found', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let project_id = 2000;
      let updateProjectData: UpdateProjectDto = {
        project_name: 'aaaaaaaaa',
        start_date: new Date().toISOString().slice(0, 10),
        end_date: new Date().toISOString().slice(0, 10),
        project_description: 'asdf skms msmskm mdkmkm',
      };

      const result = await controller.updateProject(
        project_id,
        updateProjectData,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(50);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('when update project without change date', () => {
    it('return return 200 when project', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let project_id = 2;
      let updateProjectData: UpdateProjectDto = {
        project_name: 'aaaaaaaaa',
        start_date: new Date().toISOString().slice(0, 10),
        end_date: new Date().toISOString().slice(0, 10),
        project_description: 'asdf skms msmskm mdkmkm',
      };
      (projectRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        return project_5;
      });

      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        return resourceAllocationPinProject;
      });
      const result = await service.updateProjectService(
        project_id,
        updateProjectData,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        successMessage: 'Project Updated',
        statusCode: 200,
      });
      expect(result.statusCode).toStrictEqual(200);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('when edit project where their is no change', () => {
    it('return return 400 when edit project', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let project_id = 2;
      let updateProjectData: UpdateProjectDto = {
        project_name: project_5.project_name,
        start_date: project_5.start_date,
        end_date: project_5.end_date,
        project_description: project_5.project_description,
      };
      (projectRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        return project_5;
      });

      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        return resourceAllocationPinProject;
      });
      const result = await service.updateProjectService(
        project_id,
        updateProjectData,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'no changes made',
        statusCode: 1050,
      });
      expect(result.statusCode).toStrictEqual(1050);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('when edit project where start date is invalid', () => {
    it('return return 400 when edit project', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let project_id = 2;
      let updateProjectData: UpdateProjectDto = {
        project_name: project_5.project_name,
        start_date: '2024-04-31',
        end_date: project_5.end_date,
        project_description: project_5.project_description,
      };
      (projectRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        return project_5;
      });

      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        return resourceAllocationPinProject;
      });
      const result = await service.updateProjectService(
        project_id,
        updateProjectData,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Invalid start date',
        statusCode: 3001,
      });
      expect(result.statusCode).toStrictEqual(3001);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('when edit project which end date is invalid', () => {
    it('return return 400 when edit project', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let project_id = 2;
      let updateProjectData: UpdateProjectDto = {
        project_name: project_5.project_name,
        start_date: '2024-04-19',
        end_date: '2024-04-31',
        project_description: project_5.project_description,
      };
      (projectRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        return project_5;
      });

      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        return resourceAllocationPinProject;
      });
      const result = await service.updateProjectService(
        project_id,
        updateProjectData,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Invalid end date',
        statusCode: 3002,
      });
      expect(result.statusCode).toStrictEqual(3002);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('when edit project by unallocated user', () => {
    it('return return 400 when edit project', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let project_id = 2;
      let updateProjectData: UpdateProjectDto = {
        project_name: project_5.project_name,
        start_date: '2024-04-19',
        end_date: '2024-04-30',
        project_description: project_5.project_description,
      };
      (projectRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        return project_5;
      });

      (resourceRepo.findOne as jest.Mock).mockReturnValue(null);
      const result = await service.updateProjectService(
        project_id,
        updateProjectData,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Unauthorized access',
        statusCode: 399,
      });
      expect(result.statusCode).toStrictEqual(399);
      expect(responseMock.status).toHaveBeenCalledWith(399);
    });
  });
  describe('when edit project by unauthorised role', () => {
    it('return return 400 when edit project', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let project_id = 2;
      let updateProjectData: UpdateProjectDto = {
        project_name: project_5.project_name,
        start_date: '2024-04-19',
        end_date: '2024-04-30',
        project_description: project_5.project_description,
      };
      (projectRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        return project_5;
      });

      (resourceRepo.findOne as jest.Mock).mockReturnValue(
        userEditingAllocation2,
      );
      const result = await service.updateProjectService(
        project_id,
        updateProjectData,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Unauthorized access',
        statusCode: 399,
      });
      expect(result.statusCode).toStrictEqual(399);
      expect(responseMock.status).toHaveBeenCalledWith(399);
    });
  });

  describe('when project end is greater than project start date', () => {
    it('return return 400 when project', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let project_id = 2;
      let updateProjectData: UpdateProjectDto = {
        project_name: 'aaaaaaaaa',
        start_date: '2024-10-30',
        end_date: '2024-04-30',
        project_description: 'asdf skms msmskm mdkmkm',
      };
      (projectRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        return project_6;
      });

      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        return resourceAllocationPinProject;
      });
      const result = await service.updateProjectService(
        project_id,
        updateProjectData,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'end date must be greater than start date',
        statusCode: 75,
      });
      expect(result.statusCode).toStrictEqual(75);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('when project start validation in project', () => {
    it('return return 200 when project', async () => {
      let currenDate = new Date();
      currenDate.setDate(currenDate.getDate() + 1);
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let project_id = 2;
      let updateProjectData: UpdateProjectDto = {
        project_name: 'aaaaaaaaa',
        start_date: new Date().toISOString().slice(0, 10),
        end_date: currenDate.toISOString().slice(0, 10),
        project_description: 'asdf skms msmskm mdkmkm',
      };
      (projectRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        return project_5;
      });

      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        return resourceAllocationPinProject;
      });
      const result = await service.updateProjectService(
        project_id,
        updateProjectData,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        successMessage: 'Project Updated',
        statusCode: 200,
      });
      expect(result.statusCode).toStrictEqual(200);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('when end date validate in the project', () => {
    it('return return 200 when project', async () => {
      let currenDate = new Date();
      currenDate.setDate(currenDate.getDate() - 1);
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let project_id = 2;
      let updateProjectData: UpdateProjectDto = {
        project_name: 'aaaaaaaaa',
        start_date: new Date().toISOString().slice(0, 10),
        end_date: currenDate.toISOString().slice(0, 10),
        project_description: 'asdf skms msmskm mdkmkm',
      };
      (projectRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        return project_5;
      });

      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        return resourceAllocationPinProject;
      });
      const result = await service.updateProjectService(
        project_id,
        updateProjectData,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'end date must be greater than start date',
        statusCode: 2091,
      });
      expect(result.statusCode).toStrictEqual(2091);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('when edit project date where start validateion', () => {
    it('return return 200 when project', async () => {
      let currenDate = new Date();
      currenDate.setDate(currenDate.getDate() - 1);
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let project_id = 2;
      let updateProjectData: UpdateProjectDto = {
        project_name: 'aaaaaaaaa',
        start_date: currenDate.toISOString().slice(0, 10),
        end_date: new Date().toISOString().slice(0, 10),
        project_description: 'asdf skms msmskm mdkmkm',
      };
      (projectRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        return project_5;
      });

      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        return resourceAllocationPinProject;
      });
      const result = await service.updateProjectService(
        project_id,
        updateProjectData,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage:
          'start date must be greater than or equal to current date',
        statusCode: 1012,
      });
      expect(result.statusCode).toStrictEqual(1012);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('date validation in the edit project where end date is less than end date', () => {
    it('return return 400 when project', async () => {
      let currenDate = new Date();
      currenDate.setDate(currenDate.getDate() - 1);
      let _requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      let project_id = 2;
      let updateProjectData: UpdateProjectDto = {
        project_name: 'aaaaaaaaa',
        start_date: new Date().toISOString().slice(0, 10),
        end_date: currenDate.toISOString().slice(0, 10),
        project_description: 'asdf skms msmskm mdkmkm',
      };
      (projectRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        return project_5;
      });

      (resourceRepo.findOne as jest.Mock).mockImplementation((options: any) => {
        return resourceAllocationPinProject;
      });
      const result = await service.updateProjectService(
        project_id,
        updateProjectData,
        _requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'end date must be greater than start date',
        statusCode: 2091,
      });
      expect(result.statusCode).toStrictEqual(2091);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('Add project details', () => {
    it('should create an instance of ProjectAddDetails with the provided properties', () => {
      const addProjectDetails = new ProjectAddDetails();
      addProjectDetails.project_name = 'John Doe';
      addProjectDetails.project_code = 'John-101';
      addProjectDetails.start_date = '2023-04-02';
      addProjectDetails.end_date = '2023-06-02';
      addProjectDetails.project_description = 'Description';

      expect(addProjectDetails).toBeInstanceOf(ProjectAddDetails);
      expect(addProjectDetails.project_name).toBe('John Doe');
    });
  });

  describe('update project details', () => {
    it('should create an instance of ProjectUpdateDetails with the provided properties', () => {
      const updateProjectDetails = new ProjectUpdateDetails();
      updateProjectDetails.project_name = 'John Doe';
      updateProjectDetails.start_date = '2023-04-02';
      updateProjectDetails.end_date = '2023-06-02';
      updateProjectDetails.project_description = 'Description';

      expect(updateProjectDetails).toBeInstanceOf(ProjectUpdateDetails);
      expect(updateProjectDetails.project_name).toBe('John Doe');
    });
  });
});
