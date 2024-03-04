import { ContentTypeCheckerMiddleware } from '../Auth/contenttype_checker.middleware';
import { ProjectResourceAllocation } from './../Entity/Project_resource_allocation';
import { Task } from '../Entity/Task';
import { Project } from '../Entity/Project';
import { User } from '../Entity/User';
import { AuthGuardMiddleware } from '../Auth/authguard.middleware';
import { Files } from './../Entity/Files';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Folders } from './../Entity/Folders';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TaskHistory } from '../Entity/Task_History';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Folders,
      Files,
      User,
      Project,
      Task,
      ProjectResourceAllocation,
      TaskHistory,
    ]),
    JwtModule.register({
      secret: '123456789',
      signOptions: {
        expiresIn: '2d',
      },
    }),
  ],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthGuardMiddleware).forRoutes('files');
    consumer
      .apply(ContentTypeCheckerMiddleware)
      .exclude(
        { path: 'files/(.*)', method: RequestMethod.GET },
        { path: 'files/(.*)', method: RequestMethod.DELETE },
      )
      .forRoutes('files');
  }
}
