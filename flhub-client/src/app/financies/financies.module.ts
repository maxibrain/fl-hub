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
  MatIconModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsModule } from '@ngxs/store';
import { FinanciesState } from './state/financies.state';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';

@NgModule({
  declarations: [SalaryComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FinanciesRoutingModule,
    NgxsModule.forFeature([FinanciesState]),
    NgxsFormPluginModule,
    NgxsStoragePluginModule,
    MatFormFieldModule,
    MatDividerModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule
  ]
})
export class FinanciesModule {}
