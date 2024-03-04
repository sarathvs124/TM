import { ProjectHistory } from './../Entity/Project_history';
import { PinProject } from './../Entity/Pin_project';

import { User } from '../Entity/User';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';

import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { Project } from '../Entity/Project';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuardMiddleware } from '../Auth/authguard.middleware';
import { ProjectResourceAllocation } from '../Entity/Project_resource_allocation';
import { JwtModule } from '@nestjs/jwt';
import { Task } from '../Entity/Task';
import { Notifications } from '../Entity/Notifications';
import { Folders } from '../Entity/Folders';
import { Roles } from '../Entity/Roles';
import { Files } from '../Entity/Files';
import { Category } from '../Entity/Category';
import { TaskHistory } from '../Entity/Task_History';
import { RecentlyViewed } from '../Entity/Recently_viewed';
import { TaskRelationship } from '../Entity/TaskRelationship';
import { ContentTypeCheckerMiddleware } from '../Auth/contenttype_checker.middleware';
import { LoggerConfig } from '../Util/LoggerService';

const logger: LoggerConfig = new LoggerConfig();
@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProjectResourceAllocation,
      Project,

      User,
      Task,
      Notifications,
      Folders,
      Roles,
      Files,
      PinProject,
      ProjectHistory,
      Category,
      TaskHistory,
      RecentlyViewed,
      TaskRelationship,
    ]),

    JwtModule.register({
      secret: '123456789',
      signOptions: {
        expiresIn: '2d',
      },
    }),
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthGuardMiddleware).forRoutes('project');
    consumer
      .apply(ContentTypeCheckerMiddleware)
      .exclude(
        { path: 'project/(.*)', method: RequestMethod.GET },
        { path: 'project/(.*)', method: RequestMethod.DELETE },
      )
      .forRoutes('project');
  }
}
