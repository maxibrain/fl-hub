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
} from '@angular/material';
import { NgxsModule } from '@ngxs/store';

import { HireRoutingModule } from './hire-routing.module';
import { CandidateListItemComponent } from './candidate-list-item/candidate-list-item.component';
import { CandidateListComponent } from './candidate-list/candidate-list.component';
import { HireState } from './state/hire.state';
import { CreateQueryComponent } from './create-query/create-query.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CandidateListItemComponent, CandidateListComponent, CreateQueryComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatChipsModule,
    MatSliderModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    NgxsModule.forFeature([HireState]),
    HireRoutingModule,
  ],
})
export class HireModule {}
