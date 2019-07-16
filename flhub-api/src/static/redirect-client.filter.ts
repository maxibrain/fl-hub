import { ArgumentsHost, Catch, HttpServer, Inject, NotFoundException, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import * as path from 'path';
import * as fs from 'fs';

const fileExtRx: RegExp = /\.[\w\d]+$/i;

@Catch(NotFoundException)
export class RedirectToClientFilter extends BaseExceptionFilter {
  private readonly clientRootPath: string;

  constructor(applicationRef: HttpServer) {
    super(applicationRef);
    this.clientRootPath = path.resolve(process.env.PROJECT_ROOT, process.env.CLIENT_ROOT_PATH || '../flhub-client/dist/flhub-client');
    Logger.log(`Client root path=${this.clientRootPath}`, 'Environment');
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const req = ctx.getRequest();
    const reqPath = req.path as string;

    if (reqPath && reqPath.startsWith('/api')) {
      // API 404, serve default nest 404:
      // super.catch(exception, host);
      throw exception;
    } else {
      if (fileExtRx.test(reqPath)) {
        const filePath = path.resolve(this.clientRootPath, reqPath.replace(/^\/+/, ''));
        if (fs.existsSync(filePath)) {
          response.sendFile(filePath);
        } else {
          response.sendStatus(404);
        }
      } else {
        response.sendFile(path.resolve(this.clientRootPath, 'index.html'));
      }
    }
  }
}
