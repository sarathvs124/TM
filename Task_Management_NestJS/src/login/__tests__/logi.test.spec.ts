import { role1 } from '../../Files/__tests__/data';
import { LoginController } from '../login.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { LoginService } from '../login.service';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { Repository } from 'typeorm';
import { User } from '../../Entity/User';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Status } from '../../Entity/Status';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { Roles } from 'src/Entity/Roles';
import { PasswordDto, ValidateEmailDto } from '../login.dto';

describe('SampleController', () => {
  let controller: LoginController;
  let repository: Repository<User>;
  let service: LoginService;
  let rolerepository: Repository<Roles>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoginController],
      providers: [
        LoginService,
        JwtService,
        {
          provide: JwtService,
          useValue: {
            sign: (payload: any) => jwt.sign(payload, '123456789'),
            verify: (token: string) => jwt.verify(token, '123456789'),
            decode: (token: string) => jwt.decode(token),
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
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockImplementation((options: any) => {
              if (
                options.where.email === 'test@example.com' ||
                options.where.password_token ===
                  ('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicHVycG9zZSI6IlJFU0VUX1BBU1NXT1JEX1RPS0VOIiwiaWF0IjoxNjgwMTY5OTQ3LCJleHAiOjE2ODAzNDI3NDd9.89efEccIGH2Bfgn-pMj-79kFZxAmQC-LwgoRWIpi5eo' ||
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicHVycG9zZSI6IlJFU0VUX1BBU1NXT1JEX1RPS0VOIiwiaWF0IjoxNjgwMTUxMzYxLCJleHAiOjE2ODAxNTE2NjF9.giyJxM0epadQrxDwwx804cpmGy66MtP5MJve9yN0saA')
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
                    status: 1,
                    created_date: new Date('2023-01-02T18:30:00.000Z'),
                    updated_date: new Date('2023-01-02T18:30:00.000Z'),
                    authority: 1,
                  },
                  last_login: 1,
                  change_password_status: 1,
                  new_user: 0,
                };
              } else if (options.where.password_token == mockToken) {
                return {
                  user_id: 1,
                  email: 'testx@example.com',
                  password:
                    '$2b$10$5iC4f./ytO3zDfVqsYeHGuHJVWwtZp/Qo7zZksXfFXiyklAd5Ajxu',
                  status: Status.ACTIVE,
                  user_name: 'Hemandh',
                  role: {
                    role_id: 1,
                    role_name: 'Admin',
                    status: 1,
                    created_date: new Date('2023-01-02T18:30:00.000Z'),
                    updated_date: new Date('2023-01-02T18:30:00.000Z'),
                    authority: 1,
                  },
                  last_login: 1,
                  change_password_status: 1,
                  new_user: 0,
                };
              } else {
                return null;
              }
            }),
            save: jest.fn().mockImplementation(() => {
              return true;
            }),
            find: jest.fn().mockImplementation(() => {
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
                  status: 1,
                  created_date: new Date('2023-01-02T18:30:00.000Z'),
                  updated_date: new Date('2023-01-02T18:30:00.000Z'),
                  authority: 1,
                },
                last_login: 1,
                change_password_status: 1,
              };
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

    controller = module.get<LoginController>(LoginController);
    service = module.get<LoginService>(LoginService);
  });
  const payload = {
    id: 1,
    purpose: 'RESET_PASSWORD_TOKEN',
    role: role1.role_id,
  };
  let secretKey = '123456789';
  const mockToken = jwt.sign(payload, secretKey);
  const requestMock: Request<any, any, any, any, any> =
    {} as unknown as Request;

  const responseMock: Response = {
    status: jest.fn((x) => statusResponseMock),
    send: jest.fn((x) => x),
  } as unknown as Response;
  const statusResponseMock = {
    send: jest.fn((x) => x),
  };
  let accessToken;
  let refreshToken;

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should be defined', () => {
    expect(controller.userLogin).toBeDefined();
  });

  describe('login', () => {
    it('returns JWT token for valid credentials', async () => {
      const user = { email: 'test@example.com', password: 'Hmd@12345' };
      const result = await controller.userLogin(
        user,
        requestMock,
        responseMock,
      );
      expect(result).toBeDefined();
      expect(result.accessToken).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('use has be login', () => {
    it('returns JWT token for valid credentials', async () => {
      const user = { email: 'test@example.com', password: 'Hmd@12345' };
      const result = await service.login(user, requestMock, responseMock);

      accessToken = result.accessToken;
      refreshToken = result.refreshToken;

      expect(result).toBeDefined();
      expect(result.accessToken).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });
  describe('wrong password', () => {
    it('returns JWT token for valid credentials', async () => {
      const user = { email: 'test@example.com', password: 'Hmd@1w2345' };
      const result = await service.login(user, requestMock, responseMock);

      expect(result).toStrictEqual({
        errorMessage: 'Wrong password',
        statusCode: 11,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
  describe('user doesnt exist in the mock', () => {
    it('returns JWT token for valid credentials', async () => {
      const user1 = { email: 'test4@example.com', password: 'Hmd@12345' };
      const result = await service.login(user1, requestMock, responseMock);
      expect(result).toBeDefined();
      expect(result).toStrictEqual({
        errorMessage: 'User not found',
        statusCode: 31,
      });
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('forgot password email validation', () => {
    it('should get 200 success response', async () => {
      const email: ValidateEmailDto = { email: 'test@example.com' };
      const result = await controller.validateEmail(email, responseMock);

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(200);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('forgot password email validation', () => {
    it('should get 200 success response', async () => {
      const email: ValidateEmailDto = { email: 'test@example.com' };
      const result = await service.emailValidation(email, responseMock);

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(200);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('invalid email in forgot password email validation', () => {
    it('should get 400 when email does not exist', async () => {
      const email: ValidateEmailDto = { email: 'test4@example.com' };
      const result = await service.emailValidation(email, responseMock);

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(31);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('reset password', () => {
    it('should get 400 for invalid token', async () => {
      const password: PasswordDto = { newPassword: 'Hmd@12346' };
      const result = await controller.setPassword(
        'asd1dd2ft6g77js99-snj9s',
        password,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(27);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('reset password', () => {
    it('should get 400 when wrong token is passed', async () => {
      const password: PasswordDto = { newPassword: 'Hmd@12346' };
      const result = await service.resetPassword(
        refreshToken,
        password,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(25);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('Reset password  success case', () => {
    it('Reset password  success case', async () => {
      const password: PasswordDto = { newPassword: 'Hmd@12346' };
      let token = mockToken;
      const result = await service.resetPassword(token, password, responseMock);
      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(200);
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('reset password', () => {
    it('should get 400 when invalid token is passed', async () => {
      const password: PasswordDto = { newPassword: 'Hmd@12346' };
      let token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCz6MSwicHVycG9zZSI6IlJFU0VUX1BBU1NXT1JEX1RPS0VOIiwiaWF0IjoxNjgwMTY5OTQ3LCJleHAiOjE2ODAzNDI3NDd9.89efEccIGH2Bfgn-pMj-79kFZxAmQC-LwgoRWIpi5eo';
      const result = await service.resetPassword(token, password, responseMock);

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(27);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('reset password', () => {
    it('should get 400 when invalid token is passed', async () => {
      const password: PasswordDto = { newPassword: 'Hmd@12346' };
      let token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicHVycG9zZSI6IlJFU0VUX1BBU1NXT1JEX1RPS0VOIiwiaWF0IjoxNjgwMTUxMzYxLCJleHAiOjE2ODAxNTE2NjF9.giyJxM0epadQrxDwwx804cpmGy66MtP5MJve9yN0saA';
      const result = await service.resetPassword(token, password, responseMock);

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(23);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('refresh access token', () => {
    it('should return 200 when valid refresh token is passed', async () => {
      const refreshTokenBody = { refresh_token: refreshToken };
      const result = await controller.refreshedAccessToken(
        refreshTokenBody,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('refresh access token', () => {
    it('should return 200 when valid refresh token is passed', async () => {
      const refreshTokenBody = { refresh_token: refreshToken };
      const result = await service.getRefreshedAccessToken(
        refreshTokenBody,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(responseMock.status).toHaveBeenCalledWith(200);
    });
  });

  describe('refresh access token', () => {
    it('should return 400 when wrong token is passed', async () => {
      const refreshTokenBody = { refresh_token: accessToken };
      const result = await service.getRefreshedAccessToken(
        refreshTokenBody,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.statusCode).toStrictEqual(124);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('refresh access token', () => {
    it('should return 400 when invalid token is passed', async () => {
      const refreshTokenBody = { refresh_token: 'hh11hg2gh3g4j5jn6knknk7n7' };
      const result = await service.getRefreshedAccessToken(
        refreshTokenBody,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.status).toStrictEqual(398);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('refresh access token', () => {
    it('should return 400 when invalid token is passed', async () => {
      const refreshTokenBody = {
        refresh_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6MSwicHVycG9zZSI6IkFDQ0VTU19UT0tFTiIsImlhdCI6MTY3OTk3ODgxOCwiZXhwIjoxNjc5OTk2ODE4fQ.JYxiYU4e1sNvtwEo1sqE0wgsEcjbnfH2SDEJbRHG7kI',
      };
      const result = await service.getRefreshedAccessToken(
        refreshTokenBody,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.status).toStrictEqual(398);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('refresh access token', () => {
    it('should return 400 when invalid token is passed', async () => {
      const refreshTokenBody = {
        refresh_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6MSwicHVycG9zZSI6IkFDQ0VTU19UT0tFTiIsImlhdCI6MTY3OTk3ODgxOCwiZXhwIjoxNjc5OTk2ODE4fQ.JYxiYU4e1sNvtwEo1sqE0wgsEcjbnfH2SDEJbRHG7kI',
      };
      const result = await service.getRefreshedAccessToken(
        refreshTokenBody,
        responseMock,
      );

      expect(result).toBeDefined();
      expect(result.status).toStrictEqual(398);
      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
});
