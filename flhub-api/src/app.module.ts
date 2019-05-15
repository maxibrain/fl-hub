import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HireModule } from './hire/hire.module';
import { SharedModule } from './shared/shared.module';
import { SimpleConsoleLogger } from 'typeorm';

@Module({
  imports: [HireModule, SharedModule, TypeOrmModule.forRoot({ logger: new SimpleConsoleLogger(), logging: true })],
})
export class AppModule {}
