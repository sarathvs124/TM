import { getNotificationSchema } from './../Validation-Schema/validation.schema';
import { JoiValidationPipe } from './../Util/validate.pipe';

import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UsePipes,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { NotificationService } from './notification.service';
import { GetNotification } from './Notification.dto';

@Controller('notification')
export class NotificationController {
  constructor(private notification: NotificationService) {}

  @Post()
  @UsePipes(new JoiValidationPipe(getNotificationSchema))
  async notificationUsers(
    @Body() getNotificationDto: GetNotification,
    @Req() req: Request,
    @Res() response: Response,
  ) {
    return this.notification.toGetNotificationService(
      getNotificationDto,
      req,
      response,
    );
  }
  @Get('count')
  async badgeCountNotification(@Req() req: Request, @Res() response: Response) {
    return this.notification.toGetNotificationBadgeService(req, response);
  }
  // Get users list to filter notification
  @Get('getUserNotification')
  async getUserNotification(@Req() req: Request, @Res() response: Response) {
    return this.notification.getUserListNotification(req, response);
  }
}
