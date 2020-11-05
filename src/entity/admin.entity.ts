import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Admin{
  @PrimaryGeneratedColumn() id: number

  @Column() 
  username: string   // 用户名

  @Column() 
  password: string   // 密码

}