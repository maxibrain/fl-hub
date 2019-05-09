import { Module } from '@nestjs/common';
import { SERVICES } from './services';

@Module({
  providers: [...SERVICES],
  exports: [...SERVICES],
})
export class SharedModule {}
