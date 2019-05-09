import { NestFactory, HTTP_SERVER_REF } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import * as path from 'path';
import * as dotEnv from 'dotenv';
import { AppModule } from './app.module';
import { RedirectToClientFilter } from './static/redirect-client.filter';

async function bootstrap() {
  dotEnv.config();
  if (!process.env.PROJECT_ROOT) {
    const dots = __dirname.includes('dist') ? '../..' : '..';
    process.env.PROJECT_ROOT = path.resolve(__dirname, dots);
  }
  Logger.log(`PROJECT_ROOT=${process.env.PROJECT_ROOT}`, 'Environment');
  if (!process.env.PROJECT_ROOT.endsWith('server')) {
    Logger.warn('PROJECT_ROOT should point to "server" folder. File pathes might be resolved incorrectly', 'Environment');
  }
  const app = await NestFactory.create(AppModule);
  const httpRef = app.get(HTTP_SERVER_REF);
  app.useGlobalFilters(new RedirectToClientFilter(httpRef));
  const port = process.env.PORT || 3000;
  Logger.log(`PORT=${port}`, 'Environment');
  await app.listen(port);
}
bootstrap();
