import { Injectable } from '@nestjs/common';
import { UpworkApiService } from '../shared';

@Injectable()
export class AuthService {
  constructor(private upwork: UpworkApiService) {}

  getAuthorizationUrl(callbackUrl: string) {
    return this.upwork.getAuthorizationUrl(callbackUrl);
  }
}
