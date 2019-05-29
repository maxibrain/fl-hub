import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatListModule } from '@angular/material/list';
import {
  MatCardModule,
  MatChipsModule,
  MatSliderModule,
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatDialogModule,
  MatProgressSpinnerModule,
  MatPaginatorModule,
} from '@angular/material';
import { NgxsModule, Store } from '@ngxs/store';

import { HireRoutingModule } from './hire-routing.module';
import { CandidateListItemComponent } from './candidate-list-item/candidate-list-item.component';
import { CandidateListComponent } from './candidate-list/candidate-list.component';
import { HireState } from './state/hire.state';
import { CreateQueryComponent } from './create-query/create-query.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CandidateComponent } from './candidate/candidate.component';
import { FetchQueries } from './state/hire.actions';
import { QueryListComponent } from './query-list/query-list.component';
import { CandidateStatusCommentDialogComponent } from './candidate/candidate-status-comment-dialog.component';

@NgModule({
  declarations: [
    CandidateListItemComponent,
    CandidateListComponent,
    CreateQueryComponent,
    CandidateComponent,
    QueryListComponent,
    CandidateStatusCommentDialogComponent,
  ],
  imports: [
    CommonModule,
    HireRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSliderModule,
    NgxsModule.forFeature([HireState]),
  ],
  entryComponents: [CandidateStatusCommentDialogComponent, CreateQueryComponent],
})
export class HireModule {
  constructor(store: Store) {
    store.dispatch(new FetchQueries());
  }
}
