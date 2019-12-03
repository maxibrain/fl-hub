import { Entity, ObjectIdColumn, ObjectID, Column } from 'typeorm';

@Entity()
export class SearchQuery {
  @ObjectIdColumn() id: ObjectID;
  @Column() userId: string;
  @Column() name: string;
  @Column() params: any;
}
