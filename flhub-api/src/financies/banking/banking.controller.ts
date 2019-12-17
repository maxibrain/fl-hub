import { Controller, Post, Body, Res, Get, UseGuards } from '@nestjs/common';
import { InvoiceService, InvoiceData } from './invoice.service';
import { Response } from 'express';
import { BillingService } from './billing.service';
import { AuthGuard, AuthUser, User } from '../../auth';
import { BankingService } from './banking.service';
import { TransactionDto } from '../interfaces/transaction.dto';

@Controller('api/banking')
@UseGuards(AuthGuard)
export class BankingController {
  @Post('invoice')
  async generateInvoice(@Body() data: InvoiceData, @Res() res: Response) {
    const filePath = await this.invoices.generate(data);
    res.sendFile(filePath);
  }

  @Get('billingInfo')
  async getBillingInfo(@AuthUser() { id }: User) {
    return await this.billing.getBillingInfo(id);
  }

  @Get('accounts')
  async listBankAccounts(@AuthUser() { id }: User) {
    return await this.banking.listBankAccounts(id);
  }

  @Post('transaction')
  async addTransaction(@AuthUser() { id }: User, @Body() transactions: TransactionDto | TransactionDto[]) {}

  constructor(private invoices: InvoiceService, private billing: BillingService, private banking: BankingService) {}
}
