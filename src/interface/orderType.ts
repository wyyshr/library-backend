export interface OrderType {
  
  account: string   // 账号
  date: string      // 使用日期
  startTime: string // 开始时间
  useTime: number   // 使用时长
  userNum: number   // 使用人数
  roomNum: number,  // 房间号
  seatNum: number   // 座位号
  
}
export interface FindOrderType {
  account: string   // 账号
}
export interface GetSeatType {
  startTime: string
  date: string
  useTime: number
}
export interface GetOrderType {
  account: string   // 账号
}