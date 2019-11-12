import { Injectable, Logger } from '@nestjs/common';
import { UpworkApiService, UpworkAuthorizationRequest } from '../shared';

@Injectable()
export class AuthService {
  constructor(private upwork: UpworkApiService) {}

  getAuthorizationUrl(callbackUrl: string) {
    return this.upwork.getAuthorizationUrl(callbackUrl);
  }

  authorize(request: UpworkAuthorizationRequest) {
    return this.upwork.authorize(request);
  }
}
