import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth';

const routes: Routes = [
  {
    path: 'account',
    loadChildren: './account/account.module#AccountModule',
  },
  {
    path: 'hire',
    loadChildren: './hire/hire.module#HireModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'financies',
    loadChildren: './financies/financies.module#FinanciesModule',
    canActivate: [AuthGuard],
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
