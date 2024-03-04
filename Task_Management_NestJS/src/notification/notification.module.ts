import { NotificationService } from './notification.service';

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notifications } from '../Entity/Notifications';
import { Profile } from '../Entity/Profile';
import { Project } from '../Entity/Project';
import { ProjectResourceAllocation } from '../Entity/Project_resource_allocation';
import { Roles } from '../Entity/Roles';
import { Task } from '../Entity/Task';
import { TaskHistory } from '../Entity/Task_History';
import { User } from '../Entity/User';
import { AuthGuardMiddleware } from '../Auth/authguard.middleware';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Profile,
      Task,
      Roles,
      Project,
      ProjectResourceAllocation,
      TaskHistory,
      Notifications,
    ]),
    JwtModule.register({
      secret: '123456789',
      signOptions: {
        expiresIn: '2d',
      },
    }),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthGuardMiddleware).forRoutes('notification');
  }
}
