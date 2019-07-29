import { Operation } from '../models/operations';

export class ListBankAccounts {
  static readonly type = '[Financies] List Bank Accounts';
}

export class AddOperation {
  static readonly type = '[Financies] Add Operation';

  constructor(public readonly operation: Operation) {}
}

export class CompleteTransaction {
  static readonly type = '[Financies] Complete Transaction';

  constructor(public readonly id: string) {}
}
