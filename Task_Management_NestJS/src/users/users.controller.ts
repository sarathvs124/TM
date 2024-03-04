import { JoiValidationPipe } from '../Util/validate.pipe';
import { Roles } from '../Auth/roles.decorator';
import { Role } from '../Enum/Role.enum';

import {
  Controller,
  Post,
  UsePipes,
  Body,
  Req,
  Get,
  Param,
  Put,
  ValidationPipe,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Logger,
  Inject,
  Res,
} from '@nestjs/common';
import {
  userSchema,
  changePasswordSchema,
  userEditSchema,
} from '../Validation-Schema/validation.schema';
import {
  UserProfile,
  UserCreateDto,
  ChangePasswordDto,
  UserEditCreateDto,
} from './user.dto';
import { UsersService } from './users.service';
import { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { Env } from '../environment';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
const crypto = require('crypto-extra');
let encode: any;
let uniquFileName: any;

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}
  //Get coworkers list
  @Get('/getCoworkers')
  coworkerList(@Req() req: Request, @Res() response: Response) {
    return this.usersService.getCoworkerList(req, response);
  }

  //Get user activity
  @Get('/getActivity')
  userActivity(@Req() req: Request, @Res() response: Response) {
    return this.usersService.getUserActivity(req, response);
  }

  @Get('projectrolelist')
  @Roles(Role.ADMIN, Role.USER)
  getProjectRoleList(@Res() response: Response) {
    return this.usersService.getProjectRoleList(response);
  }
  @Get('rolelist')
  @Roles(Role.ADMIN, Role.USER)
  getRoleList(@Res() response: Response) {
    return this.usersService.getRoleList(response);
  }

  @Get('/getProfile')
  async getProfile(@Req() req: Request, @Res() response: Response) {
    return this.usersService.getProfile(req, response);
  }

  @Get('/getRoles')
  @Roles(Role.ADMIN)
  async getRoles(@Req() req: Request, @Res() response: Response) {
    return this.usersService.getRoles(req, response);
  }
  //change password
  @Post('/changePassword')
  @Roles(Role.ADMIN, Role.USER)
  @UsePipes(new JoiValidationPipe(changePasswordSchema))
  async changePassword(
    @Body()
    changePasswordDto: ChangePasswordDto,
    @Req() req: Request,
    @Res() response: Response,
  ) {
    return this.usersService.changePasswordService(
      changePasswordDto,
      req,
      response,
    );
  }

  @Get()
  @Roles(Role.ADMIN)
  async getUsers(@Req() req: Request, @Res() response: Response) {
    return this.usersService.getUsersList(req, response);
  }

  //add a user
  @Post()
  @Roles(Role.ADMIN)
  @UsePipes(new JoiValidationPipe(userSchema))
  async addUser(
    @Body(new ValidationPipe({ transform: true })) userCreateDto: UserCreateDto,
    @Req() req: Request,
    @Res() response: Response,
  ) {
    return this.usersService.addUserService(userCreateDto, req, response);
  }
  @Put(':id')
  @Roles(Role.ADMIN)
  @UsePipes(new JoiValidationPipe(userEditSchema))
  async editUser(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ transform: true }))
    userEditDto: UserEditCreateDto,
    @Req() req: Request,
    @Res() response: Response,
  ) {
    return this.usersService.editUserService(id, userEditDto, req, response);
  }
  @Get(':id')
  async getUserById(
    @Param('id', ParseIntPipe) id: number,
    @Res() response: Response,
  ) {
    return this.usersService.getUserByService(id, response);
  }
  @Delete('confirmdelete/:id')
  @Roles(Role.ADMIN)
  async forceDeleteUser(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @Res() response: Response,
  ) {
    return this.usersService.permanentDeleteUserService(id, req, response);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @Res() response: Response,
  ) {
    return this.usersService.deleteUserService(id, req, response);
  }

  // profile image upload

  @Post('/imageUpload')
  @Roles(Role.ADMIN, Role.USER)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: function (req, file, callback) {
          let directory = Env.IMG_URL;
          callback(null, directory);
        },

        filename: async function (req, file, callback) {
          encode = crypto.randomString();
          uniquFileName =
            encode + '_' + Date.now() + path.extname(file.originalname);
          if (
            file.mimetype == 'image/png' ||
            file.mimetype == 'image/jpg' ||
            file.mimetype == 'image/jpeg'
          ) {
            callback(null, uniquFileName);
          }
        },
      }),
      fileFilter: async function (req, file, callback) {
        encode = crypto.randomString();
        uniquFileName =
          encode + '_' + Date.now() + path.extname(file.originalname);
        if (
          file.mimetype != 'image/png' &&
          file.mimetype != 'image/jpg' &&
          file.mimetype != 'image/jpeg'
        ) {
          req.fileValidationError = 'goes wrong on the mimetype';

          callback(
            new BadRequestException({
              errorMessage:
                'Invalid fileType only supports(jpeg,jpg,png)formats',
              statusCode: 710,
            }),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async uploadedFile(
    @Req() req: Request,
    @UploadedFile() file,
    @Body() body: UserProfile,
    @Res() response: Response,
  ) {
    let maxSize = 10485760;
    return this.usersService.uploadImageFile(
      file,
      req,
      uniquFileName,
      maxSize,
      body,
      response,
    );
  }

  // Get allocated project of a user
  @Get('/getAllocatedProjects/:user_id')
  getAllocatedProjects(
    @Param('user_id', ParseIntPipe) user_id: number,
    @Res() response: Response,
  ) {
    return this.usersService.getAllocatedProjects(user_id, response);
  }
}
