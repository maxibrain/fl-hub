import * as https from 'https';
import * as fs from 'fs-extra';
import * as tempy from 'tempy';
import { Injectable, Logger } from '@nestjs/common';

export interface InvoiceData {
  from: string;
  to: string;
  items: [
    {
      name: string;
      quantity: number;
      unit_cost: number;
    }
  ];
  date?: Date;
  due_date?: Date;
  logo?: string;
  currency?: 'usd';
  number?: string;
  payment_terms?: string;
  tax?: number;
  shipping?: number;
  amount_paid?: number;
  notes?: string;
  terms?: string;
  fields?: {
    [key: string]: '%' | boolean;
  };
}

@Injectable()
export class InvoiceService {
  generate(invoice: InvoiceData): Promise<string> {
    const postData = JSON.stringify(invoice);
    const options = {
      hostname: 'invoice-generator.com',
      port: 443,
      path: '/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const filename = tempy.file({ extension: '.pdf' });
    Logger.log(filename, 'Invoice Generator');
    const file = fs.createWriteStream(filename);
    return new Promise((resolve, reject) => {
      file.on('error', err => {
        Logger.error(err, null, 'Invoice Generator');
        reject(err);
      });
      file.on('finish', () => resolve(filename));
      const req = https.request(options, res => {
        res
          .on('data', chunk => {
            file.write(chunk);
          })
          .on('end', () => {
            file.end();
          });
      });
      req.write(postData);
      req.end();

      req.on('error', reject);
    });
  }
}
