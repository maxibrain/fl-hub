import { NestMiddleware, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UpworkSession } from '../shared';
import { logger } from './auth.logger';
import { User } from './entities';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwt: JwtService) {}

  use(req: any, res: any, next: () => void) {
    const auth = req.header('Authorization');
    if (auth) {
      const parts = auth.split(' ');
      if (parts.length === 2) {
        const token = parts[1];
        const session = this.jwt.verify<UpworkSession>(token);
        req.session = session;
        const user: User = {
          id: session.user.info.ref,
        };
        req.user = user;
        logger.debug(`User: ${user.id}`);
      }
    }
    next();
  }
}
