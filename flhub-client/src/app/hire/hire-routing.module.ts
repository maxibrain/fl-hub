import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CandidateListComponent } from './candidate-list/candidate-list.component';
import { QueryListComponent } from './query-list/query-list.component';
import { CandidateComponent } from './candidate/candidate.component';

const routes: Routes = [
  {
    path: 'search',
    children: [
      {
        path: ':name',
        children: [
          {
            path: 'candidates',
            children: [
              {
                path: ':id',
                component: CandidateComponent,
              },
              {
                path: '',
                pathMatch: 'full',
                component: CandidateListComponent,
              },
            ],
          },
        ],
      },
      {
        path: '',
        pathMatch: 'full',
        component: QueryListComponent,
      },
    ],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'search',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HireRoutingModule {}
