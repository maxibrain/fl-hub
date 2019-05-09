import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CandidateListComponent } from './candidate-list/candidate-list.component';
import { CreateQueryComponent } from './create-query/create-query.component';

const routes: Routes = [
  {
    path: 'search',
    component: CreateQueryComponent,
  },
  {
    path: 'candidates',
    component: CandidateListComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'candidates',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HireRoutingModule { }
