import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity() // Mark a class as a Entity
export class User {
  @PrimaryGeneratedColumn() // Mark a id column as a primary column
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;
}
