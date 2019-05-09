import { Entity, Column, Index, ObjectIdColumn, ObjectID } from 'typeorm';

@Entity()
export class FreelancerProfilePatch {
  @ObjectIdColumn() id: ObjectID;
  @Column() @Index() profileId: string;
  @Column() patch: any;

  constructor() {
    this.patch = {};
  }
}
