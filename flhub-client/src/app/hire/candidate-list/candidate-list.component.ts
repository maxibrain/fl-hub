import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngxs/store';
import { HireState } from '../state/hire.state';
import { Observable, BehaviorSubject, combineLatest, ReplaySubject } from 'rxjs';
import { CandidateDto } from '../interfaces/candidate.dto';
import { ListCandidates, FetchCandidates } from '../state/hire.actions';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { pluck, mergeMap, map, take, debounceTime, distinctUntilChanged, tap, finalize } from 'rxjs/operators';
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
  private readonly _filter$ = new ReplaySubject<{ [key: string]: boolean }>(1);
  private readonly _sortBy$ = new ReplaySubject<{ key: string; direction: 'asc' | 'desc' }>(1);
  private readonly _search$ = new ReplaySubject<string>(1);
  private readonly _sortings: { [key: string]: (c: CandidateDto) => any } = {
    rate: c => c.profile.rate,
    updated: c => c.profile.updated,
  };
  readonly filterOptions = [
    {
      key: 'pt',
      text: 'Part time',
    },
    {
      key: 'oo',
      text: 'Open for offers',
    },
    {
      key: 'bad',
      text: 'Bad',
    },
    {
      key: 'refused',
      text: 'Refused',
    },
    {
      key: 'invited',
      text: 'Invited',
    },
    {
      key: 'hired',
      text: 'Hired',
    },
  ];
  readonly search$ = this._search$.asObservable();
  readonly pageIndex$ = this._pagination$.pipe(pluck('pageIndex'));
  readonly pageSize$ = this._pagination$.pipe(pluck('pageSize'));
  readonly candidatesLoading$ = this._candidatesLoading$.asObservable();
  readonly candidates$: Observable<CandidateDto[]>;
  readonly page$: Observable<CandidateDto[]>;
  readonly sortingKeys = Object.keys(this._sortings);
  readonly sortBy$ = this._sortBy$.asObservable();
  readonly filter$ = this._filter$.asObservable();

  constructor(fb: FormBuilder, private store: Store, private route: ActivatedRoute, private router: Router) {
    this.candidates$ = combineLatest(
      route.params.pipe(
        pluck<Params, string>('name'),
        mergeMap(name => store.select(HireState.candidates(name))),
      ),
      this._filter$.pipe(
        tap(filter => {
          console.log({ filter, keys: Object.keys(filter) });
          this.router.navigate(['.'], {
            queryParams: {
              ...this.route.snapshot.queryParams,
              filter:
                Object.keys(filter)
                  .filter(i => filter[i])
                  .join(',') || undefined,
            },
            relativeTo: this.route,
          });
        }),
      ),
      this._search$.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(phrase => {
          this.router.navigate(['.'], {
            queryParams: { ...this.route.snapshot.queryParams, q: phrase || undefined },
            relativeTo: this.route,
          });
        }),
      ),
      this._sortBy$.pipe(
        tap(sortBy => {
          if (sortBy) {
            this.router.navigate(['.'], {
              queryParams: { ...this.route.snapshot.queryParams, sortBy: sortBy.key, sortDir: sortBy.direction },
              relativeTo: this.route,
            });
          } else {
            this.router.navigate(['.'], {
              queryParams: { ...this.route.snapshot.queryParams, sortBy: undefined, sortDir: undefined },
              relativeTo: this.route,
            });
          }
        }),
      ),
    ).pipe(
      map(([candidates, filter, search, sortBy]) => {
        candidates = candidates.filter(c => {
          if (!filter['bad'] && c.tracker.status === 'BAD') {
            return false;
          }
          if (!filter['refused'] && c.tracker.status === 'REFUSED') {
            return false;
          }
          if (!filter['invited'] && c.tracker.status === 'INVITED') {
            return false;
          }
          if (!filter['hired'] && c.tracker.status === 'HIRED') {
            return false;
          }
          if (!filter['oo'] && c.profile.availability === 'notSure') {
            return false;
          }
          if (!filter['pt'] && c.profile.availability === 'partTime') {
            return false;
          }
          return true;
        });
        if (search) {
          candidates = candidates.filter(c => c.profile.name.toLowerCase().indexOf(search.toLowerCase()) > -1);
        }
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
    this.page$ = combineLatest(
      this.candidates$,
      this._pagination$.pipe(
        tap(({ pageIndex, pageSize }) => {
          this.router.navigate(['.'], { queryParams: { ...this.route.snapshot.queryParams, pageIndex, pageSize }, relativeTo: this.route });
        }),
      ),
    ).pipe(
      map(([candidates, pagination]) => {
        const result = candidates.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize);
        if (result.length === 0 && pagination.pageIndex > 0) {
          this._pagination$.next({ pageIndex: Math.floor(candidates.length / pagination.pageSize), pageSize: pagination.pageSize });
        }
        return result;
      }),
    );
  }

  ngOnInit() {
    const { queryParams } = this.route.snapshot;
    this._pagination$.next({
      pageIndex: parseInt(queryParams['pageIndex'], 10) || 0,
      pageSize: parseInt(queryParams['pageSize'], 10) || 10,
    });

    const filterParam = (queryParams['filter'] as String) || '';
    const enabledFilters = filterParam.split(',').filter(f => !!f);
    this._filter$.next(
      enabledFilters.reduce((acc, v) => {
        acc[v] = true;
        return acc;
      }, {}),
    );

    this._search$.next(queryParams['q'] || '');
    if (queryParams['sortBy']) {
      this._sortBy$.next({ key: queryParams['sortBy'], direction: queryParams['sortDir'] || 'asc' });
    } else {
      this._sortBy$.next(null);
    }
    this._candidatesLoading$.next(true);
    this.store
      .dispatch(new ListCandidates(this.route.snapshot.params['name']))
      .pipe(finalize(() => this._candidatesLoading$.next(false)))
      .subscribe();
  }

  update() {
    this._candidatesLoading$.next(true);
    this.store
      .dispatch(new FetchCandidates(this.route.snapshot.params['name']))
      .pipe(finalize(() => this._candidatesLoading$.next(false)))
      .subscribe();
  }

  onPageChanged({ pageIndex, pageSize }: any) {
    this._pagination$.next({ pageIndex, pageSize });
  }

  onFilterChange(filter: any, key: string) {
    this._filter$.next({ ...filter, [key]: !filter[key] });
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
        });
    } else {
      this._sortBy$.next(null);
    }
  }

  onSearch(e: { target: HTMLInputElement }) {
    this._search$.next(e.target.value);
  }
}
