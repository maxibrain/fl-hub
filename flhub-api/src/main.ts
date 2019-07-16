import { NestFactory, HttpAdapterHost } from '@nestjs/core';
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
  const app = await NestFactory.create(AppModule);
  if (process.env.HOST_CLIENT === '1') {
    Logger.log(`HOST_CLIENT=${process.env.HOST_CLIENT}`, 'Environment');
    Logger.log(`PROJECT_ROOT=${process.env.PROJECT_ROOT}`, 'Environment');
    if (!process.env.PROJECT_ROOT.endsWith('flhub-api')) {
      Logger.warn('PROJECT_ROOT should point to "server" folder. File pathes might be resolved incorrectly', 'Environment');
    }
    const adapterHost = app.get(HttpAdapterHost);
    app.useGlobalFilters(new RedirectToClientFilter(adapterHost.httpAdapter.getInstance()));
  }
  const port = process.env.PORT || 3000;
  Logger.log(`PORT=${port}`, 'Environment');
  await app.listen(port);
}
bootstrap();
