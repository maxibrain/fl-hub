import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngxs/store';
import { HireState } from '../state/hire.state';
import { Observable, BehaviorSubject, combineLatest, ReplaySubject } from 'rxjs';
import { CandidateDto } from '../interfaces/candidate.dto';
import { ListCandidates, FetchCandidates } from '../state/hire.actions';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { pluck, mergeMap, map, take } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-candidate-list',
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CandidateListComponent implements OnInit {
  private readonly _candidatesLoading$ = new BehaviorSubject(false);
  private readonly _pagination$ = new ReplaySubject<{ pageIndex: number; pageSize: number }>(1);
  private readonly _filter$ = new ReplaySubject<{ showBad: boolean }>(1);
  private readonly _sortBy$ = new ReplaySubject<{ key: string; direction: 'asc' | 'desc' }>(1);
  private readonly _sortings: { [key: string]: (c: CandidateDto) => any } = {
    rate: c => c.profile.rate,
  };
  readonly pageIndex$ = this._pagination$.pipe(pluck('pageIndex'));
  readonly pageSize$ = this._pagination$.pipe(pluck('pageSize'));
  readonly candidatesLoading$ = this._candidatesLoading$.asObservable();
  readonly candidates$: Observable<CandidateDto[]>;
  readonly page$: Observable<CandidateDto[]>;
  readonly filterForm: FormGroup;
  readonly sortingKeys = Object.keys(this._sortings);
  readonly sortBy$ = this._sortBy$.asObservable();

  constructor(fb: FormBuilder, private store: Store, private route: ActivatedRoute, private router: Router) {
    this.filterForm = fb.group({
      showBad: [false],
    });
    this.candidates$ = combineLatest(
      route.params.pipe(
        pluck<Params, string>('name'),
        mergeMap(name => store.select(HireState.candidates(name))),
      ),
      this._filter$,
      this._sortBy$,
    ).pipe(
      map(([candidates, filter, sortBy]) => {
        candidates = candidates.filter(c => {
          if (!filter.showBad && c.tracker.status === 'BAD') {
            return false;
          }
          return true;
        });
        if (sortBy) {
          const fn = this._sortings[sortBy.key];
          if (fn) {
            candidates = candidates.sort((a, b) => {
              let value = fn(a) === fn(b) ? 0 : fn(a) > fn(b) ? 1 : -1;
              if (sortBy.direction === 'desc') {
                value *= -1;
              }
              return value;
            });
          }
        }
        return candidates;
      }),
    );
    this.page$ = combineLatest(this.candidates$, this._pagination$).pipe(
      map(([candidates, pagination]) =>
        candidates.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize),
      ),
    );
  }

  ngOnInit() {
    const { queryParams } = this.route.snapshot;
    this._pagination$.next({
      pageIndex: parseInt(queryParams['pageIndex'], 10) || 0,
      pageSize: parseInt(queryParams['pageSize'], 10) || 10,
    });
    this.filterForm.setValue({
      showBad: queryParams['showBad'] === 'true',
    });
    this.onFilterChange();
    if (queryParams['sortBy']) {
      this._sortBy$.next({ key: queryParams['sortBy'], direction: queryParams['sortDir'] || 'asc' });
    } else {
      this._sortBy$.next(null);
    }
    this._candidatesLoading$.next(true);
    this.store.dispatch(new ListCandidates(this.route.snapshot.params['name'])).subscribe(() => this._candidatesLoading$.next(false));
  }

  update() {
    this._candidatesLoading$.next(true);
    this.store.dispatch(new FetchCandidates(this.route.snapshot.params['name'])).subscribe(() => this._candidatesLoading$.next(false));
  }

  onPageChanged({ pageIndex, pageSize }: any) {
    this._pagination$.next({ pageIndex, pageSize });
    this.router.navigate(['.'], { queryParams: { ...this.route.snapshot.queryParams, pageIndex, pageSize }, relativeTo: this.route });
  }

  onFilterChange() {
    this._filter$.next(this.filterForm.value);
    this.router.navigate(['.'], { queryParams: { ...this.route.snapshot.queryParams, ...this.filterForm.value }, relativeTo: this.route });
  }

  sortBy(sortingKey: string) {
    if (sortingKey) {
      this._sortBy$
        .pipe(
          take(1),
          map(sortBy => {
            const newDirection: 'asc' | 'desc' = sortBy && sortBy.key === sortingKey && sortBy.direction === 'asc' ? 'desc' : 'asc';
            return { key: sortingKey, direction: newDirection };
          }),
        )
        .subscribe(e => {
          this._sortBy$.next(e);
          this.router.navigate(['.'], {
            queryParams: { ...this.route.snapshot.queryParams, sortBy: e.key, sortDir: e.direction },
            relativeTo: this.route,
          });
        });
    } else {
      this._sortBy$.next(null);
      this.router.navigate(['.'], {
        queryParams: { ...this.route.snapshot.queryParams, sortBy: undefined, sortDir: undefined },
        relativeTo: this.route,
      });
    }
  }
}
