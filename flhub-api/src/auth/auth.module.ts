import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/common/http';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '../shared';
import { User } from './entities';

@Module({
  imports: [HttpModule, SharedModule, TypeOrmModule.forFeature([User])],
  controllers: [],
  providers: [],
})
export class AuthModule {}
