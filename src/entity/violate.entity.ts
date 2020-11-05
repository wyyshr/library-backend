import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Violate{
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  account: string

  @Column()
  times: number

  @Column()
  date: string
}