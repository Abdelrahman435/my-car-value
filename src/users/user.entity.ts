import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity() // Mark a class as a Entity
export class User {
  @PrimaryGeneratedColumn() // Mark a id column as a primary column
  id: number;

  @Column()
  email: string;

  @Column()
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
