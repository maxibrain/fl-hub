import { State } from '@ngxs/store';

export interface FinanciesStateModel {
  salaryForm: any;
}

@State<FinanciesStateModel>({
  name: 'financies',
  defaults: {
    salaryForm: {
      model: undefined,
      dirty: false,
      status: '',
      errors: {},
    },
  },
})
export class FinanciesState {}
