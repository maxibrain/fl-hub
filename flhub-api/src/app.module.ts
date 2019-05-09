import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HireModule } from './hire/hire.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [HireModule, SharedModule, TypeOrmModule.forRoot()],
})
export class AppModule {}
