import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngxs/store';
import { HireState } from '../state/hire.state';
import { Observable, BehaviorSubject, combineLatest, ReplaySubject } from 'rxjs';
import { CandidateDto } from '../interfaces/candidate.dto';
import { ListCandidates, FetchCandidates } from '../state/hire.actions';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { pluck, mergeMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-candidate-list',
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CandidateListComponent implements OnInit {
  private readonly _candidatesLoading$ = new BehaviorSubject(false);
  private readonly _pagination$ = new ReplaySubject<{ pageIndex: number; pageSize: number }>(1);
  readonly pageIndex$ = this._pagination$.pipe(pluck('pageIndex'));
  readonly pageSize$ = this._pagination$.pipe(pluck('pageSize'));
  readonly candidatesLoading$ = this._candidatesLoading$.asObservable();
  readonly candidates$: Observable<CandidateDto[]>;
  readonly page$: Observable<CandidateDto[]>;

  constructor(private store: Store, private route: ActivatedRoute, private router: Router) {
    this.candidates$ = route.params.pipe(
      pluck<Params, string>('name'),
      mergeMap(name => store.select(HireState.candidates(name))),
    );
    this.page$ = combineLatest(this.candidates$, this._pagination$).pipe(
      map(([candidates, pagination]) => {
        return candidates.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize);
      }),
    );
  }

  ngOnInit() {
    const { queryParams } = this.route.snapshot;
    this._pagination$.next({
      pageIndex: parseInt(queryParams['pageIndex'], 10) || 0,
      pageSize: parseInt(queryParams['pageSize'], 10) || 10,
    });
    this._candidatesLoading$.next(true);
    this.store.dispatch(new ListCandidates(this.route.snapshot.params['name'])).subscribe(() => this._candidatesLoading$.next(false));
  }

  update() {
    this._candidatesLoading$.next(true);
    this.store.dispatch(new FetchCandidates(this.route.snapshot.params['name'])).subscribe(() => this._candidatesLoading$.next(false));
  }

  onPageChanged({ pageIndex, pageSize }: any) {
    this._pagination$.next({ pageIndex, pageSize });
    this.router.navigate(['.'], { queryParams: { pageIndex, pageSize }, relativeTo: this.route });
  }
}
