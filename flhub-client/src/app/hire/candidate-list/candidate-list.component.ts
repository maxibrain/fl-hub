import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngxs/store';
import { HireState } from '../state/hire.state';
import { Observable } from 'rxjs';
import { CandidateDto } from '../interfaces/candidate.dto';
import { ListCandidates, FetchCandidates } from '../state/hire.actions';
import { ActivatedRoute, Params } from '@angular/router';
import { pluck, switchMap, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-candidate-list',
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CandidateListComponent implements OnInit {
  readonly candidates$: Observable<CandidateDto[]>;

  constructor(private store: Store, private route: ActivatedRoute) {
    this.candidates$ = route.params.pipe(
      pluck<Params, string>('name'),
      mergeMap(name => store.select(HireState.candidates(name))),
    );
  }

  ngOnInit() {
    this.store.dispatch(new ListCandidates(this.route.snapshot.params['name']));
  }

  update() {
    this.store.dispatch(new FetchCandidates(this.route.snapshot.params['name']));
  }
}
