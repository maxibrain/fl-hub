import { Controller, Post, Body, Res, Get } from '@nestjs/common';
import { InvoiceService, InvoiceData } from './invoice.service';
import { Response } from 'express';
import { BillingService } from './billing.service';

@Controller('api/banking')
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
