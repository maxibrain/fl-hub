import { tap, mergeMap, map } from 'rxjs/operators';
import { State, Selector, Action, StateContext, createSelector } from '@ngxs/store';
import { patch, updateItem, append } from '@ngxs/store/operators';
import * as fromActions from './hire.actions';
import { CandidateService } from '../candidate.service';
import { SearchQuery } from '../interfaces/search-query';
import { CandidateDto } from '../interfaces/candidate.dto';
import { CandidateTracker } from '../interfaces/candidateTracker';

export interface HireStateModel {
  queries: SearchQuery[];
}

@State<HireStateModel>({ name: 'hire', defaults: { queries: [] } })
export class HireState {
  @Selector()
  static queries(state: HireStateModel) {
    return state.queries;
  }

  static query(name: string) {
    return createSelector(
      [HireState],
      (state: HireStateModel) => state.queries.find(q => q.name === name),
    );
  }

  static candidates(name: string) {
    return createSelector(
      [HireState],
      (state: HireStateModel) => {
        const query = HireState.query(name)(state);
        return (query && query.candidates) || [];
      },
    );
  }

  static candidate(name: string, id: string) {
    return createSelector(
      [HireState],
      (state: HireStateModel) => {
        const candidates = HireState.candidates(name)(state);
        return candidates.find(c => c.profile.id === id);
      },
    );
  }

  constructor(private service: CandidateService) {}

  @Action(fromActions.ListCandidates)
  listCandidates(ctx: StateContext<HireStateModel>, { searchName }: fromActions.ListCandidates) {
    return this.service
      .list(searchName)
      .pipe(
        tap(candidates => ctx.setState(patch({ queries: updateItem<SearchQuery>(q => q.name === searchName, patch({ candidates })) }))),
      );
  }

  @Action(fromActions.GetCandidate)
  getCandidate(ctx: StateContext<HireStateModel>, { searchName, profileId }: fromActions.GetCandidate) {
    return this.service.get(searchName, profileId).pipe(
      tap(candidate => {
        const state = ctx.getState();
        const query = HireState.query(searchName)(state);
        const existingCandidate = HireState.candidate(searchName, profileId)(state);
        if (existingCandidate != null) {
          ctx.setState(
            patch({
              queries: updateItem<SearchQuery>(
                q => q === query,
                patch({ candidates: updateItem<CandidateDto>(c => c === existingCandidate, candidate) }),
              ),
            }),
          );
        } else {
          ctx.setState(patch({ queries: updateItem<SearchQuery>(q => q === query, patch({ candidates: append([candidate]) })) }));
        }
      }),
    );
  }

  @Action(fromActions.FetchCandidates)
  fetchCandidates({ dispatch }: StateContext<HireStateModel>, { searchName }: fromActions.FetchCandidates) {
    return this.service.fetchAll(searchName).pipe(mergeMap(() => dispatch(new fromActions.ListCandidates(searchName))));
  }

  @Action(fromActions.FetchQueries)
  fetchQueries({ patchState }: StateContext<HireStateModel>) {
    return this.service.listQueries().pipe(
      map(queries =>
        queries.map(q => {
          q.candidates = [];
          return q;
        }),
      ),
      tap(queries => patchState({ queries })),
    );
  }

  @Action(fromActions.CreateSearchQuery)
  createSearchQuery(ctx: StateContext<HireStateModel>, { data }: fromActions.CreateSearchQuery) {
    return this.service.createQuery(data).pipe(tap(query => ctx.patchState({ queries: [...ctx.getState().queries, query] })));
  }

  @Action(fromActions.UpdateCandidateStatus)
  updateCandidateStatus(ctx: StateContext<HireStateModel>, { status }: fromActions.UpdateCandidateStatus) {
    return this.service.updateStatus(status).pipe(
      tap(() => {
        ctx.setState(
          patch({
            queries: updateItem<SearchQuery>(
              q => q.name === status.searchName,
              patch({
                candidates: updateItem<CandidateDto>(
                  c => c.profile.id === status.id,
                  patch({
                    tracker: <CandidateTracker>{
                      status: status.status,
                      reviewDate: new Date(),
                      reviewComment: status.comment,
                    },
                  }),
                ),
              }),
            ),
          }),
        );
      }),
    );
  }
}
