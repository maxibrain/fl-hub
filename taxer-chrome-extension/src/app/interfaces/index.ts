export type OperationType = 'Income' | 'Expense' | 'Currency Exchange';

export type Currency = 'USD' | 'UAH';

export interface Operation {
  type?: OperationType;
  dateTime: Date | string;
  currency: Currency;
  amount: number;
  description?: string;
  extensions?: { [key: string]: any };
}

export interface Contragent {
  name: string;
}

export const Contragents = {
  UpWork: { name: 'UpWork' },
  Bank: { name: 'Bank' },
  TaxDepartment: { name: 'Tax Department' },
  PersonalAccount: { name: 'Personal Account' },
  Unknown: { name: 'Unknown' },
};

export interface Transaction extends Operation {
  reference?: string;
  contragent: Contragent;
}
