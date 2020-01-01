import { Entity, Index, Column, ObjectID, ObjectIdColumn } from 'typeorm';

export interface Client {
  name: string;
  billingInfo: string;
  viaUpwork: boolean;
}

@Entity()
export class BillingInfo {
  @ObjectIdColumn() id: ObjectID;
  @Column() @Index() userId: string;
  @Column() clients: Client[];
  @Column() supplier: string;
  @Column() billingInfo: string;
}
