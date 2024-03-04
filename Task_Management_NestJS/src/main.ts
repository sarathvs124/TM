import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Env } from './environment';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:8081',
      'https://dev-tm.innovaturelabs.com',
      'https://stg-tm.innovaturelabs.com',
      'https://prod-tm.innovaturelabs.com',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.disable('x-powered-by');
  app.use(helmet.hsts({ maxAge: 300, includeSubDomains: true, preload: true }));

  app.use((request, response, next) => {
    response.set('X-Content-Type-Options', 'nosniff');
    response.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    next();
  });

  await app.listen(Env.PORT);
}

bootstrap();
