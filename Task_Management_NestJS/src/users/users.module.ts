import { ContentTypeCheckerMiddleware } from '../Auth/contenttype_checker.middleware';
import { Project } from './../Entity/Project';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuardMiddleware } from '../Auth/authguard.middleware';
import { Profile } from '../Entity/Profile';
import { ProjectResourceAllocation } from '../Entity/Project_resource_allocation';
import { Roles } from '../Entity/Roles';
import { User } from '../Entity/User';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TaskHistory } from '../Entity/Task_History';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Profile,
      Roles,
      ProjectResourceAllocation,
      Project,
      TaskHistory,
    ]),
    JwtModule.register({
      secret: '123456789',
      signOptions: {
        expiresIn: '2d',
      },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthGuardMiddleware).forRoutes('users');
    consumer
      .apply(ContentTypeCheckerMiddleware)
      .exclude(
        { path: 'users/(.*)', method: RequestMethod.GET },
        { path: 'users', method: RequestMethod.GET },
        { path: 'users/(.*)', method: RequestMethod.DELETE },
        { path: 'users/upload', method: RequestMethod.POST },
        { path: 'users/imageUpload', method: RequestMethod.POST },
      )
      .forRoutes('users');
  }
}
