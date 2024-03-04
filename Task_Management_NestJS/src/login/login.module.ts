import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentTypeCheckerMiddleware } from '../Auth/contenttype_checker.middleware';
import { User } from '../Entity/User';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: '123456789',
    }),
  ],
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ContentTypeCheckerMiddleware).forRoutes('login');
  }
}
