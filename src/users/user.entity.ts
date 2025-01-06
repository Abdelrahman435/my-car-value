import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity() // Mark a class as a Entity
export class User {
  @PrimaryGeneratedColumn() // Mark a id column as a primary column
  id: number;

  @Column()
  email: string;

  @Column()
  @Exclude() // when ever get an instance of user and turn it to plain object and then into JSON just Exclude the password
  password: string;

  @AfterInsert() // this is hooks
  logInsert() {
    console.log('Inserted User with id: ' + this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated User with id: ' + this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed User with id: ', this.id);
  }
}
