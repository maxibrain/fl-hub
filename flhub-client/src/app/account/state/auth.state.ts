import { State, Action, StateContext, Selector } from '@ngxs/store';

export class AuthorizeAction {
  static readonly type = '[Auth] Authorize';

  constructor(public readonly token: string) {}
}

export interface AuthStateModel {
  token?: string;
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {},
})
export class AuthState {
  @Selector()
  static token(state: AuthStateModel): string | null {
    return state.token;
  }

  @Action(AuthorizeAction)
  authorize(ctx: StateContext<AuthStateModel>, { token }: AuthorizeAction) {
    ctx.patchState({ token });
  }
}
