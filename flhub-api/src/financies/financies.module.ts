import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/common/http';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth';
import { SharedModule } from '../shared';
import { InvoiceService } from './banking/invoice.service';
import { BankingController } from './banking/banking.controller';
import { BillingService } from './banking/billing.service';
import { BillingInfo } from './entities';

@Module({
  imports: [HttpModule, AuthModule, SharedModule, TypeOrmModule.forFeature([BillingInfo])],
  controllers: [BankingController],
  providers: [BillingService, InvoiceService],
})
export class FinanciesModule {}
