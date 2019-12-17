import { Entity, ManyToOne, Column, ObjectIdColumn, ObjectID } from 'typeorm';
import { BankAccount } from './bank-account.entity';

export interface Contragent {
  name: string;
}

@Entity()
export class Transaction {
  @ObjectIdColumn() id: ObjectID;
  @ManyToOne(returns => BankAccount)
  bankAccount: Promise<BankAccount>;
  @Column({ nullable: true })
  reference?: string;
  @Column()
  contragent: Contragent;
  @Column()
  currency: 'UAH' | 'USD';
  @Column()
  dateTime: Date;
  @Column()
  amount: number;
  @Column()
  description: string;
  @Column()
  pending?: boolean;
  @Column()
  extensions?: { [key: string]: any };
}
