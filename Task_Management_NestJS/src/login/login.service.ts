import { Env } from './../environment';
import {
  CHANGE_PASSWORD_STATUS,
  SERVICE_EXCEPTION,
} from './../Enum/Enums.enum';
import { MailerService } from '@nestjs-modules/mailer';
import { STATUS } from '../Enum/Enums.enum';
import { CustomValidation } from './../Util/custom-validation.schema';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../Entity/User';
import { Repository } from 'typeorm';
import {
  LoginDto,
  ValidateEmailDto,
  PasswordDto,
  RefreshTokenDto,
} from './login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginView } from '../views/view';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Response } from 'express';
@Injectable()
export class LoginService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private mailService: MailerService,
  ) {}

  // Login
  async login(loginDto: LoginDto, req, response) {
    try {
      const user = await this.userRepository.findOne({
        relations: ['role'],
        where: { email: loginDto.email.toLowerCase(), status: STATUS.ACTIVE },
      });
      this.logger.debug('login in login service  ,   ' + user);

      if (!user) {
        let responseObj = new CustomValidation('user not found');
        return response
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(responseObj);
      } else {
        if (!(await bcrypt.compare(loginDto.password, user.password))) {
          return response
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('wrong password'));
        } else {
          if (user.new_user == 0) {
            user.new_user = 1;
            user.updated_date = new Date();
          }

          let accessToken = this.jwtService.sign(
            {
              id: user.user_id,
              role: user.role.role_id,
              purpose: 'ACCESS_TOKEN',
            },
            { expiresIn: Env.ACCESS_TOKEN_EXPIRY },
          );
          let refreshToken = this.jwtService.sign(
            {
              id: user.user_id,
              role: user.role.role_id,
              purpose: 'REFRESH_TOKEN',
            },
            { expiresIn: Env.REFRESH_TOKEN_EXPIRY },
          );
          let now = Math.floor(Date.now() / 1000);
          user.last_login = now;
          user.change_password_status = CHANGE_PASSWORD_STATUS.NORMAL;
          await this.userRepository.save(user);
          return response
            .status(SERVICE_EXCEPTION.SUCCESS_RESPONSE)
            .send(new LoginView(user, accessToken, refreshToken));
        }
      }
    } catch (error) {
      this.logger.error('login in login service  ,   ' + error);

      return response
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }

  //Email validation for forgot password
  async emailValidation(ValidateEmail: ValidateEmailDto, response: Response) {
    try {
      let user = await this.userRepository.findOne({
        where: {
          email: ValidateEmail.email.toLowerCase(),
          status: STATUS.ACTIVE,
        },
      });
      if (!user) {
        return response
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('user not found'));
      } else {
        let resetToken = this.jwtService.sign(
          {
            id: user.user_id,
            role: user.role,
            purpose: 'RESET_PASSWORD_TOKEN',
          },
          { expiresIn: Env.FORGOT_PASSWORD_TOKEN_EXPIRY },
        );
        user.password_token = resetToken;
        if (await this.userRepository.save(user)) {
          try {
            let url = Env.URL.toString();
            // await this.mailService.sendMail({
            //   to: user.email,
            //   from: 'taskmanagementdev@gmail.com',
            //   subject: 'Forgot password !!',
            //   text: 'xxxxxxxxxxxx',
            //   template: 'forgot_password',
            //   context: {
            //     forgot_password: {
            //       token: url + `reset/${resetToken}`,
            //     },
            //   },
            // });
          } catch (error) {
            return response
              .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
              .send(
                new CustomValidation('getaddrinfo EAI_AGAIN smtp.gmail.com'),
              );
          }
          return response
            .status(SERVICE_EXCEPTION.SUCCESS_RESPONSE)
            .send({ successMessage: 'Mali sent', statusCode: 200 });
        } else {
          return response
            .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
            .send(new CustomValidation('process failed'));
        }
      }
    } catch (error) {
      this.logger.error('email validation  in login service  ,   ' + error);
      return response
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }

  //Reset password for forgot password
  async resetPassword(
    resetToken: string,
    newPasswordDetails: PasswordDto,
    response: Response,
  ) {
    try {
      let verifiedToken = await this.jwtService.verify(resetToken);
      if (!verifiedToken) {
        return response
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('invalid token'));
      }
      let decodedToken = this.jwtService.decode(resetToken);
      if (decodedToken['purpose'] == 'RESET_PASSWORD_TOKEN') {
        let user = await this.userRepository.findOne({
          where: { password_token: resetToken },
        });
        if (user) {
          let salt: any;
          try {
            salt = await bcrypt.genSalt(10);
          } catch (error) {
            return response
              .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
              .send(new CustomValidation('invalid token'));
          }
          user.password = await bcrypt.hash(
            newPasswordDetails.newPassword,
            salt,
          );
          user.password_token = null;
          this.userRepository.save(user);
          return response.status(SERVICE_EXCEPTION.SUCCESS_RESPONSE).send({
            successMessage: 'Password successfully changed',
            statusCode: 200,
          });
        } else {
          return response
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('invalid token'));
        }
      } else {
        return response
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('wrong purpose of token'));
      }
    } catch (error) {
      try {
        if (error.message == 'jwt expired') {
          return response
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('token expired'));
        } else {
          return response
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('invalid token'));
        }
      } catch (err) {
        this.logger.error('resetPassword  in login service  ,   ' + err);
        return response
          .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
          .send(new CustomValidation('exception caught in catch'));
      }
    }
  }

  async getRefreshedAccessToken(
    refreshTokenDetails: RefreshTokenDto,
    response: Response,
  ) {
    try {
      let token = refreshTokenDetails.refresh_token;
      try {
        const decoded = this.jwtService.verify(token, { secret: '123456789' });
        if (decoded['purpose'] != 'REFRESH_TOKEN') {
          return response
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('wrong token'));
        } else {
          let accessToken = this.jwtService.sign(
            {
              id: decoded['id'],
              role: decoded['role'],
              purpose: 'ACCESS_TOKEN',
            },
            { expiresIn: '5h' },
          );
          return response
            .status(SERVICE_EXCEPTION.SUCCESS_RESPONSE)
            .send({ accessToken: accessToken, refreshToken: token });
        }
      } catch (err) {
        if (err.message == 'invalid signature') {
          return response
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send({ errorMessage: 'Not Valid Token', status: 398 });
        } else if (err.message == 'jwt expired') {
          return response
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send({ errorMessage: 'Token Has been Expired', status: 398 });
        } else {
          return response
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send({ errorMessage: 'Invalid Token', status: 398 });
        }
      }
    } catch (error) {
      this.logger.error('refresh token  in login service  ,   ' + error);
      return response
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }
}
