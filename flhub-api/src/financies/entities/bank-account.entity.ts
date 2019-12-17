import { Entity, ObjectIdColumn, ObjectID, Column, Index, OneToMany } from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity()
export class BankAccount {
  @ObjectIdColumn() id: ObjectID;
  @Column() @Index() userId: string;
  @Column() name: string;
  @Column() currency: 'UAH' | 'USD';
  @OneToMany(returns => Transaction, t => t.bankAccount)
  transactions: Transaction[];
}
