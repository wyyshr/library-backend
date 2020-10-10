import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User{
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  account: string

  @Column()
  password: string
}