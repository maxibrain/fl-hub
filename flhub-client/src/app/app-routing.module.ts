import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'account',
    loadChildren: './account/account.module#AccountModule',
  },
  {
    path: 'hire',
    loadChildren: './hire/hire.module#HireModule',
  },
  {
    path: 'financies',
    loadChildren: './financies/financies.module#FinanciesModule',
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'hire',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
