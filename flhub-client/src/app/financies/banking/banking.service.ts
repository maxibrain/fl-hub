import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export type PaymentSystem = 'upwork' | 'payoneer';

export interface Client {
  name: string;
  billingInfo: string;
  via?: PaymentSystem;
}

export interface BillingInfo {
  clients: Client[];
  supplier: string;
  billingInfo: string;
}

@Injectable({
  providedIn: 'root',
})
export class BankingService {
  constructor(private http: HttpClient) {}

  getBillingInfo() {
    return this.http.get('api/banking/billingInfo');
  }

  generateInvoice(data: any) {
    return this.http.post('api/banking/invoice', data, { responseType: 'blob' });
  }
}
