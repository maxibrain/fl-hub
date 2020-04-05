import { Entity, Index, Column, ObjectID, ObjectIdColumn } from 'typeorm';

export type PaymentSystem = 'upwork' | 'payoneer';

export interface Client {
  name: string;
  billingInfo: string;
  via?: PaymentSystem;
}

@Entity()
export class BillingInfo {
  @ObjectIdColumn() id: ObjectID;
  @Column() @Index() userId: string;
  @Column() clients: Client[];
  @Column() supplier: string;
  @Column() billingInfo: string;
}
