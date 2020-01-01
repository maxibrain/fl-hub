export interface Contragent {
  name: string;
}

export interface TransactionDto {
  reference?: string;
  contragent: Contragent;
  currency: 'UAH' | 'USD';
  dateTime: Date;
  amount: number;
  description: string;
  pending?: boolean;
  extensions?: { [key: string]: any };
}
