import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Roles } from '../../Entity/Roles';
import { User } from '../../Entity/User';
import { Repository } from 'typeorm';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import * as jwt from 'jsonwebtoken';
import { MailerService } from '@nestjs-modules/mailer';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Status } from '../../Entity/Status';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Request, Response } from 'express';
import { LoginService } from '../../login/login.service';
import { ProjectResourceAllocation } from '../../Entity/Project_resource_allocation';
import { TaskHistory } from '../../Entity/Task_History';
import { Project } from '../../Entity/Project';
import { Role } from '../../Enum/Role.enum';
import {
  ALLOCATION_STATUS,
  NEW_USER_STATUS,
  ROLE_AUTHORITY,
  STATUS,
} from '../../Enum/Enums.enum';
import { ChangePasswordDto, UserEditCreateDto, UserProfile } from '../user.dto';
import { currentUserObj } from '../../notification/__tests__/data';
import {
  allocatedProjects,
  currentUserObj2,
  currentUserObj3,
  profile,
  userActivity,
} from '../user.data';
import { allocatedDataEditUser, userDetails, userDetailsUser } from './data';
import { ChangePasswordDetails, UserCreateDetails } from '../user.type';
import { error } from 'console';
describe('UserController', () => {
  let controller: UsersController;
  let repository: Repository<User>;
  let service: UsersService;
  let rolerepository: Repository<Roles>;
  let projectRepo: Repository<Project>;
  let loginservice: LoginService;
  let taskHistoryRepo: Repository<TaskHistory>;
  let projectResourceAllocationRepository: Repository<ProjectResourceAllocation>;
  let token: any;
  const userList = [
    {
      user_id: 1,
      email: 'test@example.com',
      password: '$2b$10$5iC4f./ytO3zDfVqsYeHGuHJVWwtZp/Qo7zZksXfFXiyklAd5Ajxu',
      status: Status.ACTIVE,
      user_name: 'Hemandh',
      role: 1,
      last_login: 1,
      change_password_status: 1,
    },
  ];
  const roleList = [
    {
      role_id: 1,
      role_name: 'Admin',
      status: 1,
      created_date: '2023-01-02T18:30:00.000Z',
      updated_date: '2023-01-02T18:30:00.000Z',
      authority: 1,
    },
    {
      role_id: 2,
      role_name: 'User',
      status: 1,
      created_date: '2023-01-02T18:30:00.000Z',
      updated_date: '2023-01-02T18:30:00.000Z',
      authority: 1,
    },
    {
      role_id: 3,
      role_name: 'Project_Admin',
      status: 1,
      created_date: '2023-01-02T18:30:00.000Z',
      updated_date: '2023-01-02T18:30:00.000Z',
      authority: 2,
    },
    {
      role_id: 4,
      role_name: 'Project_Manager',
      status: 1,
      created_date: '2023-01-02T18:30:00.000Z',
      updated_date: '2023-01-02T18:30:00.000Z',
      authority: 2,
    },
    {
      role_id: 5,
      role_name: 'Developer',
      status: 1,
      created_date: '2023-01-02T18:30:00.000Z',
      updated_date: '2023-01-02T18:30:00.000Z',
      authority: 2,
    },
    {
      role_id: 6,
      role_name: 'Reporter',
      status: 1,
      created_date: '2023-01-02T18:30:00.000Z',
      updated_date: '2023-01-02T18:30:00.000Z',
      authority: 2,
    },
    {
      role_id: 7,
      role_name: 'Guest',
      status: 1,
      created_date: '2023-01-02T18:30:00.000Z',
      updated_date: '2023-01-02T18:30:00.000Z',
      authority: 2,
    },
  ];
  const dummyDelete = {
    user_id: 400,
    user_name: 'delete me',
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
  const allocated = {
    user_id: 2,
    email: 'test@example.com',
    password: '$2b$10$5iC4f./ytO3zDfVqsYeHGuHJVWwtZp/Qo7zZksXfFXiyklAd5Ajxu',
    status: 1,
    user_name: 'Hemandh',
    role: 1,
    last_login: 1,
    change_password_status: 0,
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
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
          provide: getRepositoryToken(Roles),
          useValue: {
            findOne: jest.fn().mockImplementation((options: any) => {
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
            find: jest.fn().mockImplementation((options: any) => {
              return roleList;
            }),
          },
        },
        {
          provide: getRepositoryToken(ProjectResourceAllocation),
          useValue: {
            save: jest.fn().mockImplementation((options: any) => {
              return true;
            }),
            createQueryBuilder: jest.fn().mockImplementation((options: any) => {
              return true;
            }),
            update: jest.fn().mockImplementation((options: any) => {
              return true;
            }),
            create: jest.fn().mockImplementation((options: any) => {
              return [
                {
                  from_date: new Date(project.start_date),
                  to_date: new Date(project.end_date),
                  allocation_status: ALLOCATION_STATUS.ALLOCATED,
                  status: STATUS.ACTIVE,
                  created_date: new Date(),
                  updated_date: new Date(),
                  project_id_resource_alloc: project,
                  allocated_user: user,
                  role: {
                    role_id: 3,
                    role_name: 'Project_Admin',
                    created_date: new Date(),
                    updated_date: new Date(),
                  },
                  allocation_assigned_by: null,
                  pin_order: 0,
                  pin_status: 0,
                },
              ];
            }),
            find: jest.fn().mockImplementation((options: any) => {
              if (
                options.where.status == STATUS.ACTIVE &&
                options.where.allocated_user.user_id === 1 &&
                options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED
              ) {
                return [
                  {
                    project_resource_allocation_id: 2,
                    allocation_status: 1,
                    status: 1,
                    from_date: '2023-02-15',
                    to_date: '2023-03-15',
                    pin_status: 1,
                    pin_order: 2,
                    created_date: new Date('2023-02-15T04:58:05.000Z'),
                    updated_date: new Date('2023-02-15T04:58:05.000Z'),
                    project_id_resource_alloc: {
                      project_id: 2,
                      project_name: 'Project 1',
                      project_code: 'Proj_101',
                      project_description: 'dummy project is live 1',
                      status: 1,
                      project_status: null,
                      end_date: '2023-08-15',
                      start_date: '2023-02-15',
                      created_date: new Date('2023-02-15T04:58:05.000Z'),
                      updated_date: new Date('2023-02-15T04:58:05.000Z'),
                      total_resource: 5,
                      total_task: 3,
                    },
                    allocated_user: {
                      user_id: 1,
                      email: 'test@example.com',
                      password:
                        '$2b$10$5iC4f./ytO3zDfVqsYeHGuHJVWwtZp/Qo7zZksXfFXiyklAd5Ajxu',
                      status: 1,
                      user_name: 'Hemandh',
                      role: 1,
                      last_login: 1,
                      change_password_status: 0,
                    },
                    allocation_assigned_by: null,
                    role: {
                      role_id: 3,
                      role_name: 'Project_Admin',
                      status: 1,
                      created_date: new Date('2023-01-02T18:30:00.000Z'),
                      updated_date: new Date('2023-01-02T18:30:00.000Z'),
                      authority: 2,
                    },
                  },
                ];
              } else if (
                options.where.allocated_user.user_id === allocated.user_id &&
                options.where.allocation_status === STATUS.ACTIVE
              ) {
                return [
                  {
                    project_resource_allocation_id: 3,
                    allocation_status: 1,
                    status: 1,
                    from_date: '2023-02-15',
                    to_date: '2023-03-15',
                    pin_status: 1,
                    pin_order: 2,
                    created_date: new Date('2023-02-15T04:58:05.000Z'),
                    updated_date: new Date('2023-02-15T04:58:05.000Z'),
                    project_id_resource_alloc: {
                      project_id: 2,
                      project_name: 'Project 1',
                      project_code: 'Proj_101',
                      project_description: 'dummy project is live 1',
                      status: 1,
                      project_status: null,
                      end_date: '2023-08-15',
                      start_date: '2023-02-15',
                      created_date: new Date('2023-02-15T04:58:05.000Z'),
                      updated_date: new Date('2023-02-15T04:58:05.000Z'),
                      total_resource: 5,
                      total_task: 3,
                    },
                    allocation_assigned_by: null,
                    role: {
                      role_id: 3,
                      role_name: 'Project_Admin',
                      status: 1,
                      created_date: new Date('2023-01-02T18:30:00.000Z'),
                      updated_date: new Date('2023-01-02T18:30:00.000Z'),
                      authority: 2,
                    },
                    allocated_user: allocated,
                  },
                ];
              } else if (
                options.where.allocated_user.user_id === 1 &&
                options.where.allocation_status === STATUS.ACTIVE
              ) {
                return [];
              } else if (
                options.where.allocated_user.user_id === 3 &&
                options.where.allocation_status === STATUS.ACTIVE
              ) {
                return [];
              } else if (
                !options.where.status &&
                options.where.allocated_user &&
                options.where.allocation_status == ALLOCATION_STATUS.ALLOCATED
              ) {
                return [
                  {
                    project_resource_allocation_id: 3,
                    allocation_status: 1,
                    status: 1,
                    from_date: '2023-02-15',
                    to_date: '2023-03-15',
                    pin_status: 1,
                    pin_order: 2,
                    created_date: new Date('2023-02-15T04:58:05.000Z'),
                    updated_date: new Date('2023-02-15T04:58:05.000Z'),
                    project_id_resource_alloc: {
                      project_id: 2,
                      project_name: 'Project 1',
                      project_code: 'Proj_101',
                      project_description: 'dummy project is live 1',
                      status: 1,
                      project_status: null,
                      end_date: '2023-08-15',
                      start_date: '2023-02-15',
                      created_date: new Date('2023-02-15T04:58:05.000Z'),
                      updated_date: new Date('2023-02-15T04:58:05.000Z'),
                      total_resource: 5,
                      total_task: 3,
                    },
                    allocation_assigned_by: null,
                    role: {
                      role_id: 3,
                      role_name: 'Project_Admin',
                      status: 1,
                      created_date: new Date('2023-01-02T18:30:00.000Z'),
                      updated_date: new Date('2023-01-02T18:30:00.000Z'),
                      authority: 2,
                    },
                  },
                ];
              }
            }),
          },
        },
        {
          provide: getRepositoryToken(TaskHistory),
          useValue: {
            createQueryBuilder: jest.fn().mockImplementation((options: any) => {
              return true;
            }),
            findOne: jest.fn().mockImplementation((options: any) => {
              return true;
            }),
          },
        },
        {
          provide: getRepositoryToken(Project),
          useValue: {
            find: jest.fn().mockImplementation((options: any) => {
              return [
                {
                  project_id: 1,
                  project_name: 'dummy1',
                  project_code: 'dummys2',
                  project_description: 'ewfefdefde',
                  status: 1,
                  project_status: Status.ACTIVE,
                  end_date: '2023-03-31',
                  start_date: '2023-03-23',
                  created_date: new Date(),
                  updated_date: new Date(),
                  total_resource: 8,
                  total_task: 2,
                },
                {
                  project_id: project.project_id,
                  project_name: project.project_name,
                  project_code: project.project_code,
                  project_description: project.project_description,
                  status: 1,
                  project_status: Status.ACTIVE,
                  end_date: project.end_date,
                  start_date: project.start_date,
                  created_date: new Date(),
                  updated_date: new Date(),
                  total_resource: 8,
                  total_task: 2,
                },
              ];
            }),
            update: jest.fn().mockImplementation((options: any) => {
              return true;
            }),
          },
        },

        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockImplementation((options: any) => {
              if (
                options.where.email === 'test@example.com' &&
                options.where.status === Status.ACTIVE
              ) {
                return {
                  user_id: 1,
                  email: 'test@example.com',
                  password:
                    '$2b$10$5iC4f./ytO3zDfVqsYeHGuHJVWwtZp/Qo7zZksXfFXiyklAd5Ajxu',
                  status: Status.ACTIVE,
                  user_name: 'Hemandh',
                  role: 1,
                  last_login: 1,
                  change_password_status: 1,
                };
              } else if (
                options.where.user_id === 1 &&
                options.where.status === STATUS.ACTIVE
              ) {
                return {
                  user_id: 1,
                  email: 'test@example.com',
                  password:
                    '$2b$10$5iC4f./ytO3zDfVqsYeHGuHJVWwtZp/Qo7zZksXfFXiyklAd5Ajxu',
                  status: Status.ACTIVE,
                  user_name: 'Hemandh',
                  role: {
                    role_id: 1,
                    role_name: 'Admin',
                    status: Status.ACTIVE,
                  },
                  last_login: 1,
                  change_password_status: 0,
                };
              } else if (
                options.where.user_id === 55 &&
                options.where.status === STATUS.ACTIVE
              ) {
                return {
                  user_id: 55,
                  email: 'test@example.com',
                  password:
                    '$2b$10$5iC4f./ytO3zDfVqsYeHGuHJVWwtZp/Qo7zZksXfFXiyklAd5Ajxu',
                  status: Status.ACTIVE,
                  user_name: 'Hemandh55',
                  role: 1,
                  last_login: 1,
                  change_password_status: 0,
                };
              } else if (
                options.where.user_id === 3 &&
                options.where.status === STATUS.ACTIVE
              ) {
                return {
                  user_id: 3,
                  email: 'test@example.com',
                  password:
                    '$2b$10$5iC4f./ytO3zDfVqsYeHGuHJVWwtZp/Qo7zZksXfFXiyklAd5Ajxu',
                  status: Status.ACTIVE,
                  user_name: 'Hemandh55',
                  role: 1,
                  last_login: 1,
                  change_password_status: 0,
                };
              } else if (
                options.where.user_id === allocated.user_id &&
                options.where.status === STATUS.ACTIVE
              ) {
                return allocated;
              } else if (options.where.email === 'test1@example.com') {
                return {
                  user_id: 3,
                  email: 'test1@example.com',
                  password:
                    '$2b$10$5iC4f./ytO3zDfVqsYeHGuHJVWwtZp/Qo7zZksXfFXiyklAd5Ajxu',
                  status: Status.ACTIVE,
                  user_name: 'Hemandh55',
                  role: 1,
                  last_login: 1,
                  change_password_status: 0,
                };
              } else {
                return null;
              }
            }),
            save: jest.fn().mockImplementation(() => {
              return {
                user_id: 2,
                user_name: user.user_name,
                email: user.email,
                role: {
                  role_id: user.role,
                  role_name: 'User',
                  created_date: new Date(),
                  updated_date: new Date(),
                },
                last_login: 1,
                status: 1,
                new_user: 0,
                change_password_staus: 1,
                updated_date: new Date(),
                created_date: new Date(),
                password:
                  '$2b$10$AZPkYAfqFr7IFdjKrehihOi6B1/gw1DwJc7dRaX1hCY/QxMa5rFMK',
              };
            }),
            find: jest.fn().mockImplementation(() => {
              return {
                user_id: 1,
                email: 'test@example.com',
                password:
                  '$2b$10$5iC4f./ytO3zDfVqsYeHGuHJVWwtZp/Qo7zZksXfFXiyklAd5Ajxu',
                status: Status.ACTIVE,
                user_name: 'Hemandh',
                role: 1,
                last_login: 1,
                change_password_status: 1,
              };
            }),
            create: jest.fn().mockImplementation((user: User) => {
              return {
                user_id: user.user_id || 2,
                user_name: user.user_name,
                email: user.email,
                role: user.role,
                last_login: 1,
                status: Status.ACTIVE,
                new_user: NEW_USER_STATUS.NEWBIE,
                change_password_staus: 1,
                updated_date: new Date(),
                created_date: new Date(),
                password: user.password || 'Admin@123',
              };
            }),
            update: jest.fn().mockImplementation((options: any) => {
              return true;
            }),
            createQueryBuilder: jest.fn().mockImplementation((options: any) => {
              return true;
            }),
          },
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: {
            debug: jest.fn(),
            info: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
    service = module.get<UsersService>(UsersService);
    taskHistoryRepo = module.get<Repository<TaskHistory>>(
      getRepositoryToken(TaskHistory),
    );
    projectRepo = module.get<Repository<Project>>(getRepositoryToken(Project));
    projectResourceAllocationRepository = module.get<
      Repository<ProjectResourceAllocation>
    >(getRepositoryToken(ProjectResourceAllocation));
  });
  let accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicHVycG9zZSI6IkFDQ0VTU19UT0tFTiIsImlhdCI6MTY4MDE2NjM0Mn0.3HG_ZNMoOQnbyw74VX_04jxjK7R16EAFsG7v_9l0yEY';
  const requestMock: Request<any, any, any, any, any> = {
    currentUser: {
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
    },
  } as unknown as Request;

  const responseMock: Response = {
    status: jest.fn((x) => statusResponseMock),
    send: jest.fn((x) => x),
  } as unknown as Response;
  const statusResponseMock = {
    send: jest.fn((x) => x),
  };
  requestMock.headers = {
    'x-access-token': 'my-token',
  };
  const user = { user_name: 'test', email: 'test1@example.com', role: 2 };
  const project = {
    project_id: 2,
    project_name: 'dummy',
    project_code: 'dummy1',
    project_description: 'ewfefdefde',
    status: 1,
    project_status: Status.ACTIVE,
    end_date: '2023-03-31',
    start_date: '2023-03-23',
    created_date: new Date(),
    updated_date: new Date(),
    total_resource: 8,
    total_task: 2,
  };
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should be defined', () => {
    expect(controller.addUser).toBeDefined();
  });
  it('should be defined', () => {
    expect(controller.getUserById).toBeDefined();
  });
  it('should be defined', () => {
    expect(controller.deleteUser).toBeDefined();
  });
  it('should be defined', () => {
    expect(service.deleteUserService).toBeDefined();
  });
  it('should be defined', () => {
    expect(controller.editUser).toBeDefined();
  });
  it('should be defined', () => {
    expect(service.editUserService).toBeDefined();
  });
  describe('add a user as a user', () => {
    it('enter valid details', async () => {
      let userDto = {
        user_name: user.user_name,
        email: 'test4@example.com',
        role: Role.USER,
      };
      const result = await service.addUserService(
        userDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        successMessage: 'User Added',
        statusCode: 200,
      });
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('add a user as a user', () => {
    it('enter valid details', async () => {
      let userDto = {
        user_name: user.user_name,
        email: 'test4@example.com',
        role: Role.USER,
      };
      const result = await controller.addUser(
        userDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        successMessage: 'User Added',
        statusCode: 200,
      });
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('already exist user', () => {
    it('enter valid details', async () => {
      let userDto = {
        user_name: user.user_name,
        email: 'test@example.com',
        role: Role.ADMIN,
      };
      const result = await service.addUserService(
        userDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'email already exists',
        statusCode: 33,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('add user as admin', () => {
    it('enter valid details', async () => {
      let userDto = {
        user_name: user.user_name,
        email: 'test4@example.com',
        role: Role.ADMIN,
      };
      let createdDta = {
        user_id: 2,
        user_name: userDto.user_name,
        email: userDto.email,
        role: {
          role_id: userDto.role,
          role_name: 'User',
          created_date: new Date(),
          updated_date: new Date(),
        },
        last_login: 1,
        status: 1,
        new_user: 0,
        change_password_staus: 1,
        updated_date: new Date(),
        created_date: new Date(),
        password:
          '$2b$10$AZPkYAfqFr7IFdjKrehihOi6B1/gw1DwJc7dRaX1hCY/QxMa5rFMK',
      };
      (repository.save as jest.Mock).mockResolvedValueOnce(createdDta);
      const result = await service.addUserService(
        userDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        successMessage: 'User Added',
        statusCode: 200,
      });
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('role is not found', () => {
    it('enter valid details', async () => {
      let userDto = {
        user_name: user.user_name,
        email: 'tes666t@example.com',
        role: 9,
      };
      const result = await service.addUserService(
        userDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'role not found',
        statusCode: 90,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('catch exception in add user', () => {
    it('return 400 with confirm delete when user not found', async () => {
      let userDto = {
        user_name: user.user_name,
        email: 'tes666t@example.com',
        role: 9,
      };
      (repository.findOne as jest.Mock).mockImplementation(() => {
        throw new Error('test error');
      });

      const result = await service.addUserService(
        userDto,
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

  describe('get profile', () => {
    it('should get 200 success status', async () => {
      const result = await controller.getProfile(requestMock, responseMock);

      expect(result).toBeDefined();
      expect(result).toEqual({
        user_id: 1,
        user_name: 'Hemandh',
        email: 'hemandh.hemandh@gmail.com',
        status: 1,
        first_name: 'ddsfgd@@',
        last_name: 'vtgtgggg@@@',
        phone_number: '33333332200',
        profile_photo:
          'https://dev-tm-images.innovaturelabs.com/GtGVdgUMIW_1680148392311.png',
        updated_date: '2023-01-02',
        middle_name: 'ghhyhyhyh@@',
      });
    });
  });

  describe('get profile', () => {
    it('should get 200 success status', async () => {
      const result = await service.getProfile(requestMock, responseMock);

      expect(result).toBeDefined();
      expect(result).toEqual({
        user_id: 1,
        user_name: 'Hemandh',
        email: 'hemandh.hemandh@gmail.com',
        status: 1,
        first_name: 'ddsfgd@@',
        last_name: 'vtgtgggg@@@',
        phone_number: '33333332200',
        profile_photo:
          'https://dev-tm-images.innovaturelabs.com/GtGVdgUMIW_1680148392311.png',
        updated_date: '2023-01-02',
        middle_name: 'ghhyhyhyh@@',
      });
    });
  });

  describe('change password', () => {
    it('should get 200 success status', async () => {
      const changePasswordBody: ChangePasswordDto = {
        old_password: 'Hmd@12345',
        new_password: 'Hmd@123456',
      };
      const result = await controller.changePassword(
        changePasswordBody,
        requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        successMessage: 'Password Changed',
        statusCode: 200,
      });
    });
  });
  describe('catch exception in change password', () => {
    it('return 400 with confirm delete when user not found', async () => {
      (repository.update as jest.Mock).mockImplementation(() => {
        throw new Error('test error');
      });
      const changePasswordBody: ChangePasswordDto = {
        old_password: 'Hmd@12345',
        new_password: 'Hmd@123456',
      };
      const result = await controller.changePassword(
        changePasswordBody,
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

  describe('change password', () => {
    it('should get 200 success status', async () => {
      const changePasswordBody: ChangePasswordDto = {
        old_password: 'Hmd@12345',
        new_password: 'Hmd@123456',
      };
      const result = await service.changePasswordService(
        changePasswordBody,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        successMessage: 'Password Changed',
        statusCode: 200,
      });
    });
  });

  describe('change password', () => {
    it('should get 400 status when both password are same', async () => {
      const changePasswordBody: ChangePasswordDto = {
        old_password: 'Hmd@12345',
        new_password: 'Hmd@12345',
      };
      const result = await service.changePasswordService(
        changePasswordBody,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'New and old password cannot be same',
        statusCode: 237,
      });
    });
  });

  describe('change password', () => {
    it('should get 400 status when old password is wrong', async () => {
      const changePasswordBody: ChangePasswordDto = {
        old_password: 'Hmda@12345',
        new_password: 'Hmd@12345',
      };
      const result = await service.changePasswordService(
        changePasswordBody,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Password doesnt match with old password',
        statusCode: 20,
      });
    });
  });

  describe('Get user by id', () => {
    it('enter valid details', async () => {
      let user_Id = 1;
      const result = await controller.getUserById(user_Id, responseMock);

      expect(result).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('catch exception in get user by id', () => {
    it('return 400 with confirm delete when user not found', async () => {
      (repository.findOne as jest.Mock).mockImplementation(() => {
        throw new Error('test error');
      });
      let user_Id = 1;
      const result = await controller.getUserById(user_Id, responseMock);

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Exception',
        statusCode: 400,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('Get user by id', () => {
    it('enter valid details', async () => {
      let user_Id = 1;
      const result = await service.getUserByService(user_Id, responseMock);

      expect(result).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('allocated project of a user', () => {
    it('should get 200 status', async () => {
      const user_id = 1;
      const result = await controller.getAllocatedProjects(
        user_id,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('catch exception in allocate user', () => {
    it('return 400 ', async () => {
      (repository.findOne as jest.Mock).mockImplementation(() => {
        throw new Error('test error');
      });
      const user_id = 1;
      const result = await controller.getAllocatedProjects(
        user_id,
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

  describe('allocated project of a user', () => {
    it('should get 200 status', async () => {
      const user_id = 1;
      const result = await service.getAllocatedProjects(user_id, responseMock);

      expect(result).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('allocated project of a user', () => {
    it('should get 400 status', async () => {
      const user_id = 44;
      const result = await service.getAllocatedProjects(user_id, responseMock);

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'User not found',
        statusCode: 31,
      });
    });
  });
  //failed

  describe('get by user_id when user not found', () => {
    it('enter valid details', async () => {
      let user_Id = 77;
      const result = await service.getUserByService(user_Id, responseMock);

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'User not found',
        statusCode: 31,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('get roles', () => {
    it('return 200 with role list', async () => {
      const result = await controller.getRoles(requestMock, responseMock);
      expect(result).toBeDefined();
      expect(result).toStrictEqual(roleList);
    });
  });

  describe('get roles', () => {
    it('return 200 with role list', async () => {
      const result = await service.getRoles(requestMock, responseMock);
      expect(result).toBeDefined();
      expect(result).toStrictEqual(roleList);
    });
  });

  describe('confirm delete', () => {
    const user_id = 1;
    it('return 400 with confirm delete when user try to delete himself', async () => {
      const result = await controller.forceDeleteUser(
        user_id,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'cannot delete yourself',
        statusCode: 1011,
      });
    });
  });

  describe('confirm delete', () => {
    const user_id = 1;
    it('return 400 with confirm delete when user try to delete himself', async () => {
      const result = await service.permanentDeleteUserService(
        user_id,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'cannot delete yourself',
        statusCode: 1011,
      });
    });
  });
  describe('catch exception in delete user', () => {
    it('return 400 ', async () => {
      const user_id = 1;
      (repository.findOne as jest.Mock).mockImplementation(() => {
        throw new Error('test error');
      });
      const result = await service.permanentDeleteUserService(
        user_id,
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
  describe('confirm delete', () => {
    const user_id = 22;
    it('return 400 with confirm delete when user not found', async () => {
      const result = await service.permanentDeleteUserService(
        user_id,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'User not found',
        statusCode: 31,
      });
    });
  });

  describe('catch exception', () => {
    const user_id = 22;
    it('return 400 with confirm delete when user not found', async () => {
      (repository.findOne as jest.Mock).mockImplementation(() => {
        throw new Error('test error');
      });
      const result = await service.permanentDeleteUserService(
        user_id,
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

  describe('confirm delete', () => {
    const user_id = 55;
    it('return 200 with delete the user', async () => {
      const result = await service.permanentDeleteUserService(
        user_id,
        requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        successMessage: 'User Hemandh55 removed',
        statusCode: 200,
      });
    });
  });

  describe('confirm delete when not allocated', () => {
    const user_id = 59;
    it('return 200 with delete the user when not allocated', async () => {
      (repository.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.user_id == 59 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return dummyDelete;
        }
      });
      (
        projectResourceAllocationRepository.find as jest.Mock
      ).mockImplementation((option: any) => {
        if (
          option.where.allocated_user == dummyDelete &&
          option.where.allocation_status === STATUS.ACTIVE
        ) {
          return [];
        }
      });
      const result = await service.permanentDeleteUserService(
        user_id,
        requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        successMessage: 'User delete me removed',
        statusCode: 200,
      });
    });
  });
  describe('when admin try delete user where already allocated to project', () => {
    it('return 400 with delete user', async () => {
      let user_id = 2;
      const result = await service.deleteUserService(
        user_id,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'user already allocated to project',
        statusCode: 92,
      });
    });
  });
  describe('catch exception in delete user', () => {
    it('return 400 ', async () => {
      const user_id = 1;
      (repository.findOne as jest.Mock).mockImplementation(() => {
        throw new Error('test error');
      });
      const result = await service.deleteUserService(
        user_id,
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
  describe('when admin try delete user and user not found', () => {
    it('return 400 with delete user and user not found', async () => {
      let user_id = 200;
      const result = await service.deleteUserService(
        user_id,
        requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(31);
    });
  });
  describe('when admin try delete user where already allocated to project', () => {
    it('return 400 with delete user', async () => {
      let user_id = 2;
      const result = await controller.deleteUser(
        user_id,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'user already allocated to project',
        statusCode: 92,
      });
    });
  });
  describe('when admin try delete delete himself', () => {
    it('return 400 with delete user', async () => {
      let user_id = 1;
      const result = await service.deleteUserService(
        user_id,
        requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'cannot delete your account by yourself',
        statusCode: 98,
      });
    });
  });
  describe('when admin try delete user without having projects', () => {
    it('return 200 with delete user', async () => {
      let user_id = 3;
      const result = await service.deleteUserService(
        user_id,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        successMessage: 'User Hemandh55 removed',
        statusCode: 200,
      });
    });
  });
  describe('when admin edit a user wont able to add double space in user name', () => {
    it('return 400 when edit user', async () => {
      let userEditDto = {
        user_name: 'user.       user_name',
        email: user.email,
        role: 2,
      };
      let user_id = 1;
      const result = await service.editUserService(
        user_id,
        userEditDto,
        requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage:
          'user name must contain only alphabet,numbers and single space',
        statusCode: 1602,
      });
    });
  });
  describe('when admin edit a user role not found', () => {
    it('return 400 when role is not found', async () => {
      let userEditDto = {
        user_name: 'user username',
        email: user.email,
        role: 7,
      };
      let user_id = 1;
      const result = await service.editUserService(
        user_id,
        userEditDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'role not found',
        statusCode: 90,
      });
    });
  });
  describe('when admin edit a user where user is not found', () => {
    it('return 400 when user is not found', async () => {
      let userEditDto = {
        user_name: 'user username',
        email: user.email,
        role: 1,
      };
      let user_id = 44;
      const result = await service.editUserService(
        user_id,
        userEditDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'User not found',
        statusCode: 31,
      });
    });
  });

  describe('when admin edit a user without any change', () => {
    it('return 200 when user edit without change', async () => {
      let userEditDto = {
        user_name: 'Hemandh',
        email: 'test@example.com',
        role: 1,
      };
      let user_id = 1;
      const result = await service.editUserService(
        user_id,
        userEditDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'no changes made',
        statusCode: 1050,
      });
    });
  });

  describe('when admin edit a user where mail already exist', () => {
    it('return 400 when user edit email', async () => {
      let userEditDto = {
        user_name: 'Hemandh',
        email: 'test1@example.com',
        role: 1,
      };
      let user_id = 1;
      const result = await service.editUserService(
        user_id,
        userEditDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'email already exists',
        statusCode: 1015,
      });
    });
  });
  describe('when admin edit a user only change email', () => {
    it('return 200 when user edit email', async () => {
      let userEditDto = {
        user_name: 'Hemandh',
        email: 'test12@example.com',
        role: 1,
      };
      let user_id = 1;
      const result = await service.editUserService(
        user_id,
        userEditDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        successMessage: 'User Updated Successfully',
        statusCode: 200,
      });
    });
  });
  describe('when admin edit a user only change email in controller', () => {
    it('return 200 when user edit email in controller', async () => {
      let userEditDto = {
        user_name: 'Hemandh',
        email: 'test12@example.com',
        role: 1,
      };
      let user_id = 1;
      const result = await controller.editUser(
        user_id,
        userEditDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        successMessage: 'User Updated Successfully',
        statusCode: 200,
      });
    });
  });

  describe('catch exception in edit user', () => {
    it('return 400 ', async () => {
      (repository.findOne as jest.Mock).mockImplementationOnce(() => {
        throw new Error('test error');
      });
      let userEditDto = {
        user_name: 'Hemandh',
        email: 'test12@example.com',
        role: 1,
      };
      let user_id = 1;
      const result = await controller.editUser(
        user_id,
        userEditDto,
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

  it('should be defined', () => {
    expect(controller.getUsers).toBeDefined();
  });
  it('should be defined', () => {
    expect(service.getUsersList).toBeDefined();
  });
  describe('when user list when search column not found', () => {
    it('return 400 when search column not found in controller', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          searchCol: '',
          searchKey: 'dfgh',
          sortCol: '',
          sortMethod: '',
        },
      } as unknown as Request;
      const result = await controller.getUsers(_requestMock, responseMock);

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Search column missing',
        statusCode: 128,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('when user list when invalid search column ', () => {
    it('return 400 when search column has invalid', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          searchCol: 'defrtg',
          searchKey: 'dfgh',
          sortCol: '',
          sortMethod: '',
        },
      } as unknown as Request;
      const result = await service.getUsersList(_requestMock, responseMock);

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Invalid field',
        statusCode: 68,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('when user list when search key is missing ', () => {
    it('return 400 when search key is missing', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          searchCol: 'user_id',
          searchKey: '',
          sortCol: '',
          sortMethod: '',
        },
      } as unknown as Request;
      const result = await service.getUsersList(_requestMock, responseMock);

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Missing search key',
        statusCode: 129,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('when user list when sort method is missing', () => {
    it('return 400 when sort method is missing', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          searchCol: '',
          searchKey: '',
          sortCol: 'user_id',
          sortMethod: '',
        },
      } as unknown as Request;
      const result = await service.getUsersList(_requestMock, responseMock);

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Missing sort method',
        statusCode: 130,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('when user list when sort column is missing', () => {
    it('return 400 when sort column is missing', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          searchCol: '',
          searchKey: '',
          sortCol: '',
          sortMethod: 'desc',
        },
      } as unknown as Request;
      const result = await service.getUsersList(_requestMock, responseMock);

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Missing sort column',
        statusCode: 131,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('when user list when sort column is invalid', () => {
    it('return 400 when sort column has invalid', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          searchCol: '',
          searchKey: '',
          sortCol: 'dfgh',
          sortMethod: 'desc',
        },
      } as unknown as Request;
      const result = await service.getUsersList(_requestMock, responseMock);

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Invalid sort field',
        statusCode: 140,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('when user list', () => {
    it('return 200 when users list ', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          searchCol: '',
          searchKey: '',
          sortCol: '',
          sortMethod: '',
        },
      } as unknown as Request;
      (repository.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockReturnValue(10),
        getMany: jest.fn().mockResolvedValue(userList),
      }));
      const result = await service.getUsersList(_requestMock, responseMock);

      expect(result).toBeDefined();
      expect(result['total']).toStrictEqual(10);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('when user list when contain search', () => {
    it('return 200 when users list  when contain search', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          searchCol: 'user_name',
          searchKey: 'ss',
          sortCol: '',
          sortMethod: '',
        },
      } as unknown as Request;
      (repository.createQueryBuilder as jest.Mock).mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockReturnValue(10),
        getMany: jest.fn().mockResolvedValue(userList),
      }));
      const result = await service.getUsersList(_requestMock, responseMock);

      expect(result).toBeDefined();
      expect(result['total']).toStrictEqual(10);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('catch exception in user list', () => {
    it('return 400 ', async () => {
      (repository.findOne as jest.Mock).mockImplementationOnce(() => {});
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          searchCol: 'user_name',
          searchKey: 'ss',
          sortCol: '',
          sortMethod: '',
        },
      } as unknown as Request;
      (repository.createQueryBuilder as jest.Mock).mockImplementationOnce(
        () => {
          throw new Error('test error');
        },
      );
      const result = await service.getUsersList(_requestMock, responseMock);

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Exception',
        statusCode: 400,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  it('should be defined', () => {
    expect(controller.getRoleList).toBeDefined();
  });
  it('should be defined', () => {
    expect(service.getRoleList).toBeDefined();
  });
  describe('when role list  ', () => {
    it('return 200 when role list', async () => {
      const result = await controller.getRoleList(responseMock);

      expect(result).toBeDefined();
      expect(result[0]['role_name']).toStrictEqual('Admin');
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('when role list in service  ', () => {
    it('return 200 when role list', async () => {
      const result = await service.getRoleList(responseMock);

      expect(result).toBeDefined();
      expect(result[0]['role_name']).toStrictEqual('Admin');
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('when role list  ', () => {
    it('return 200 when getProjectRoleList ', async () => {
      const result = await controller.getProjectRoleList(responseMock);

      expect(result).toBeDefined();
      expect(result[0]['role_name']).toStrictEqual('Admin');
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('when role list in service  ', () => {
    it('return 200 when get ProjectRoleList ', async () => {
      const result = await service.getProjectRoleList(responseMock);

      expect(result).toBeDefined();
      expect(result[0]['role_name']).toStrictEqual('Admin');
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  it('should be defined', () => {
    expect(controller.userActivity).toBeDefined();
  });
  it('should be defined', () => {
    expect(service.getUserActivity).toBeDefined();
  });
  describe('to get user activity of user when limit as non integer  ', () => {
    it('return 400   when limit as non integer ', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          limit: 'xcv',
          last_data: '',
        },
      } as unknown as Request;
      const result = await controller.userActivity(_requestMock, responseMock);

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Invalid limit value',
        statusCode: 3073,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('to get user activity of user when limit as 3001  ', () => {
    it('return 400   when limit as 3001 ', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          limit: '3001',
          last_data: '',
        },
      } as unknown as Request;
      const result = await controller.userActivity(_requestMock, responseMock);

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'limit must not be greater than 3000',
        statusCode: 3677,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('to get user activity of user when last data as non integer  ', () => {
    it('return 400    when last data as non integer ', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          limit: '',
          last_data: 'sdfg',
        },
      } as unknown as Request;
      const result = await controller.userActivity(_requestMock, responseMock);

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'The last data is invalid',
        statusCode: 3071,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('to get user activity of user when last data not exist  ', () => {
    it('return 400    when last data not found ', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          limit: '',
          last_data: '1234',
        },
      } as unknown as Request;
      (taskHistoryRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method === 'taskHistoryOffset') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(null),
            };
          }
        },
      );
      const result = await controller.userActivity(_requestMock, responseMock);

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'The last data not found',
        statusCode: 3072,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('to get user activity of user    ', () => {
    it('return 200 when to get user activity of user ', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          limit: '10',
          last_data: '',
        },
      } as unknown as Request;
      (taskHistoryRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method === 'taskHistoryOffset') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(userActivity[0]),
            };
          } else if (method === 'taskHistoryObj') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockReturnValue(10),
              getMany: jest.fn().mockResolvedValue(userActivity),
            };
          }
        },
      );
      const result = await service.getUserActivity(_requestMock, responseMock);

      expect(result).toBeDefined();
      expect(result['total']).toStrictEqual(10);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('to get user activity of user  with limit and last data  ', () => {
    it('return 200 when to get user activity of user ', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          limit: '10',
          last_data: '456',
        },
      } as unknown as Request;
      (taskHistoryRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method === 'taskHistoryOffset') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(userActivity[0]),
            };
          } else if (method === 'taskHistoryObj') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockReturnValue(10),
              getMany: jest.fn().mockResolvedValue(userActivity),
            };
          }
        },
      );
      const result = await service.getUserActivity(_requestMock, responseMock);

      expect(result).toBeDefined();
      expect(result['total']).toStrictEqual(10);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('to get user activity of user when without limit and last data   ', () => {
    it('return 200 when to get user activity of user ', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          limit: '',
          last_data: '',
        },
      } as unknown as Request;
      (taskHistoryRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method === 'taskHistoryOffset') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(userActivity[0]),
            };
          } else if (method === 'taskHistoryObj') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockReturnValue(10),
              getMany: jest.fn().mockResolvedValue(userActivity),
            };
          }
        },
      );
      const result = await service.getUserActivity(_requestMock, responseMock);

      expect(result).toBeDefined();
      expect(result['total']).toStrictEqual(10);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('catch exception in user activity', () => {
    it('return 400 ', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          limit: '',
          last_data: '',
        },
      } as unknown as Request;
      (taskHistoryRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          throw new Error('test error');
        },
      );
      const result = await service.getUserActivity(_requestMock, responseMock);

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Exception',
        statusCode: 400,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  it('should be defined', () => {
    expect(controller.coworkerList).toBeDefined();
  });
  it('should be defined', () => {
    expect(service.getCoworkerList).toBeDefined();
  });
  describe('to get user coworker of user when user is not allocated to any projects  ', () => {
    it('return 200    when user is not allocated to any project', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          limit: '',
          last_data: '',
        },
      } as unknown as Request;
      (
        projectResourceAllocationRepository.find as jest.Mock
      ).mockImplementation((method) => {
        return [];
      });
      const result = await controller.coworkerList(_requestMock, responseMock);

      expect(result).toBeDefined();
      expect(result['total']).toStrictEqual(0);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('to get user coworker of user when limit is non integer  ', () => {
    it('return 400  when limit is non integer', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          limit: 'sdfg',
          last_data: '',
        },
      } as unknown as Request;
      (
        projectResourceAllocationRepository.find as jest.Mock
      ).mockImplementation((method) => {
        return allocatedProjects;
      });
      const result = await controller.coworkerList(_requestMock, responseMock);

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Invalid limit value',
        statusCode: 3073,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('to get user coworker of user when limit is above 3000  ', () => {
    it('return 400  when limit is above 3000', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          limit: '3001',
          last_data: '',
        },
      } as unknown as Request;
      (
        projectResourceAllocationRepository.find as jest.Mock
      ).mockImplementation((method) => {
        return allocatedProjects;
      });
      const result = await controller.coworkerList(_requestMock, responseMock);

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'limit must not be greater than 3000',
        statusCode: 3677,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('to get user coworker of user when last data is not string  ', () => {
    it('return 400 when last data is not string', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          limit: '',
          last_data: 765,
        },
      } as unknown as Request;
      (
        projectResourceAllocationRepository.find as jest.Mock
      ).mockImplementation((method) => {
        return allocatedProjects;
      });
      const result = await controller.coworkerList(_requestMock, responseMock);

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'The last data is invalid',
        statusCode: 3071,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('to get user coworker of user when last id is not integer  ', () => {
    it('return 400 when last id is not integer', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          limit: '',
          last_data: 's',
          last_id: 'sdd',
        },
      } as unknown as Request;
      (
        projectResourceAllocationRepository.find as jest.Mock
      ).mockImplementation((method) => {
        return allocatedProjects;
      });
      const result = await controller.coworkerList(_requestMock, responseMock);

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Invalid last id',
        statusCode: 2500,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('to get user coworker of user when last data is missing  ', () => {
    it('return 400 when last data is missing', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          limit: '',
          last_data: '',
          last_id: '11',
        },
      } as unknown as Request;
      (
        projectResourceAllocationRepository.find as jest.Mock
      ).mockImplementation((method) => {
        return allocatedProjects;
      });
      const result = await controller.coworkerList(_requestMock, responseMock);

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Last data is missing',
        statusCode: 2503,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('to get user coworker of user when last id is missing  ', () => {
    it('return 400 when last id is missing', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          limit: '',
          last_data: '11',
          last_id: '',
        },
      } as unknown as Request;
      (
        projectResourceAllocationRepository.find as jest.Mock
      ).mockImplementation((method) => {
        return allocatedProjects;
      });
      const result = await controller.coworkerList(_requestMock, responseMock);

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Last id is missing',
        statusCode: 2502,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('to get user coworker of user  when last data and last id not found  ', () => {
    it('return 400 when last data and last id not found  ', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          limit: '',
          last_data: '65',
          last_id: '55',
        },
      } as unknown as Request;
      (
        projectResourceAllocationRepository.find as jest.Mock
      ).mockImplementation((method) => {
        return allocatedProjects;
      });
      (
        projectResourceAllocationRepository.createQueryBuilder as jest.Mock
      ).mockImplementation((method) => {
        if (method === 'allocation') {
          return {
            addSelect: jest.fn().mockReturnThis(),
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            getOne: jest.fn().mockResolvedValue(null),
          };
        }
      });
      const result = await controller.coworkerList(_requestMock, responseMock);

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'No record exist on given data',
        statusCode: 2504,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('to get user coworker of user  when last data and last id  found  ', () => {
    it('return 400 when last data and last id  found  ', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          limit: '',
          last_data: '65',
          last_id: '55',
        },
      } as unknown as Request;
      (
        projectResourceAllocationRepository.find as jest.Mock
      ).mockImplementation((method) => {
        return allocatedProjects;
      });
      (
        projectResourceAllocationRepository.createQueryBuilder as jest.Mock
      ).mockImplementation((method) => {
        if (method === 'allocation') {
          return {
            addSelect: jest.fn().mockReturnThis(),
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            getOne: jest.fn().mockResolvedValue(allocatedProjects[0]),
          };
        } else if (method === 'resource') {
          return {
            addSelect: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            distinct: jest.fn().mockReturnThis(),
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            addOrderBy: jest.fn().mockReturnThis(),
            offset: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            getCount: jest.fn().mockReturnValue(10),
            getMany: jest.fn().mockResolvedValue(allocatedProjects),
            getRawMany: jest.fn().mockResolvedValue(allocatedProjects),
          };
        }
      });
      const result = await service.getCoworkerList(_requestMock, responseMock);

      expect(result).toBeDefined();
      expect(result['total']).toStrictEqual(2);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('to get user activity of user      ', () => {
    it('return 200 get coworkers list  ', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          limit: '',
          last_data: '',
          last_id: '',
        },
      } as unknown as Request;
      (
        projectResourceAllocationRepository.find as jest.Mock
      ).mockImplementation((method) => {
        return allocatedProjects;
      });
      (
        projectResourceAllocationRepository.createQueryBuilder as jest.Mock
      ).mockImplementation((method) => {
        if (method === 'allocation') {
          return {
            addSelect: jest.fn().mockReturnThis(),
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            getOne: jest.fn().mockResolvedValue(allocatedProjects[0]),
          };
        } else if (method === 'resource') {
          return {
            addSelect: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            distinct: jest.fn().mockReturnThis(),
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            addOrderBy: jest.fn().mockReturnThis(),
            offset: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            getCount: jest.fn().mockReturnValue(10),
            getMany: jest.fn().mockResolvedValue(allocatedProjects),
            getRawMany: jest.fn().mockResolvedValue(allocatedProjects),
          };
        }
      });
      const result = await service.getCoworkerList(_requestMock, responseMock);

      expect(result).toBeDefined();
      expect(result['total']).toStrictEqual(2);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('to get user activity of user  when search by useer name    ', () => {
    it('return 200 get coworkers list  ', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          limit: '',
          last_data: '',
          last_id: '',
          user_name: 'sdfv',
        },
      } as unknown as Request;
      (
        projectResourceAllocationRepository.find as jest.Mock
      ).mockImplementation((method) => {
        return allocatedProjects;
      });
      (
        projectResourceAllocationRepository.createQueryBuilder as jest.Mock
      ).mockImplementation((method) => {
        if (method === 'allocation') {
          return {
            addSelect: jest.fn().mockReturnThis(),
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            getOne: jest.fn().mockResolvedValue(allocatedProjects[0]),
          };
        } else if (method === 'resource') {
          return {
            addSelect: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            distinct: jest.fn().mockReturnThis(),
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            addOrderBy: jest.fn().mockReturnThis(),
            offset: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            getCount: jest.fn().mockReturnValue(10),
            getMany: jest.fn().mockResolvedValue(allocatedProjects),
            getRawMany: jest.fn().mockResolvedValue(allocatedProjects),
          };
        }
      });
      const result = await service.getCoworkerList(_requestMock, responseMock);

      expect(result).toBeDefined();
      expect(result['total']).toStrictEqual(2);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('catch exception in user list', () => {
    it('return 400 ', async () => {
      let _requestMock: Request = {
        currentUser: currentUserObj,
        query: {
          limit: '',
          last_data: '',
          last_id: '',
          user_name: 'sdfv',
        },
      } as unknown as Request;
      (
        projectResourceAllocationRepository.find as jest.Mock
      ).mockImplementationOnce((method) => {
        throw new Error('test error');
      });

      const result = await service.getCoworkerList(_requestMock, responseMock);

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'Exception',
        statusCode: 400,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  //profile image upload api test cases
  describe('image file upload api with file and profile details', () => {
    it('should return 400 with file and profile details', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: { file: '' },
      } as unknown as Request;
      const uniqueFileName = 'ededed';
      const maxSize = 209715200;
      const body: UserProfile = {
        first_name: 'xedccwd',
        middle_name: 'xdxdxdx',
        last_name: 'xdxxdx',
        phone_no: '2233445511',
      };
      const file = {
        fieldname: 'file',
        originalname: 'kelbinImage.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: 'TaskFiles',
        filename: 'bTTN7MgVOA_1681348822484.png',
        path: 'TaskFiles/bTTN7MgVOA_1681348822484.png',
        size: 200,
      };

      const result = await service.uploadImageFile(
        file,
        requestMock,
        uniqueFileName,
        maxSize,
        body,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('image file upload api with  profile details only', () => {
    it('should return 400 with profile details only', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: { file: '' },
      } as unknown as Request;
      const uniqueFileName = 'ededed';
      const maxSize = 209715200;
      const body: UserProfile = {
        first_name: 'xedccwd',
        middle_name: 'xdxdxdx',
        last_name: 'xdxxdx',
        phone_no: '2233445511',
      };
      const file = null;

      const result = await service.uploadImageFile(
        file,
        requestMock,
        uniqueFileName,
        maxSize,
        body,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('image file upload api with first_name empty', () => {
    it('should return 400 with profile details only', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: { file: '' },
      } as unknown as Request;
      const uniqueFileName = 'ededed';
      const maxSize = 209715200;
      const body: UserProfile = {
        first_name: '',
        middle_name: 'xdxdxdx',
        last_name: 'xdxxdx',
        phone_no: '2233445511',
      };
      const file = {
        fieldname: 'file',
        originalname: 'kelbinImage.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: 'TaskFiles',
        filename: 'bTTN7MgVOA_1681348822484.png',
        path: 'TaskFiles/bTTN7MgVOA_1681348822484.png',
        size: 309715200,
      };

      const result = await service.uploadImageFile(
        file,
        requestMock,
        uniqueFileName,
        maxSize,
        body,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(267);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('image file upload api with first_name having less than 3 characters', () => {
    it('should return 400 with first_name having less than 3 characters', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: { file: '' },
      } as unknown as Request;
      const uniqueFileName = 'ededed';
      const maxSize = 209715200;
      const body: UserProfile = {
        first_name: 'a',
        middle_name: 'xdxdxdx',
        last_name: 'xdxxdx',
        phone_no: '2233445511',
      };
      const file = {
        fieldname: 'file',
        originalname: 'kelbinImage.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: 'TaskFiles',
        filename: 'bTTN7MgVOA_1681348822484.png',
        path: 'TaskFiles/bTTN7MgVOA_1681348822484.png',
        size: 309715200,
      };

      const result = await service.uploadImageFile(
        file,
        requestMock,
        uniqueFileName,
        maxSize,
        body,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(1022);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('image file upload api with first_name having less than 3 characters', () => {
    it('should return 400 with first_name having less than 3 characters', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: { file: '' },
      } as unknown as Request;
      const uniqueFileName = 'ededed';
      const maxSize = 209715200;
      const body: UserProfile = {
        first_name: 'a',
        middle_name: 'xdxdxdx',
        last_name: 'xdxxdx',
        phone_no: '2233445511',
      };
      const file = {
        fieldname: 'file',
        originalname: 'kelbinImage.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: 'TaskFiles',
        filename: 'bTTN7MgVOA_1681348822484.png',
        path: 'TaskFiles/bTTN7MgVOA_1681348822484.png',
        size: 309715200,
      };

      const result = await service.uploadImageFile(
        file,
        requestMock,
        uniqueFileName,
        maxSize,
        body,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(1022);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('image file upload api with first_name having more than 30 characters', () => {
    it('should return 400 with first_name having more than 30 characters', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: { file: '' },
      } as unknown as Request;
      const uniqueFileName = 'ededed';
      const maxSize = 209715200;
      const body: UserProfile = {
        first_name:
          'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        middle_name: 'xdxdxdx',
        last_name: 'xdxxdx',
        phone_no: '2233445511',
      };
      const file = {
        fieldname: 'file',
        originalname: 'kelbinImage.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: 'TaskFiles',
        filename: 'bTTN7MgVOA_1681348822484.png',
        path: 'TaskFiles/bTTN7MgVOA_1681348822484.png',
        size: 309715200,
      };

      const result = await service.uploadImageFile(
        file,
        requestMock,
        uniqueFileName,
        maxSize,
        body,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(1017);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('image file upload api with first_name does not match regx', () => {
    it('should return 400 with first_name  does not match regx', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: { file: '' },
      } as unknown as Request;
      const uniqueFileName = 'ededed';
      const maxSize = 209715200;
      const body: UserProfile = {
        first_name: 'aaaaa      hhhhh',
        middle_name: 'xdxdxdx',
        last_name: 'xdxxdx',
        phone_no: '2233445511',
      };
      const file = {
        fieldname: 'file',
        originalname: 'kelbinImage.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: 'TaskFiles',
        filename: 'bTTN7MgVOA_1681348822484.png',
        path: 'TaskFiles/bTTN7MgVOA_1681348822484.png',
        size: 309715200,
      };

      const result = await service.uploadImageFile(
        file,
        requestMock,
        uniqueFileName,
        maxSize,
        body,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(1333);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('image file upload api without middle_name', () => {
    it('should return 400 without middle_name', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: { file: '' },
      } as unknown as Request;
      const uniqueFileName = 'ededed';
      const maxSize = 209715200;
      const body: UserProfile = {
        first_name: 'aaaaahhhhh',
        middle_name: '',
        last_name: 'xdxxdx',
        phone_no: '2233445511',
      };
      const file = {
        fieldname: 'file',
        originalname: 'kelbinImage.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: 'TaskFiles',
        filename: 'bTTN7MgVOA_1681348822484.png',
        path: 'TaskFiles/bTTN7MgVOA_1681348822484.png',
        size: 200,
      };

      const result = await service.uploadImageFile(
        file,
        requestMock,
        uniqueFileName,
        maxSize,
        body,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('image file upload api with middle_name more than 30 character', () => {
    it('should return 400 without middle_name more than 30 character', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: { file: '' },
      } as unknown as Request;
      const uniqueFileName = 'ededed';
      const maxSize = 209715200;
      const body: UserProfile = {
        first_name: 'aaaaahhhhh',
        middle_name:
          'hdffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
        last_name: 'xdxxdx',
        phone_no: '2233445511',
      };
      const file = {
        fieldname: 'file',
        originalname: 'kelbinImage.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: 'TaskFiles',
        filename: 'bTTN7MgVOA_1681348822484.png',
        path: 'TaskFiles/bTTN7MgVOA_1681348822484.png',
        size: 200,
      };

      const result = await service.uploadImageFile(
        file,
        requestMock,
        uniqueFileName,
        maxSize,
        body,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(1024);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('image file upload api with middle_name does not match regx', () => {
    it('should return 400 without middle_name does not match regx', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: { file: '' },
      } as unknown as Request;
      const uniqueFileName = 'ededed';
      const maxSize = 209715200;
      const body: UserProfile = {
        first_name: 'aaaaahhhhh',
        middle_name: 'hdff     rvrv',
        last_name: 'xdxxdx',
        phone_no: '2233445511',
      };
      const file = {
        fieldname: 'file',
        originalname: 'kelbinImage.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: 'TaskFiles',
        filename: 'bTTN7MgVOA_1681348822484.png',
        path: 'TaskFiles/bTTN7MgVOA_1681348822484.png',
        size: 200,
      };

      const result = await service.uploadImageFile(
        file,
        requestMock,
        uniqueFileName,
        maxSize,
        body,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(1334);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('image file upload api with last_name is empty', () => {
    it('should return 400 with last_name is empty', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: { file: '' },
      } as unknown as Request;
      const uniqueFileName = 'ededed';
      const maxSize = 209715200;
      const body: UserProfile = {
        first_name: 'aaaaahhhhh',
        middle_name: 'hdffrvrv',
        last_name: '',
        phone_no: '2233445511',
      };
      const file = {
        fieldname: 'file',
        originalname: 'kelbinImage.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: 'TaskFiles',
        filename: 'bTTN7MgVOA_1681348822484.png',
        path: 'TaskFiles/bTTN7MgVOA_1681348822484.png',
        size: 200,
      };

      const result = await service.uploadImageFile(
        file,
        requestMock,
        uniqueFileName,
        maxSize,
        body,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(113);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('image file upload api with last_name greater than 30 characters', () => {
    it('should return 400 with last_name greater than 30 characters', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: { file: '' },
      } as unknown as Request;
      const uniqueFileName = 'ededed';
      const maxSize = 209715200;
      const body: UserProfile = {
        first_name: 'aaaaahhhhh',
        middle_name: 'hdffrvrv',
        last_name:
          'dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd',
        phone_no: '2233445511',
      };
      const file = {
        fieldname: 'file',
        originalname: 'kelbinImage.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: 'TaskFiles',
        filename: 'bTTN7MgVOA_1681348822484.png',
        path: 'TaskFiles/bTTN7MgVOA_1681348822484.png',
        size: 200,
      };

      const result = await service.uploadImageFile(
        file,
        requestMock,
        uniqueFileName,
        maxSize,
        body,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(1024);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('image file upload api with last_name does not match regx', () => {
    it('should return 400 with last_name does not match regx', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: { file: '' },
      } as unknown as Request;
      const uniqueFileName = 'ededed';
      const maxSize = 209715200;
      const body: UserProfile = {
        first_name: 'aaaaahhhhh',
        middle_name: 'hdffrvrv',
        last_name: 'ddd    ededededed',
        phone_no: '2233445511',
      };
      const file = {
        fieldname: 'file',
        originalname: 'kelbinImage.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: 'TaskFiles',
        filename: 'bTTN7MgVOA_1681348822484.png',
        path: 'TaskFiles/bTTN7MgVOA_1681348822484.png',
        size: 200,
      };

      const result = await service.uploadImageFile(
        file,
        requestMock,
        uniqueFileName,
        maxSize,
        body,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(1334);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('image file upload api with phone_no cannot be empty', () => {
    it('should return 400 with phone_no cannot be empty', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: { file: '' },
      } as unknown as Request;
      const uniqueFileName = 'ededed';
      const maxSize = 209715200;
      const body: UserProfile = {
        first_name: 'aaaaahhhhh',
        middle_name: 'hdffrvrv',
        last_name: 'dddedededed',
        phone_no: '',
      };
      const file = {
        fieldname: 'file',
        originalname: 'kelbinImage.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: 'TaskFiles',
        filename: 'bTTN7MgVOA_1681348822484.png',
        path: 'TaskFiles/bTTN7MgVOA_1681348822484.png',
        size: 200,
      };

      const result = await service.uploadImageFile(
        file,
        requestMock,
        uniqueFileName,
        maxSize,
        body,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(1019);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('image file upload api with phone_no less than 10 numbers', () => {
    it('should return 400 with phone_no less than 10 numbers', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: { file: '' },
      } as unknown as Request;
      const uniqueFileName = 'ededed';
      const maxSize = 209715200;
      const body: UserProfile = {
        first_name: 'aaaaahhhhh',
        middle_name: 'hdffrvrv',
        last_name: 'dddedededed',
        phone_no: '44225566',
      };
      const file = {
        fieldname: 'file',
        originalname: 'kelbinImage.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: 'TaskFiles',
        filename: 'bTTN7MgVOA_1681348822484.png',
        path: 'TaskFiles/bTTN7MgVOA_1681348822484.png',
        size: 200,
      };

      const result = await service.uploadImageFile(
        file,
        requestMock,
        uniqueFileName,
        maxSize,
        body,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(1019);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('image file upload api with phone_no more than 12 numbers', () => {
    it('should return 400 with phone_no more than 12 numbers', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: { file: '' },
      } as unknown as Request;
      const uniqueFileName = 'ededed';
      const maxSize = 209715200;
      const body: UserProfile = {
        first_name: 'aaaaahhhhh',
        middle_name: 'hdffrvrv',
        last_name: 'dddedededed',
        phone_no: '4422556611111',
      };
      const file = {
        fieldname: 'file',
        originalname: 'kelbinImage.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: 'TaskFiles',
        filename: 'bTTN7MgVOA_1681348822484.png',
        path: 'TaskFiles/bTTN7MgVOA_1681348822484.png',
        size: 200,
      };

      const result = await service.uploadImageFile(
        file,
        requestMock,
        uniqueFileName,
        maxSize,
        body,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(1020);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('image upload api with phone_no is invalid', () => {
    it('should return 400 with phone_no is invalid', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        body: { file: '' },
      } as unknown as Request;
      const uniqueFileName = 'ededed';
      const maxSize = 209715200;
      const body: UserProfile = {
        first_name: 'aaaaahhhhh',
        middle_name: 'hdffrvrv',
        last_name: 'dddedededed',
        phone_no: '442255fefef',
      };
      const file = {
        fieldname: 'file',
        originalname: 'kelbinImage.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: 'TaskFiles',
        filename: 'bTTN7MgVOA_1681348822484.png',
        path: 'TaskFiles/bTTN7MgVOA_1681348822484.png',
        size: 200,
      };

      const result = await service.uploadImageFile(
        file,
        requestMock,
        uniqueFileName,
        maxSize,
        body,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(333);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('image upload api with user not found', () => {
    it('should return 400 with user not found', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      const uniqueFileName = 'ededed';
      const maxSize = 209715200;
      const body: UserProfile = {
        first_name: 'aaaaahhhhh',
        middle_name: 'hdffrvrv',
        last_name: 'dddedededed',
        phone_no: '4422556677',
      };
      const file = {
        fieldname: 'file',
        originalname: 'kelbinImage.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: 'TaskFiles',
        filename: 'bTTN7MgVOA_1681348822484.png',
        path: 'TaskFiles/bTTN7MgVOA_1681348822484.png',
        size: 200,
      };
      (repository.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.user_id === 100 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return null;
        }
      });
      const result = await service.uploadImageFile(
        file,
        requestMock,
        uniqueFileName,
        maxSize,
        body,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(32);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('image upload api with phone_number already exist', () => {
    it('should return 400 with  phone_number already exist', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj3,
      } as unknown as Request;
      const uniqueFileName = 'ededed';
      const maxSize = 209715200;
      const body: UserProfile = {
        first_name: 'aaaaahhhhh',
        middle_name: 'hdffrvrv',
        last_name: 'dddedededed',
        phone_no: '33333332200',
      };
      const file = {
        fieldname: 'file',
        originalname: 'kelbinImage.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: 'TaskFiles',
        filename: 'bTTN7MgVOA_1681348822484.png',
        path: 'TaskFiles/bTTN7MgVOA_1681348822484.png',
        size: 200,
      };
      (repository.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.user_id === 1 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return currentUserObj3;
        }
        if (
          option.where.phone_number === '33333332200' &&
          option.where.status === STATUS.ACTIVE
        ) {
          return currentUserObj;
        }
      });

      const result = await service.uploadImageFile(
        file,
        requestMock,
        uniqueFileName,
        maxSize,
        body,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(1350);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('image upload api with only file', () => {
    it('should return 400 with only file', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      const uniqueFileName = 'ededed';
      const maxSize = 209715200;
      const body = {};
      const file = undefined;

      const result = await service.uploadImageFile(
        file,
        requestMock,
        uniqueFileName,
        maxSize,
        body,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(708);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('image upload api with only file size greater than 10mMb', () => {
    it('should return 400 with only file size greater than 10mMb', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      const uniqueFileName = 'ededed';
      const maxSize = 209715200;
      const body = {};
      const file = {
        fieldname: 'file',
        originalname: 'kelbinImage.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: 'TaskFiles',
        filename: 'bTTN7MgVOA_1681348822484.png',
        path: 'TaskFiles/bTTN7MgVOA_1681348822484.png',
        size: 2045545445455440,
      };

      const result = await service.uploadImageFile(
        file,
        requestMock,
        uniqueFileName,
        maxSize,
        body,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(711);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('image upload api with only file ,', () => {
    it('should return 200 with only file', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      const uniqueFileName = 'ededed';
      const maxSize = 209715200;
      const body = {};
      const file = {
        fieldname: 'file',
        originalname: 'kelbinImage.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: 'TaskFiles',
        filename: 'bTTN7MgVOA_1681348822484.png',
        path: 'TaskFiles/bTTN7MgVOA_1681348822484.png',
        size: 204,
      };

      const result = await service.uploadImageFile(
        file,
        requestMock,
        uniqueFileName,
        maxSize,
        body,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('image upload api with only file profile_photo is null case', () => {
    it('should return 200 with only file profile_photo is null case ', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj2,
      } as unknown as Request;
      const uniqueFileName = 'ededed';
      const maxSize = 209715200;
      const body = {};
      const file = {
        fieldname: 'file',
        originalname: 'kelbinImage.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: 'TaskFiles',
        filename: 'bTTN7MgVOA_1681348822484.png',
        path: 'TaskFiles/bTTN7MgVOA_1681348822484.png',
        size: 204,
      };

      const result = await service.uploadImageFile(
        file,
        requestMock,
        uniqueFileName,
        maxSize,
        body,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('image upload api with only file key in body', () => {
    it('should return 400 with only file key in body ', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj2,
      } as unknown as Request;
      const uniqueFileName = 'ededed';
      const maxSize = 209715200;
      const body = {
        file: '',
      };
      const file = {
        fieldname: 'file',
        originalname: 'kelbinImage.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: 'TaskFiles',
        filename: 'bTTN7MgVOA_1681348822484.png',
        path: 'TaskFiles/bTTN7MgVOA_1681348822484.png',
        size: 204,
      };

      const result = await service.uploadImageFile(
        file,
        requestMock,
        uniqueFileName,
        maxSize,
        body,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(708);

      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('image upload api with unexpected field detected', () => {
    it('should return 400 with unexpected field detected ', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      const uniqueFileName = 'ededed';
      const maxSize = 209715200;
      const body = {
        first_name: 'aaaaahhhhh',
        middle_name: 'hdffrvrv',
        last_name: 'dddedededed',
        phone_no: '1122334455',
        ffeeve: 'vvdfe',
      };
      const file = '';

      const result = await service.uploadImageFile(
        file,
        requestMock,
        uniqueFileName,
        maxSize,
        body,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(2701);

      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('image upload api  Key value should be first_name itself and required', () => {
    it('should return 400 Key value should be first_name itself and required', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      const uniqueFileName = 'ededed';
      const maxSize = 209715200;
      const body: UserProfile = {
        first_name: undefined,
        middle_name: 'hdffrvrv',
        last_name: 'dddedededed',
        phone_no: '1122334455',
      };
      const file = undefined;

      const result = await service.uploadImageFile(
        file,
        requestMock,
        uniqueFileName,
        maxSize,
        body,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(1899);

      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('image upload api  Key value should be middle_name itself and required', () => {
    it('should return 400 Key value should be middle_name itself and required', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      const uniqueFileName = 'ededed';
      const maxSize = 209715200;
      const body: UserProfile = {
        first_name: 'uytfu',
        middle_name: undefined,
        last_name: 'dddedededed',
        phone_no: '1122334455',
      };
      const file = undefined;

      const result = await service.uploadImageFile(
        file,
        requestMock,
        uniqueFileName,
        maxSize,
        body,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(1900);

      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('image upload api  Key value should be last_name itself and required', () => {
    it('should return 400 Key value should be last_name itself and required', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      const uniqueFileName = 'ededed';
      const maxSize = 209715200;
      const body: UserProfile = {
        first_name: 'uytfu',
        middle_name: 'wdwdd',
        last_name: undefined,
        phone_no: '1122334455',
      };
      const file = undefined;

      const result = await service.uploadImageFile(
        file,
        requestMock,
        uniqueFileName,
        maxSize,
        body,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(1899);

      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('image upload api  Key value should be phone_no itself and required', () => {
    it('should return 400 Key value should be phone_no itself and required', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      const uniqueFileName = 'ededed';
      const maxSize = 209715200;
      const body: UserProfile = {
        first_name: 'uytfu',
        middle_name: 'wdwdd',
        last_name: 'iutestrd',
        phone_no: undefined,
      };
      const file = undefined;

      const result = await service.uploadImageFile(
        file,
        requestMock,
        uniqueFileName,
        maxSize,
        body,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(1899);

      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('image upload api  Key value should be first_name itself and required with file', () => {
    it('should return 400 Key value should be first_name itself and required', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        file: undefined,
      } as unknown as Request;
      const uniqueFileName = 'ededed';
      const maxSize = 209715200;
      const body: UserProfile = {
        first_name: undefined,
        middle_name: 'hdffrvrv',
        last_name: 'dddedededed',
        phone_no: '1122334455',
      };
      const file = {
        fieldname: 'file',
        originalname: 'kelbinImage.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: 'TaskFiles',
        filename: 'bTTN7MgVOA_1681348822484.png',
        path: 'TaskFiles/bTTN7MgVOA_1681348822484.png',
        size: 204,
      };

      const result = await service.uploadImageFile(
        file,
        requestMock,
        uniqueFileName,
        maxSize,
        body,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(1899);

      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('image upload api  Key value should be middle_name itself and required with file', () => {
    it('should return 400 Key value should be middle_name itself and required', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        file: undefined,
      } as unknown as Request;
      const uniqueFileName = 'ededed';
      const maxSize = 209715200;
      const body: UserProfile = {
        first_name: 'uidsd',
        middle_name: undefined,
        last_name: 'dddedededed',
        phone_no: '1122334455',
      };
      const file = {
        fieldname: 'file',
        originalname: 'kelbinImage.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: 'TaskFiles',
        filename: 'bTTN7MgVOA_1681348822484.png',
        path: 'TaskFiles/bTTN7MgVOA_1681348822484.png',
        size: 204,
      };

      const result = await service.uploadImageFile(
        file,
        requestMock,
        uniqueFileName,
        maxSize,
        body,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(1900);

      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('image upload api  Key value should be last_name itself and required with file', () => {
    it('should return 400 Key value should be last_name itself and required', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        file: undefined,
      } as unknown as Request;
      const uniqueFileName = 'ededed';
      const maxSize = 209715200;
      const body: UserProfile = {
        first_name: 'uidsd',
        middle_name: 'uydfg',
        last_name: undefined,
        phone_no: '1122334455',
      };
      const file = {
        fieldname: 'file',
        originalname: 'kelbinImage.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: 'TaskFiles',
        filename: 'bTTN7MgVOA_1681348822484.png',
        path: 'TaskFiles/bTTN7MgVOA_1681348822484.png',
        size: 204,
      };

      const result = await service.uploadImageFile(
        file,
        requestMock,
        uniqueFileName,
        maxSize,
        body,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(1899);

      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('image upload api  Key value should be phone_no itself and required with file', () => {
    it('should return 400 Key value should be phone_no itself and required', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        file: undefined,
      } as unknown as Request;
      const uniqueFileName = 'ededed';
      const maxSize = 209715200;
      const body: UserProfile = {
        first_name: 'uidsd',
        middle_name: 'uydfg',
        last_name: 'dfgdf',
        phone_no: undefined,
      };
      const file = {
        fieldname: 'file',
        originalname: 'kelbinImage.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: 'TaskFiles',
        filename: 'bTTN7MgVOA_1681348822484.png',
        path: 'TaskFiles/bTTN7MgVOA_1681348822484.png',
        size: 204,
      };

      const result = await service.uploadImageFile(
        file,
        requestMock,
        uniqueFileName,
        maxSize,
        body,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(1899);

      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('image upload api with body and file profile_photo is null case', () => {
    it('should return 200 with body and file profile_photo is null case ', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj2,
      } as unknown as Request;
      const uniqueFileName = 'ededed';
      const maxSize = 209715200;
      const body = {
        first_name: 'uidsd',
        middle_name: 'uydfg',
        last_name: 'dfgdf',
        phone_no: '4455889900',
      };
      const file = {
        fieldname: 'file',
        originalname: 'kelbinImage.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: 'TaskFiles',
        filename: 'bTTN7MgVOA_1681348822484.png',
        path: 'TaskFiles/bTTN7MgVOA_1681348822484.png',
        size: 204,
      };

      const result = await service.uploadImageFile(
        file,
        requestMock,
        uniqueFileName,
        maxSize,
        body,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('image upload api with body only ', () => {
    it('should return 200 with body only ', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj2,
      } as unknown as Request;
      const uniqueFileName = 'ededed';
      const maxSize = 209715200;
      const body: UserProfile = {
        first_name: 'uidsd',
        middle_name: 'uydfg',
        last_name: 'dfgdf',
        phone_no: '4455889900',
      };
      const file = {
        fieldname: 'file',
        originalname: 'kelbinImage.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: 'TaskFiles',
        filename: 'bTTN7MgVOA_1681348822484.png',
        path: 'TaskFiles/bTTN7MgVOA_1681348822484.png',
        size: 200,
      };
      (repository.save as jest.Mock).mockResolvedValueOnce(profile);

      const result = await service.uploadImageFile(
        file,
        requestMock,
        uniqueFileName,
        maxSize,
        body,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('image upload api with body and file size greater than 10MB', () => {
    it('should return 400 with body and file size greater than 10MB ', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj2,
      } as unknown as Request;
      const uniqueFileName = 'ededed';
      const maxSize = 209715200;
      const body = {
        first_name: 'uidsd',
        middle_name: 'uydfg',
        last_name: 'dfgdf',
        phone_no: '4455889900',
      };
      const file = {
        fieldname: 'file',
        originalname: 'kelbinImage.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: 'TaskFiles',
        filename: 'bTTN7MgVOA_1681348822484.png',
        path: 'TaskFiles/bTTN7MgVOA_1681348822484.png',
        size: 4442423423432442,
      };

      const result = await service.uploadImageFile(
        file,
        requestMock,
        uniqueFileName,
        maxSize,
        body,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(711);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  // describe('image upload api Automatic calculated boundary not given', () => {
  //   it('should return 400 Automatic calculated boundary not given ', async () => {
  //     let requestMock: Request = {
  //       currentUser: currentUserObj2,
  //     } as unknown as Request;
  //     const uniqueFileName = "ededed";
  //     const maxSize = 209715200;
  //     const body = {

  //     };
  //     const file =undefined

  //     const result = await service.uploadImageFile(
  //       file,
  //       requestMock,
  //       uniqueFileName,
  //       maxSize,
  //       body,
  //       responseMock,
  //     );
  //     console.log(result,"232325");

  //     expect(result).toBeDefined();
  //     expect(result.statusCode).toStrictEqual(2711);
  //     expect(responseMock.status).toHaveBeenCalledWith(400);
  //   });
  // });
  describe('image upload api with body and file profile_photo is null case in controller', () => {
    it('should return 200 with body and file profile_photo is null case in controller ', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj2,
      } as unknown as Request;
      const body = {
        first_name: 'uidsd',
        middle_name: 'uydfg',
        last_name: 'dfgdf',
        phone_no: '4455889900',
      };
      const file = {
        fieldname: 'file',
        originalname: 'kelbinImage.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: 'TaskFiles',
        filename: 'bTTN7MgVOA_1681348822484.png',
        path: 'TaskFiles/bTTN7MgVOA_1681348822484.png',
        size: 204,
      };

      const result = await controller.uploadedFile(
        requestMock,
        file,
        body,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('image upload api  first_name,middle_name,last_name,phone_no is allowed one time only', () => {
    it('should return 400 first_name,middle_name,last_name,phone_no is allowed one time only', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      const uniqueFileName = 'ededed';
      const maxSize = 209715200;
      const body = {
        first_name: ['ffwfwf', 'fwfwwdw'],
        middle_name: 'hdffrvrv',
        last_name: 'dddedededed',
        phone_no: '1122334455',
      };
      const file = undefined;

      const result = await service.uploadImageFile(
        file,
        requestMock,
        uniqueFileName,
        maxSize,
        body,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(2702);

      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('image upload api exception case file is not received', () => {
    it('should return 400 exception case file is not received', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      const uniqueFileName = 'ededed';
      const maxSize = 209715200;
      const body = {
        first_name: [],
        middle_name: 'hdffrvrv',
        last_name: 'dddedededed',
        phone_no: '1122334455',
      };
      const file = {
        fieldname: 'file',
        originalname: 'kelbinImage.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: 'TaskFiles',
        filename: 'bTTN7MgVOA_1681348822484.png',
        path: 'TaskFiles/bTTN7MgVOA_1681348822484.png',
        size: 204,
      };

      const result = await service.uploadImageFile(
        file,
        requestMock,
        uniqueFileName,
        maxSize,
        body,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(708);

      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('image upload api exception case ', () => {
    it('should return 400 exception case ', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        file: {
          fieldname: 'file',
          originalname: 'kelbinImage.png',
          encoding: '7bit',
          mimetype: 'image/png',
          destination: 'TaskFiles',
          filename: 'bTTN7MgVOA_1681348822484.png',
          path: 'TaskFiles/bTTN7MgVOA_1681348822484.png',
          size: 204,
        },
      } as unknown as Request;
      const uniqueFileName = 'ededed';
      const maxSize = 209715200;
      const body = {
        first_name: [],
        middle_name: 'hdffrvrv',
        last_name: 'dddedededed',
        phone_no: '1122334455',
      };
      const file = {
        fieldname: 'file',
        originalname: 'kelbinImage.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: 'TaskFiles',
        filename: 'bTTN7MgVOA_1681348822484.png',
        path: 'TaskFiles/bTTN7MgVOA_1681348822484.png',
        size: 204,
      };

      const result = await service.uploadImageFile(
        file,
        requestMock,
        uniqueFileName,
        maxSize,
        body,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(400);

      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  // describe('image upload api exception case with only body ', () => {
  //   it('should return 400 exception case with only body ', async () => {
  //     let requestMock: Request = {
  //       currentUser: currentUserObj,
  //       file:{
  //         fieldname: 'file',
  //         originalname: 'kelbinImage.png',
  //         encoding: '7bit',
  //         mimetype: 'image/png',
  //         destination: 'TaskFiles',
  //         filename: 'bTTN7MgVOA_1681348822484.png',
  //         path: 'TaskFiles/bTTN7MgVOA_1681348822484.png',
  //         size: 204
  //       }
  //     } as unknown as Request;

  //     const uniqueFileName = "ededed";
  //     const maxSize = 209715200;
  //     const body={
  //       first_name:[[]],
  //       middle_name: "hdffrvrv",
  //       last_name: "dddedededed",
  //       phone_no: "1122334455",

  //     };
  //     const file ={};

  //     (taskHistoryRepo.findOne as jest.Mock).mockImplementation((option: any) => {
  //       if (option.where.undefined === undefined && option.where.status === STATUS.ACTIVE) {
  //         return undefined
  //       }
  //       if (option.where.phone_number === '33333332200' && option.where.status === STATUS.ACTIVE) {
  //         return currentUserObj3
  //       }
  //     });

  //     const result = await service.uploadImageFile(
  //       file,
  //       requestMock,
  //       uniqueFileName,
  //       maxSize,
  //       body,
  //       responseMock,
  //     );
  //     console.log(result,"3323232");

  //     expect(result).toBeDefined();
  //     expect(result.statusCode).toStrictEqual(400);

  //     expect(responseMock.status).toHaveBeenCalledWith(400);
  //   });
  // });
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  let _userDetail = Object.assign(userDetails);

  describe('when admin  edit user same email and role while user name is different', () => {
    it('return 200 when user edit email', async () => {
      let userEditDto = {
        user_name: 'Hemandh1',
        email: 'test12@example.com',
        role: 1,
      };
      let user_id = 37;
      (repository.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          (option.where.user_id === 37 &&
            option.where.status === STATUS.ACTIVE) ||
          (option.where.email === 'test12@example.com' &&
            option.where.status === STATUS.ACTIVE)
        ) {
          userDetails.role = roleList[0];

          return userDetails;
        } else {
          return null;
        }
      });
      (repository.update as jest.Mock).mockImplementation((option: any) => {
        if (user_id === 37) {
          userDetails.user_name = userEditDto.user_name;
          userDetails.role = roleList[0];
        }
      });
      const result = await service.editUserService(
        user_id,
        userEditDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        successMessage: 'User Updated Successfully',
        statusCode: 200,
      });
    });
  });
  userDetails.user_name = _userDetail.user_name;

  describe('when user name and role changed to user where email hasnt chnaged', () => {
    it('return 200 when user edit email', async () => {
      let userEditDto = {
        user_name: 'Hemandh12',
        email: 'test12@example.com',
        role: 2,
      };
      let user_id = 37;
      (repository.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          (option.where.user_id === 37 &&
            option.where.status === STATUS.ACTIVE) ||
          (option.where.email === 'test12@example.com' &&
            option.where.status === STATUS.ACTIVE)
        ) {
          return userDetails;
        } else if (option.where.user_id === 37) {
          return userDetails;
        } else {
          return null;
        }
      });
      (repository.update as jest.Mock).mockImplementation((option: any) => {
        if (user_id === 37) {
          userDetails.user_name = userEditDto.user_name;
          userDetails.role = roleList[1];
        }
      });
      (
        projectResourceAllocationRepository.find as jest.Mock
      ).mockImplementation((option: any) => {
        return allocatedDataEditUser;
      });

      const result = await service.editUserService(
        user_id,
        userEditDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        successMessage: 'User Updated Successfully',
        statusCode: 200,
      });
    });
  });
  userDetails.user_name = _userDetail.user_name;
  userDetails.role = roleList[1];

  describe('when user name and role changed to user where email hasnt chnaged and where user is not allocated to any projects', () => {
    it('return 200 when user edit email', async () => {
      let userEditDto = {
        user_name: 'Hemandh12',
        email: 'test12@example.com',
        role: 1,
      };
      let user_id = 37;
      (repository.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          (option.where.user_id === 37 &&
            option.where.status === STATUS.ACTIVE) ||
          (option.where.email === 'test12@example.com' &&
            option.where.status === STATUS.ACTIVE)
        ) {
          return userDetails;
        } else if (option.where.user_id === 37) {
          return userDetails;
        } else {
          return null;
        }
      });
      (repository.update as jest.Mock).mockImplementation((option: any) => {
        if (user_id === 37) {
          userDetails.user_name = userEditDto.user_name;
          userDetails.role = roleList[0];
        }
      });
      (
        projectResourceAllocationRepository.find as jest.Mock
      ).mockImplementation((option: any) => {
        return [];
      });

      const result = await service.editUserService(
        user_id,
        userEditDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        successMessage: 'User Updated Successfully',
        statusCode: 200,
      });
    });
  });
  userDetails.user_name = _userDetail.user_name;
  userDetails.role = roleList[1];
  describe('when user name and role changed to user where email hasnt chnaged when role changed', () => {
    it('return 200 when user edit email', async () => {
      let userEditDto: UserEditCreateDto = {
        user_name: 'Hemandh12',
        email: 'test12@example.com',
        role: 1,
      };
      let user_id = 37;
      (repository.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          (option.where.user_id === 37 &&
            option.where.status === STATUS.ACTIVE) ||
          (option.where.email === 'test12@example.com' &&
            option.where.status === STATUS.ACTIVE)
        ) {
          return userDetailsUser;
        } else if (option.where.user_id === 37) {
          return userDetailsUser;
        } else {
          return null;
        }
      });
      (repository.update as jest.Mock).mockImplementation((option: any) => {
        if (user_id === 37) {
          userDetails.user_name = userEditDto.user_name;
          userDetails.role = roleList[0];
          return true;
        }
      });
      (
        projectResourceAllocationRepository.find as jest.Mock
      ).mockImplementation((option: any) => {
        return [];
      });

      const result = await service.editUserService(
        user_id,
        userEditDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        successMessage: 'User Updated Successfully',
        statusCode: 200,
      });
    });
  });
  describe('when user name and role changed to user where email hasnt chnaged when role and allocateed', () => {
    it('return 200 when user edit email', async () => {
      let userEditDto: UserEditCreateDto = {
        user_name: 'Hemandh12',
        email: 'test12@example.com',
        role: 1,
      };
      let user_id = 37;
      (repository.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          (option.where.user_id === 37 &&
            option.where.status === STATUS.ACTIVE) ||
          (option.where.email === 'test12@example.com' &&
            option.where.status === STATUS.ACTIVE)
        ) {
          return userDetailsUser;
        } else if (option.where.user_id === 37) {
          return userDetails;
        } else {
          return null;
        }
      });
      (repository.update as jest.Mock).mockImplementation((option: any) => {
        if (user_id === 37) {
          userDetails.user_name = userEditDto.user_name;
          userDetails.role = roleList[0];
          return true;
        }
      });
      (
        projectResourceAllocationRepository.find as jest.Mock
      ).mockImplementation((option: any) => {
        return allocatedDataEditUser;
      });

      const result = await service.editUserService(
        user_id,
        userEditDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        successMessage: 'User Updated Successfully',
        statusCode: 200,
      });
    });
  });

  describe('when user name and role changed to user where  new email  chnaged when role and allocateed', () => {
    it('return 200 when user edit email', async () => {
      let userEditDto: UserEditCreateDto = {
        user_name: 'Hemandh12',
        email: 'test12@example.com',
        role: 1,
      };
      let user_id = 37;
      (repository.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.user_id === 37 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return userDetailsUser;
        } else if (
          option.where.email === 'test12@example.com' &&
          option.where.status === STATUS.ACTIVE
        ) {
          return null;
        } else if (option.where.user_id === 37) {
          return userDetails;
        } else {
          return null;
        }
      });
      (repository.update as jest.Mock).mockImplementation((option: any) => {
        if (user_id === 37) {
          userDetails.user_name = userEditDto.user_name;
          userDetails.role = roleList[0];
          return true;
        }
      });
      (
        projectResourceAllocationRepository.find as jest.Mock
      ).mockImplementation((option: any) => {
        return allocatedDataEditUser;
      });

      const result = await service.editUserService(
        user_id,
        userEditDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        successMessage: 'User Updated Successfully',
        statusCode: 200,
      });
    });
  });

  describe('when user name and role changed to user where new email  chnaged when role and not allocated', () => {
    it('return 200 when user edit email', async () => {
      let userEditDto: UserEditCreateDto = {
        user_name: 'Hemandh12',
        email: 'test12@example.com',
        role: 1,
      };
      let user_id = 37;
      (repository.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.user_id === 37 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return userDetailsUser;
        } else if (
          option.where.email === 'test12@example.com' &&
          option.where.status === STATUS.ACTIVE
        ) {
          return null;
        } else if (option.where.user_id === 37) {
          return userDetails;
        } else {
          return null;
        }
      });
      (repository.update as jest.Mock).mockImplementation((option: any) => {
        if (user_id === 37) {
          userDetails.user_name = userEditDto.user_name;
          userDetails.role = roleList[0];
          return true;
        }
      });
      (
        projectResourceAllocationRepository.find as jest.Mock
      ).mockImplementation((option: any) => {
        return [];
      });

      const result = await service.editUserService(
        user_id,
        userEditDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        successMessage: 'User Updated Successfully',
        statusCode: 200,
      });
    });
  });

  describe('when user name and role changed to user where new email chnaged when role  as user and allocateed', () => {
    it('return 200 when user edit email', async () => {
      let userEditDto: UserEditCreateDto = {
        user_name: 'Hemandh12',
        email: 'test12@example.com',
        role: 1,
      };
      let user_id = 37;
      (repository.findOne as jest.Mock).mockImplementation((option: any) => {
        if (
          option.where.user_id === 37 &&
          option.where.status === STATUS.ACTIVE
        ) {
          return userDetailsUser;
        } else if (
          option.where.email === 'test12@example.com' &&
          option.where.status === STATUS.ACTIVE
        ) {
          return null;
        } else if (option.where.user_id === 37) {
          return userDetailsUser;
        } else {
          return null;
        }
      });
      (repository.update as jest.Mock).mockImplementation((option: any) => {
        if (user_id === 37) {
          userDetails.user_name = userEditDto.user_name;
          userDetails.role = roleList[0];
          return true;
        }
      });
      (
        projectResourceAllocationRepository.find as jest.Mock
      ).mockImplementation((option: any) => {
        return allocatedDataEditUser;
      });

      const result = await service.editUserService(
        user_id,
        userEditDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        successMessage: 'User Updated Successfully',
        statusCode: 200,
      });
    });
  });
  describe('when add user which name has double space', () => {
    it('enter valid details', async () => {
      let userDto = {
        user_name: 'j   iencinc',
        email: 'test4@example.com',
        role: Role.ADMIN,
      };
      let createdDta = {
        user_id: 2,
        user_name: userDto.user_name,
        email: userDto.email,
        role: {
          role_id: userDto.role,
          role_name: 'User',
          created_date: new Date(),
          updated_date: new Date(),
        },
        last_login: 1,
        status: 1,
        new_user: 0,
        change_password_staus: 1,
        updated_date: new Date(),
        created_date: new Date(),
        password:
          '$2b$10$AZPkYAfqFr7IFdjKrehihOi6B1/gw1DwJc7dRaX1hCY/QxMa5rFMK',
      };
      (repository.save as jest.Mock).mockResolvedValueOnce(createdDta);
      const result = await service.addUserService(
        userDto,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage:
          'user name must contain only alphabet,numbers and single space',
        statusCode: 1602,
      });
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('UserCreateDetails', () => {
    it('should create an instance of UserCreateDetails with the provided properties', () => {
      const userCreateDetails = new UserCreateDetails();
      userCreateDetails.user_name = 'John Doe';
      userCreateDetails.email = 'johndoe@example.com';
      userCreateDetails.role = 1;

      expect(userCreateDetails).toBeInstanceOf(UserCreateDetails);
      expect(userCreateDetails.user_name).toBe('John Doe');
      expect(userCreateDetails.email).toBe('johndoe@example.com');
      expect(userCreateDetails.role).toBe(1);
    });
  });

  describe('ChangePasswordDetails', () => {
    it('should create an instance of ChangePasswordDetails', () => {
      const details = new ChangePasswordDetails();
      const oldPassword = 'old_password';
      const newPassword = 'new_password';
      details.old_password = oldPassword;
      details.new_password = newPassword;
      expect(details).toBeInstanceOf(ChangePasswordDetails);
      expect(details.old_password).toEqual(oldPassword);
      expect(details.new_password).toEqual(newPassword);
    });
  });
});
