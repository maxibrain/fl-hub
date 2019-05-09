import { tap, mergeMap } from 'rxjs/operators';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import * as fromActions from './hire.actions';
import { CandidateService } from '../candidate.service';
import { CandidateDto } from '../interfaces/candidate.dto';
import { SearchQuery } from '../interfaces/search-query';

export interface HireStateModel {
  candidates: CandidateDto[];
  queries: SearchQuery[];
}

@State<HireStateModel>({ name: 'hire', defaults: { candidates: [], queries: [] } })
export class HireState {
  @Selector()
  static queries(state: HireStateModel) {
    return state.queries;
  }

  @Selector()
  static candidates(state: HireStateModel) {
    return state.candidates;
  }

  constructor(private service: CandidateService) {}

  @Action(fromActions.GetCandidates)
  getCandidates({ patchState }: StateContext<HireStateModel>) {
    return this.service.getAll().pipe(
      tap(candidates => patchState({ candidates }))
    );
  }

  @Action(fromActions.FetchCandidates)
  fetchCandidates({ dispatch }: StateContext<HireStateModel>) {
    return this.service.fetchAll().pipe(
      mergeMap(() => dispatch(new fromActions.GetCandidates()))
    );
  }

  @Action(fromActions.CreateSearchQuery)
  createSearchQuery(ctx: StateContext<HireStateModel>, { data }: fromActions.CreateSearchQuery) {
    return this.service.createQuery(data);
  }
}
