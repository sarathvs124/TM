import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class ContentTypeCheckerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    if (req.headers['content-type'] != 'application/json') {
      return res
        .status(400)
        .send({ errorMessage: 'Content type should be json', statusCode: 400 });
    }
    next();
  }
}
