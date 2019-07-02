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
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsModule } from '@ngxs/store';
import { FinanciesState } from './state/financies.state';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { BankingComponent } from './banking/banking.component';
import { InvoiceComponent } from './banking/invoice/invoice.component';

@NgModule({
  declarations: [SalaryComponent, BankingComponent, InvoiceComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FinanciesRoutingModule,
    NgxsModule.forFeature([FinanciesState]),
    NgxsFormPluginModule,
    NgxsStoragePluginModule,
    MatButtonModule,
    MatDatepickerModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatSelectModule,
  ],
})
export class FinanciesModule {}
