import { Module } from '@nestjs/common';
import { SERVICES } from './services';

@Module({
  imports: [],
  providers: [...SERVICES],
  exports: [...SERVICES],
})
export class SharedModule {}
