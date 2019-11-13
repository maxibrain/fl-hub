import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SimpleConsoleLogger } from 'typeorm';
import { HireModule } from './hire/hire.module';
import { SharedModule } from './shared/shared.module';
import { FinanciesModule } from './financies/financies.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule,
    HireModule,
    FinanciesModule,
    SharedModule,
    TypeOrmModule.forRoot({ logger: new SimpleConsoleLogger(), logging: true }),
  ],
})
export class AppModule {}
