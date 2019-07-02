import { Entity, Column, ObjectID, ObjectIdColumn } from 'typeorm';

export interface Client {
  name: string;
  billingInfo: string;
  viaUpwork: boolean;
}

@Entity()
export class BillingInfo {
  @ObjectIdColumn() id: ObjectID;
  @Column() clients: Client[];
  @Column() supplier: string;
  @Column() billingInfo: string;
}
