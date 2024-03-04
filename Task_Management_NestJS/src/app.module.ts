import { ProjectHistory } from './Entity/Project_history';
import { FilesModule } from './Files/files.module';
import { NotificationModule } from './notification/notification.module';
import { NotificationController } from './notification/notification.controller';
import { TaskService } from './Task/task.service';
import { AdminModule } from './admin/admin.module';
import { ProjectModule } from './Project/project.module';
import { TaskModule } from './Task/task.module';
import { Roles } from './Entity/Roles';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { Files } from './Entity/Files';
import { RolesGuard } from './Auth/roles.guard';
import { Organization } from './Entity/Organization';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Profile } from './Entity/Profile';
import { User } from './Entity/User';
import { LoginModule } from './login/login.module';
import { JwtModule } from '@nestjs/jwt';
import { Project } from './Entity/Project';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { CurrentUserInterceptor } from './Auth/currentuser.interceptor';
import { ProjectResourceAllocation } from './Entity/Project_resource_allocation';
import { Task } from './Entity/Task';
import { Folders } from './Entity/Folders';
import { LoginController } from './login/login.controller';
import { LoginService } from './login/login.service';
import { ProjectController } from './Project/project.controller';
import { ProjectService } from './Project/project.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskHistory } from './Entity/Task_History';
import { FilesService } from './Files/files.service';
import { FilesController } from './Files/files.controller';
import { NotificationService } from './notification/notification.service';
import { Notifications } from './Entity/Notifications';
import { Env } from './environment';
import { LoggerConfig } from './Util/LoggerService';
import { WinstonModule } from 'nest-winston';

import { PinProject } from './Entity/Pin_project';
import { Category } from './Entity/Category';
import { Issue } from './Entity/Issue';
import { TaskRelationship } from './Entity/TaskRelationship';
import { RecentlyViewed } from './Entity/Recently_viewed';
const logger: LoggerConfig = new LoggerConfig();
@Module({
  imports: [
    FilesModule,
    NotificationModule,
    AdminModule,
    WinstonModule.forRoot(logger.console()),
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
          user: 'taskmanagementdev@gmail.com',
          pass: 'kbpppsyqbjdfcvfh',
        },
      },
      template: {
        dir: join(__dirname, '..', 'src', 'mails'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    ProjectModule,
    // ConfigModule.forRoot({
    //   envFilePath:'.env'
    // }),
    TaskModule,
    UsersModule,
    ScheduleModule.forRoot(),
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
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: Env.HOST,
      username: Env.USER_NAME,
      password: Env.PASSWORD,
      database: Env.DB_NAME,

      entities: [
        User,
        Profile,
        Organization,
        Project,
        ProjectResourceAllocation,
        Task,
        Folders,
        Files,
        Roles,
        TaskHistory,
        Notifications,
        PinProject,
        Category,
        Issue,
        TaskRelationship,
        RecentlyViewed,
        ProjectHistory,
      ],
      synchronize: true,
    }),
    JwtModule.register({
      secret: '123456789',
      signOptions: {
        expiresIn: '2d',
      },
    }),
    LoginModule,
  ],

  controllers: [
    NotificationController,
    UsersController,
    LoginController,
    AppController,
    ProjectController,
    FilesController,
  ],
  providers: [
    UsersService,
    AppService,
    LoginService,
    ProjectService,
    TaskService,
    FilesService,
    ProjectResourceAllocation,

    NotificationService,
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_INTERCEPTOR, useClass: CurrentUserInterceptor },
  ],
})
export class AppModule {}
