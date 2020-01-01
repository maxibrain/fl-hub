import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/common/http';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth';
import { SharedModule } from '../shared';
import { BillingInfo, BankAccount } from './entities';
import { InvoiceService } from './banking/invoice.service';
import { BankingController } from './banking/banking.controller';
import { BillingService } from './banking/billing.service';
import { BankingService } from './banking/banking.service';

@Module({
  imports: [HttpModule, AuthModule, SharedModule, TypeOrmModule.forFeature([BillingInfo, BankAccount])],
  controllers: [BankingController],
  providers: [BillingService, InvoiceService, BankingService],
})
export class FinanciesModule {}
