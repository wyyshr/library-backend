import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/entity/order.entity';
import { Repository } from 'typeorm';
import { OrderType, FindOrderType } from 'src/interface/orderType';
import { SignInType } from 'src/interface/signInType';
import { checkTime } from 'src/config/config';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) 
    private readonly orderRepository: Repository<Order>
  ){}

  async order(query: OrderType) {
    // 用户是否预约过座位
    // const isUserOrderArr = await this.orderRepository.find({
    //   account: query.account,
    //   date: query.date
    // })
    // 该座位是否被预约
    const isSeatOrderArr = await this.orderRepository.find({
      date: query.date,
      roomNum: query.roomNum,
      seatNum: query.seatNum
    })
    // 使用时间
    const useTime = query.useTime
    // 开始时间
    const startTime = query.startTime
    // 结束时间
    const endTime = startTime.length == 4 
    ? (parseInt(startTime.slice(0,1)) + parseInt(useTime.toString())).toString() + ':00'
    : (parseInt(startTime.slice(0,2)) + parseInt(useTime.toString())).toString() + ':00'

    const endTimeNum = endTime.length == 4 ? parseInt(endTime.slice(0,1)) : parseInt(endTime.slice(0,2))
    if(endTimeNum > 24) return 'error'
    let canUserorder = true
    // 存在该座位的预约
    if(isSeatOrderArr[0]){
      isSeatOrderArr.forEach(v => {
        if(!checkTime(v.startTime,v.endTime,startTime,endTime)) canUserorder = false
      });
    }
    
    if(canUserorder){
      await this.orderRepository.save({
        ...query,
        endTime,
        isCome: false,
        isLeave: false
      })
      return 'success'
    }else{
      return 'error'
    }
  }

  async findOrder(query: FindOrderType) {
    return await this.orderRepository.find(query)
  }

  // 签到
  async signIn(query: SignInType){
    const findOrderArr = {
      account: query.account,
      date: query.date,
      roomNum: query.roomNum,
      seatNum: query.seatNum,
      startTime: query.startTime,
      endTime: query.endTime,
    }
    const orderArr = await this.orderRepository.find(findOrderArr)
    if(orderArr[0]){
      await this.orderRepository.update(findOrderArr,{ isCome: true })
      return 'success'
    }else{
      return 'error'
    }
  }

  // 签退
  async signOut(query: SignInType){
    const findOrderArr = {
      account: query.account,
      date: query.date,
      roomNum: query.roomNum,
      seatNum: query.seatNum,
    }
    const orderArr = await this.orderRepository.find(findOrderArr)
    if(orderArr[0]){
      await this.orderRepository.update(findOrderArr,{ isLeave: true })
      return 'success'
    }else{
      return 'error'
    }
  }
  
}
