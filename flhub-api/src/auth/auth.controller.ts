import { Controller, Get, Query, Req, Res, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Controller('api/auth')
export class AuthController {
  @Get('upwork/url')
  async getAuthorizationUrl(@Query('callbackUrl') callbackUrl: string) {
    const url = await this.auth.getAuthorizationUrl(callbackUrl);
    return { url };
  }

  @Post('upwork/authorize')
  async callback(@Body() oauthResponse: any) {
    const session = await this.auth.authorize(oauthResponse);
    const accessToken = this.jwt.sign(session);
    return { accessToken };
  }

  constructor(private auth: AuthService, private jwt: JwtService) {}
}
