import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { User } from '../../Entity/User';
import { Task } from '../../Entity/Task';
import { Notifications } from '../../Entity/Notifications';
import { ProjectResourceAllocation } from '../../Entity/Project_resource_allocation';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { NotificationController } from '../notification.controller';
import { NotificationService } from '../notification.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Project } from '../../Entity/Project';
import {
  currentUserObj,
  notificationListGetMany,
  notificationListUserListNotification,
} from '../__tests__/data';
import { Request, Response } from 'express';
import { GetNotification } from '../Notification.dto';

const responseMock: Response = {
  status: jest.fn((x) => statusResponseMock),
  send: jest.fn((x) => x),
} as unknown as Response;
const statusResponseMock = {
  send: jest.fn((x) => x),
};

export const notificationData = {
  findOne: jest.fn().mockImplementation((options: any) => {
    return true;
  }),
  save: jest.fn().mockImplementation((options: any) => {
    return true;
  }),
  find: jest.fn().mockImplementation((options: any) => {
    return true;
  }),
  update: jest.fn().mockImplementation((options: any) => {
    return true;
  }),
  count: jest.fn().mockImplementation((options: any) => {
    return true;
  }),
  createQueryBuilder: jest.fn().mockImplementation((options: any) => {
    return true;
  }),
};
export const userData = {
  findOne: jest.fn().mockImplementation((options: any) => {
    return true;
  }),
  save: jest.fn().mockImplementation((options: any) => {
    return true;
  }),
  find: jest.fn().mockImplementation((options: any) => {
    return true;
  }),
  update: jest.fn().mockImplementation((options: any) => {
    return true;
  }),
  count: jest.fn().mockImplementation((options: any) => {
    return true;
  }),
  createQueryBuilder: jest.fn().mockImplementation((options: any) => {
    return true;
  }),
};
describe('notification', () => {
  let controller: NotificationController;
  let service: NotificationService;
  let notificationRepo: Repository<Notifications>;
  let userRepo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [
        NotificationService,
        {
          provide: getRepositoryToken(ProjectResourceAllocation),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Project),

          useValue: {},
        },
        {
          provide: getRepositoryToken(User),
          useValue: userData,
        },
        {
          provide: getRepositoryToken(Task),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Notifications),
          useValue: notificationData,
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
    controller = module.get<NotificationController>(NotificationController);
    service = module.get<NotificationService>(NotificationService);
    notificationRepo = module.get<Repository<Notifications>>(
      getRepositoryToken(Notifications),
    );
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get notification count', () => {
    it('should return 200 with notification count', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      (notificationRepo.count as jest.Mock).mockResolvedValueOnce(1);

      const result = await controller.badgeCountNotification(
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result['count']).toStrictEqual(1);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('catch block get notification count', () => {
    it('should return 200 with notification count', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      (notificationRepo.count as jest.Mock).mockImplementation(() => {
        throw new Error('test error');
      });

      const result = await controller.badgeCountNotification(
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

  describe('get user list notification', () => {
    it('should return 200 with user list', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
      } as unknown as Request;
      (notificationRepo.find as jest.Mock).mockResolvedValueOnce(
        notificationListUserListNotification,
      );
      const result = await controller.getUserNotification(
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(typeof result).toStrictEqual('object');
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('get notification list', () => {
    it('should return 200 with notification list', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        query: {},
      } as unknown as Request;
      let user: GetNotification = {
        user: null,
      };
      (notificationRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method == 'notification') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(2),
              getMany: jest.fn().mockResolvedValue(notificationListGetMany),
            };
          }
          if (method == 'notificationOffset') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockResolvedValue([]),
            };
          }
        },
      );
      const result = await controller.notificationUsers(
        user,
        requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result['dataCount']).toStrictEqual(3);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('get notification list when limit is invalid', () => {
    it('should return 400 when limit is invalid', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        query: { limit: 1.1 },
      } as unknown as Request;
      let user: GetNotification = {
        user: null,
      };

      const result = await service.toGetNotificationService(
        user,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(3073);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('get notification list when limit is > 3000', () => {
    it('should return 400 when limit is > 3000', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        query: { limit: 4000 },
      } as unknown as Request;
      let user: GetNotification = {
        user: null,
      };

      const result = await service.toGetNotificationService(
        user,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(3677);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('get notification list when last data is invalid', () => {
    it('should return 400 when last data is invalid', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        query: { last_data: 'aaaa' },
      } as unknown as Request;
      let user: GetNotification = {
        user: null,
      };

      const result = await service.toGetNotificationService(
        user,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(3071);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('get notification list when last data not found', () => {
    it('should return 400 when last data not found', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        query: { last_data: 12 },
      } as unknown as Request;
      let user: GetNotification = {
        user: null,
      };
      (notificationRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method == 'notificationOffset') {
            return {
              where: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(null),
            };
          }
        },
      );
      const result = await service.toGetNotificationService(
        user,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(3072);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('get notification list filtered by user', () => {
    it('should return 200 with notification list filtered by user', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        query: {},
      } as unknown as Request;
      let user: GetNotification = {
        user: 1,
      };
      (userRepo.findOne as jest.Mock).mockResolvedValueOnce(currentUserObj);
      (notificationRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method == 'notification') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(2),
              getMany: jest.fn().mockResolvedValue(notificationListGetMany),
            };
          }
          if (method == 'notificationOffset') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockResolvedValue([]),
            };
          }
        },
      );
      const result = await service.toGetNotificationService(
        user,
        requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result['dataCount']).toStrictEqual(3);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('get notification list filtered by user not found', () => {
    it('should return 200 with notification list filtered by user not found', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        query: {},
      } as unknown as Request;
      let user: GetNotification = {
        user: 1,
      };
      (notificationRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method == 'notification') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(2),
              getMany: jest.fn().mockResolvedValue(notificationListGetMany),
            };
          }
          if (method == 'notificationOffset') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockResolvedValue([]),
            };
          }
        },
      );
      (userRepo.findOne as jest.Mock).mockResolvedValueOnce(null);
      const result = await service.toGetNotificationService(
        user,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(31);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('get notification list filtered by user and no notification by this user', () => {
    it('should return 200 with notification list filtered by user and no notification by this user', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        query: {},
      } as unknown as Request;
      let user: GetNotification = {
        user: 1,
      };
      (notificationRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method == 'notification') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(2),
              getMany: jest.fn().mockResolvedValue([]),
            };
          }
          if (method == 'notificationOffset') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockResolvedValue([]),
            };
          }
        },
      );
      (userRepo.findOne as jest.Mock).mockResolvedValueOnce(currentUserObj);
      const result = await service.toGetNotificationService(
        user,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(3033);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('get notification list when last data is found', () => {
    it('should return 200 when last data', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        query: { last_data: 56 },
      } as unknown as Request;
      let user: GetNotification = {
        user: null,
      };
      (notificationRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method == 'notification') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              offset: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(2),
              getMany: jest
                .fn()
                .mockResolvedValue([notificationListGetMany[1]]),
            };
          }
          if (method == 'notificationOffset') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(1),
              getOne: jest.fn().mockResolvedValue(1),
            };
          }
        },
      );
      const result = await service.toGetNotificationService(
        user,
        requestMock,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result['dataCount']).toStrictEqual(1);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('catch block count ,', () => {
    it('should return 200 when last data', async () => {
      let requestMock: Request = {
        currentUser: currentUserObj,
        query: { last_data: 56 },
      } as unknown as Request;
      let user: GetNotification = {
        user: null,
      };
      (notificationRepo.createQueryBuilder as jest.Mock).mockImplementation(
        (method) => {
          if (method == 'notification') {
            throw new Error('test error');
          }
          if (method == 'notificationOffset') {
            return {
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getCount: jest.fn().mockResolvedValue(1),
              getOne: jest.fn().mockResolvedValue(1),
            };
          }
        },
      );
      const result = await service.toGetNotificationService(
        user,
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
});
