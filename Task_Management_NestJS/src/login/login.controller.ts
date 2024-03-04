import {
  validateEmail,
  setPasswordForgotPassword,
  refreshTokenValidate,
} from './../Validation-Schema/validation.schema';

import { JoiValidationPipe } from './../Util/validate.pipe';
import { loginSchema } from '../Validation-Schema/validation.schema';
import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  Req,
  Res,
  UsePipes,
} from '@nestjs/common';
import {
  LoginDto,
  ValidateEmailDto,
  PasswordDto,
  RefreshTokenDto,
} from './login.dto';
import { LoginService } from './login.service';
import { Request, Response } from 'express';

@Controller('login')
export class LoginController {
  constructor(private loginService: LoginService) {}

  @Post()
  @UsePipes(new JoiValidationPipe(loginSchema))
  async userLogin(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
    @Res() response: Response,
  ) {
    return this.loginService.login(loginDto, req, response);
  }

  @Post('/forgotPassword/emailValidation')
  @UsePipes(new JoiValidationPipe(validateEmail))
  async validateEmail(
    @Body() validateEmails: ValidateEmailDto,
    @Res() response: Response,
  ) {
    return this.loginService.emailValidation(validateEmails, response);
  }

  @Put('forgotPassword/setNewPassword/:token')
  @UsePipes(new JoiValidationPipe(setPasswordForgotPassword))
  async setPassword(
    @Param('token') token: string,
    @Body() passwordDtos: PasswordDto,
    @Res() response: Response,
  ) {
    return this.loginService.resetPassword(token, passwordDtos, response);
  }

  @Put('refresh')
  @UsePipes(new JoiValidationPipe(refreshTokenValidate))
  async refreshedAccessToken(
    @Body() refreshTokenDtos: RefreshTokenDto,
    @Res() response: Response,
  ) {
    return this.loginService.getRefreshedAccessToken(
      refreshTokenDtos,
      response,
    );
  }
}
