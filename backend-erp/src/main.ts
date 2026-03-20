import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 1. Security Headers (disable CSP for image serving)
  app.use(helmet({ contentSecurityPolicy: false }));

  const logger = new Logger('Bootstrap');

  const allowedOrigins: (string | RegExp)[] = [
    'http://localhost:3001',
    'http://localhost:3000',
    'https://endorfinaexpress.netlify.app',
    'https://endorfinaexpress.com',
    'https://www.endorfinaexpress.com',
    /\.railway\.app$/,
  ];

  if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
  }

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // Logger simple para ver peticiones en Railway con tipos explícitos
  app.use((req: Request, res: Response, next: NextFunction) => {
    logger.log(`[${req.method}] ${req.url}`);
    next();
  });

  // 3. Serve uploaded files statically at /uploads
  const uploadsDir = join(process.cwd(), 'uploads');
  if (!existsSync(uploadsDir)) mkdirSync(uploadsDir, { recursive: true });
  app.useStaticAssets(uploadsDir, { prefix: '/uploads' });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
