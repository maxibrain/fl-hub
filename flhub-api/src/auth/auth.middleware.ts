import { NestMiddleware, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UpworkSession } from '../shared';

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
        req.user = session.user;
      }
    }
    next();
  }
}
