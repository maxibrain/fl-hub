import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalaryComponent } from './salary/salary.component';
import { BankingComponent } from './banking/banking.component';
import { InvoiceComponent } from './banking/invoice/invoice.component';

const routes: Routes = [
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
    path: '',
    pathMatch: 'full',
    redirectTo: 'salary',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinanciesRoutingModule {}
