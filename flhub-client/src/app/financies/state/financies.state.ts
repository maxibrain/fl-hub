import { State, Action, StateContext, Selector, StateOperator } from '@ngxs/store';
import { BankAccount, Transaction } from '../interfaces';
import * as fromActions from './financies.actions';
import { FinanciesService } from '../services/financies.service';
import { tap } from 'rxjs/operators';
import { patch, updateItem, append, compose } from '@ngxs/store/operators';
import { Guid } from 'guid-typescript';

export interface FinanciesStateModel {
  bankAccounts: BankAccount[];
  salaryForm: any;
}

@State<FinanciesStateModel>({
  name: 'financies',
  defaults: {
    bankAccounts: [],
    salaryForm: {
      model: undefined,
      dirty: false,
      status: '',
      errors: {},
    },
  },
})
export class FinanciesState {
  static KEYS_TO_STORE = ['financies.salaryForm'];
}
  @Selector()
  static bankAccounts(state: FinanciesStateModel) {
    return state.bankAccounts;
  }

  constructor(private service: FinanciesService) {}

  @Action(fromActions.ListBankAccounts)
  listBankAccounts(ctx: StateContext<FinanciesStateModel>) {
    return this.service.listBankAccounts().pipe(tap(result => ctx.patchState({ bankAccounts: result })));
  }

  @Action(fromActions.AddOperation)
  addOperation(ctx: StateContext<FinanciesStateModel>, { operation }: fromActions.AddOperation) {
    const currencyGroups = operation.transactions.reduce((acc, t) => {
      acc[t.currency] = acc[t.currency] || [];
      acc[t.currency].push(t);
      return acc;
    }, {});
    const bankAccountsUpdates = Object.keys(currencyGroups).map(currency => {
      const transactions: Transaction[] = currencyGroups[currency];
      return updateItem<BankAccount>(
        a => a.currency === currency,
        patch({
          transactions: append(transactions),
          balance: balance => balance + transactions.map(t => t.amount).reduce((acc, v) => acc + v, 0),
        }),
      );
    });
    ctx.setState(patch({ bankAccounts: compose(...bankAccountsUpdates) }));
  }

  @Action(fromActions.CompleteTransaction)
  completeTransaction(ctx: StateContext<FinanciesStateModel>, { id }: fromActions.CompleteTransaction) {
    ctx.setState(
      patch({
        bankAccounts: updateItem<BankAccount>(
          a => a.transactions.findIndex(t => t.id === id) > -1,
          patch({
            transactions: updateItem<Transaction>(
              t => t.id === id,
              patch({
                dateTime: () => new Date(),
                pending: () => false,
              }),
            ),
          }),
        ),
      }),
    );
  }
}
