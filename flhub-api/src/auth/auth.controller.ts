import { Controller, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class BankingController {
  @Get('upwork/url')
  async getAuthorizationUrl() {
    const res = await this.auth.getAuthorizationUrl('api/auth/upwork/callback');
  }

  @Get('upwork/callback')
  async getBillingInfo(@Query() query: any) {
    return await this.auth.authorize(query);
  }

  constructor(private auth: AuthService, private billing: BillingService) {}
}
