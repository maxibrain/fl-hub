import { Controller, Post, Body, Res, Get, UseGuards } from '@nestjs/common';
import { InvoiceService, InvoiceData } from './invoice.service';
import { Response } from 'express';
import { BillingService } from './billing.service';
import { AuthGuard } from '../../auth';

@Controller('api/banking')
@UseGuards(AuthGuard)
export class BankingController {
  @Post('invoice')
  async generateInvoice(@Body() data: InvoiceData, @Res() res: Response) {
    const filePath = await this.invoices.generate(data);
    res.sendFile(filePath);
  }

  @Get('billingInfo')
  async getBillingInfo() {
    return await this.billing.getBillingInfo();
  }

  constructor(private invoices: InvoiceService, private billing: BillingService) {}
}
