import { ProjectHistory } from './../Entity/Project_history';
import { ProjectResourceAllocation } from './../Entity/Project_resource_allocation';
import { TaskHistory } from './../Entity/Task_History';
import { Project } from './../Entity/Project';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskService } from './task.service';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TaskController } from './task.controller';
import { AuthGuardMiddleware } from '../Auth/authguard.middleware';
import { Task } from '../Entity/Task';
import { User } from '../Entity/User';
import { Files } from '../Entity/Files';
import { Notifications } from '../Entity/Notifications';
import { ContentTypeCheckerMiddleware } from '../Auth/contenttype_checker.middleware';
import { Category } from '../Entity/Category';
import { Issue } from '../Entity/Issue';
import { TaskRelationship } from '../Entity/TaskRelationship';
import { RecentlyViewed } from '../Entity/Recently_viewed';
import { Profile } from '../Entity/Profile';
import { Folders } from '../Entity/Folders';
import { PinProject } from '../Entity/Pin_project';
import { Roles } from '../Entity/Roles';

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
      Files,
      Folders,
      Notifications,
      PinProject,
      Category,
      Issue,
      TaskRelationship,
      RecentlyViewed,
      ProjectHistory,
      TaskRelationship,
    ]),
    JwtModule.register({
      secret: '123456789',
      signOptions: {
        expiresIn: '2d',
      },
    }),
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthGuardMiddleware).forRoutes('task');
    consumer
      .apply(ContentTypeCheckerMiddleware)
      .exclude(
        { path: 'task/(.*)', method: RequestMethod.GET },
        { path: 'task/(.*)', method: RequestMethod.DELETE },
        { path: 'task/upload/:task_id', method: RequestMethod.POST },
      )
      .forRoutes('task');
  }
}
