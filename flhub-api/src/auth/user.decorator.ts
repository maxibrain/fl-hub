import { createParamDecorator } from '@nestjs/common';

export const AuthUser = createParamDecorator((_, req) => {
  return req.user;
});
