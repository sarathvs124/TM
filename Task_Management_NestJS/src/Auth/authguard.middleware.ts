import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

@Injectable()
export class AuthGuardMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}
  use(req: Request, res: Response, next: Function) {
    const token =
      req.body.token || req.query.token || req.headers['x-access-token'];
    if (!token) {
      return res.status(401).send({
        errorMessage: 'A token is required for authentication',
        status: 401,
      });
    } else {
      try {
        const decoded = this.jwtService.verify(token, { secret: '123456789' });
        if (decoded['purpose'] == 'ACCESS_TOKEN') {
          req.user = decoded;
        } else {
          return res
            .status(403)
            .send({ errorMessage: 'Wrong token', statusCode: 403 });
        }
      } catch (err) {
        if (err.message == 'invalid signature') {
          return res
            .status(403)
            .send({ errorMessage: 'Not Valid Token', statusCode: 403 });
        } else if (err.message == 'jwt expired') {
          return res
            .status(403)
            .send({ errorMessage: 'Token Has been Expired', statusCode: 403 });
        } else {
          return res
            .status(403)
            .send({ errorMessage: 'Invalid Token', statusCode: 403 });
        }
      }
    }

    next();
  }
}
