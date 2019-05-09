import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { HireState } from '../state/hire.state';
import { Observable } from 'rxjs';
import { CandidateDto } from '../interfaces/candidate.dto';
import { GetCandidates } from '../state/hire.actions';

@Component({
  selector: 'app-candidate-list',
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CandidateListComponent implements OnInit {

  @Select(HireState.candidates) readonly candidates$: Observable<CandidateDto[]>;

  constructor(private store: Store) { }

  ngOnInit() {
    this.store.dispatch(new GetCandidates());
  }

}
