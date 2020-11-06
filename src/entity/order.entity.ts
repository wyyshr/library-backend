import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Order{
  @PrimaryGeneratedColumn() id: number

  @Column() account: string   // 账号
  @Column() date: string      // 使用日期
  @Column() startTime: string // 开始时间
  @Column() endTime: string   // 结束时间
  @Column() useTime: number   // 使用时长
  @Column() userNum: number   // 使用人数
  @Column() roomNum: number   // 房间号
  @Column() seatNum: number   // 座位号
  @Column() isCome: boolean   // 是否签到
  @Column() isLeave: boolean  // 是否签退
  @Column() isViolate: boolean  // 是否违约
}