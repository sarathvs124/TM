import { NotificationListViewLoop } from './../views/view';

import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Notifications } from '../Entity/Notifications';
import { Project } from '../Entity/Project';
import { ProjectResourceAllocation } from '../Entity/Project_resource_allocation';
import { Task } from '../Entity/Task';
import { User } from '../Entity/User';
import {
  NOTIFCATION_STATUS,
  SERVICE_EXCEPTION,
  STATUS,
} from '../Enum/Enums.enum';
import { NotificationUserListView } from '../views/view';
import { Repository } from 'typeorm';
import { GetNotification } from './Notification.dto';
import { CustomValidation } from '../Util/custom-validation.schema';
import { isInt } from 'class-validator';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(ProjectResourceAllocation)
    private projectResourceAllocationRepository: Repository<ProjectResourceAllocation>,
    @InjectRepository(Project) private projectRepository: Repository<Project>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Task) private taskRepo: Repository<Task>,
    @InjectRepository(Notifications)
    private notificationRepo: Repository<Notifications>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}
  // to get notifications of a user
  async toGetNotificationService(
    getNotificationDto: GetNotification,
    req: Request,
    response: Response,
  ) {
    try {
      let user_id = getNotificationDto.user;
      this.logger.debug(
        'Get notifications: get notification, User: ' +
          req['currentUser'].user_name,
      );
      let hasNext: any;
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
      let query = this.notificationRepo
        .createQueryBuilder('notification')
        .leftJoinAndSelect(
          'notification.project_id_notification',
          'project_id_notification',
        )
        .leftJoinAndSelect(
          'notification.task_id_notification',
          'task_id_notification',
        )
        .leftJoinAndSelect(
          'notification.user_created_notification',
          'user_created_notification',
        )
        .where('notification.status = :status', {
          status: STATUS.ACTIVE,
        })
        .orderBy('notification.notification_id', 'DESC')
        .andWhere('notification.user_id = :user_id', {
          user_id: req['currentUserId'],
        });
      let queryOffsetQuery = this.notificationRepo
        .createQueryBuilder('notificationOffset')
        .leftJoinAndSelect(
          'notificationOffset.project_id_notification',
          'project_id_notification',
        )
        .leftJoinAndSelect(
          'notificationOffset.task_id_notification',
          'task_id_notification',
        )
        .leftJoinAndSelect(
          'notificationOffset.user_created_notification',
          'user_created_notification',
        )
        .where('notificationOffset.status = :status', {
          status: STATUS.ACTIVE,
        })
        .andWhere('notificationOffset.user_id = :user_id', {
          user_id: req['currentUserId'],
        })
        .orderBy('notificationOffset.notification_id', 'DESC');

      if (user_id != null) {
        let user = await this.userRepo.findOne({ where: { user_id: user_id } });
        if (!user) {
          return response
            .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
            .send(new CustomValidation('user not found'));
        }
        query.andWhere('notification.created_by = :created_by', {
          created_by: user_id,
        });
        queryOffsetQuery.andWhere(
          'notificationOffset.created_by = :created_by',
          {
            created_by: user_id,
          },
        );
        this.logger.debug(
          'Pin project: Filter with user, User: ' +
            req['currentUser'].user_name,
        );
      }
      let total = await query.getCount();
      if (!limit) {
        limit = total;
      }

      if (lastData) {
        let lastValue = await queryOffsetQuery
          .andWhere('notificationOffset.notification_id >=:id', {
            id: lastData,
          })
          .getCount();
        this.logger.debug('Notication: has last data');

        query.offset(lastValue).limit(limit);

        hasNext = total > limit + lastValue;
      } else {
        query.offset(startIndex).limit(limit);
        hasNext = total > limit;
      }

      let notifications = await query.getMany();

      await this.setAsViewed(req['currentUser']);
      let result = new NotificationListViewLoop(notifications);
      if (result.notifications.length < 1) {
        return response
          .status(SERVICE_EXCEPTION.ERROR_RESPONSE)
          .send(new CustomValidation('no notifications by this user'));
      }
      const dataCount = result.notifications.length;
      return response
        .status(SERVICE_EXCEPTION.SUCCESS_RESPONSE)
        .send({ dataCount, total, hasNext, result });
    } catch (error) {
      this.logger.error('get notifications   ' + error);
      return response
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }

  async setAsViewed(user) {
    await this.notificationRepo.update(
      { user_id_notification: user },
      {
        view_status: NOTIFCATION_STATUS.VIEWED,
      },
    );
    this.logger.debug(
      'Get notification: made all the notification of user viewed, User: ' +
        user.user_name,
    );
  }

  async toGetNotificationBadgeService(req: Request, response: Response) {
    try {
      let notification_count = await this.notificationRepo.count({
        where: {
          user_id_notification: req['currentUser'],
          view_status: NOTIFCATION_STATUS.NOTVIEWED,
        },
      });

      return response.status(SERVICE_EXCEPTION.SUCCESS_RESPONSE).send({
        count: notification_count,
        logout: req['currentUser'].change_password_status,
      });
    } catch (error) {
      this.logger.error('count of  notifications   ' + error);
      return response
        .status(SERVICE_EXCEPTION.EXCEPTION_CATCH)
        .send(new CustomValidation('exception caught in catch'));
    }
  }

  async getUserListNotification(req: Request, response: Response) {
    try {
      let notification = await this.notificationRepo.find({
        relations: ['user_created_notification'],
        where: {
          user_id_notification: req['currentUser'],
          status: STATUS.ACTIVE,
        },
      });
      this.logger.debug(
        'Get users list for notification: Took all the notification of that user, length of notification: ' +
          notification.length +
          ' User: ' +
          req['currentUser'].user_name,
      );
      let users = [];
      for (let i in notification) {
        let user = new NotificationUserListView(
          notification[i].user_created_notification,
        );
        if (JSON.stringify(users).includes(JSON.stringify(user))) {
          continue;
        } else {
          if (user.user_name) {
            users.push(user);
          }
        }
      }
      this.logger.debug(
        'Get users list for notification: Filtered users that trigger the notification,count of user is :' +
          users.length +
          ' User: ' +
          req['currentUser'].user_name,
      );
      return response.status(SERVICE_EXCEPTION.SUCCESS_RESPONSE).send(users);
    } catch (error) {
      this.logger.error('count of  notifications   ' + error);
      return response
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
    let lastValue = await this.notificationRepo
      .createQueryBuilder('notificationOffset')
      .where('notificationOffset.notification_id =:id', {
        id: req.query.last_data,
      })
      .getOne();

    if (!lastValue) {
      return 2;
    }
  }
}
