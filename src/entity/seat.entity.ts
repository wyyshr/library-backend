import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Seat{
  @PrimaryGeneratedColumn() id: number

  @Column() roomNum: number     // 房间号
  @Column() seatNum: number     // 座位号
  @Column() isOrder: boolean    // 是否被预约
  @Column() chooseTime1?: string // 预定时间段1
  @Column() date1?: string      // 预定日期1

  @Column() chooseTime2?: string // 预定时间段2
  @Column() date2?: string      // 预定日期2
}