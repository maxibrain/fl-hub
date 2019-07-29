import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalaryComponent } from './salary/salary.component';
import { BankingComponent } from './banking/banking.component';
import { InvoiceComponent } from './banking/invoice/invoice.component';
import { OtpToTaxerComponent } from './banking/otp-to-taxer/otp-to-taxer.component';
import { TransactionsComponent } from './transactions/transactions.component';

const routes: Routes = [
  {
    path: 'transactions',
    component: TransactionsComponent,
  },
  {
    path: 'salary',
    component: SalaryComponent,
  },
  {
    path: 'banking',
    component: BankingComponent,
  },
  {
    path: 'banking/invoice',
    component: InvoiceComponent,
  },
  {
    path: 'banking/otp-to-taxer',
    component: OtpToTaxerComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'transactions',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinanciesRoutingModule {}
