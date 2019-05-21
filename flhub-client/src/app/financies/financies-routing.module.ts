import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalaryComponent } from './salary/salary.component';

const routes: Routes = [
  {
    path: 'salary',
    component: SalaryComponent,
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
