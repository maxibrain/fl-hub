import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinanciesRoutingModule } from './financies-routing.module';
import { SalaryComponent } from './salary/salary.component';
import {
  MatFormFieldModule,
  MatDividerModule,
  MatInputModule,
  MatButtonModule,
  MatExpansionModule,
  MatIconModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatListModule,
  MatBottomSheetModule,
  MatDialogModule,
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { BankingComponent } from './banking/banking.component';
import { InvoiceComponent } from './banking/invoice/invoice.component';
import { FinanciesStateModule } from './financies.state.module';
import { TransactionsComponent } from './transactions/transactions.component';
import { IncomeFormGroupComponent } from './transactions/income-form-group.component';
import { CurrencyExchangeFormGroupComponent } from './transactions/currency-exchange-form-group.component';
import { OtpComponent } from './banking/otp/otp.component';

@NgModule({
  declarations: [
    SalaryComponent,
    BankingComponent,
    InvoiceComponent,
    TransactionsComponent,
    IncomeFormGroupComponent,
    CurrencyExchangeFormGroupComponent,
    OtpComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FinanciesRoutingModule,
    FinanciesStateModule,
    NgxsFormPluginModule,
    NgxsStoragePluginModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatListModule,
    MatSelectModule,
  ],
})
export class FinanciesModule {}
