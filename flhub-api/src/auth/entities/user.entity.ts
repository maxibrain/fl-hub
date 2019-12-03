import { Entity, ObjectIdColumn, ObjectID, Column } from 'typeorm';
import { User as UserInterface } from './user.interface';

@Entity()
export class User implements UserInterface {
  @ObjectIdColumn() id: string;
}
