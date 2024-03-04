import { STATUS } from '../Enum/Enums.enum';
import { JwtService } from '@nestjs/jwt';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../Entity/User';
import { Repository } from 'typeorm';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    let accessToken = request.headers['x-access-token'];
    if (request.headers['content-type'] == 'multipart/form-data') {
      if (
        request.headers['content-type'] !=
        'multipart/form-data; boundary=<calculated when request is sent>'
      ) {
        throw new HttpException(
          'proper content_type with boundary data should be given',
          350,
        );
      }
    }
    if (!accessToken) {
      return next.handle();
    } else {
      let user_id = this.jwtService.decode(accessToken)['id'];
      if (user_id) {
        const user = await this.userRepo.findOne({
          relations: ['role'],
          where: { user_id, status: STATUS.ACTIVE },
        });
        if (!user) {
          throw new HttpException('Unauthorized access', 399);
        } else {
          request.currentUser = user;
          request.currentUserId = user.user_id;

          return next.handle();
        }
      }
    }
  }
}
