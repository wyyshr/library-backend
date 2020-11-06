import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/entity/order.entity';
import { Repository } from 'typeorm';
import { OrderType, FindOrderType, GetSeatType, GetOrderType } from 'src/interface/orderType';
import { SignInType } from 'src/interface/signInType';
import { checkTime, checkTimes, DateMinus, intervalTime } from 'src/config/config';
import { Seat } from 'src/entity/seat.entity';
import { ViolateType } from 'src/interface/violateType';
import { Violate } from 'src/entity/violate.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) 
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(Seat) 
    private readonly seatRepository: Repository<Seat>,

    @InjectRepository(Violate) 
    private readonly violateRepository: Repository<Violate>,
  ){}

  // 预约座位
  async order(query: OrderType) {
    const account = await this.violateRepository.findOne({account: query.account})
    // 存在黑名单
    if(account){
      const orderDate = query.date.slice(0,-3)
      const violateDate = account.date.slice(0, -3)
      const day1 = `${orderDate.slice(0,2)}/${orderDate.slice(3,5)}`
      const day2 = `${violateDate.slice(0,2)}/${violateDate.slice(3,5)}`
      const minusDays = DateMinus(day2, day1)
      if(minusDays < 3) return { type: 'none', msg: `${3 - minusDays}天内不可预约` }
    }

    const seat = {
      roomNum: query.roomNum, 
      seatNum: query.seatNum
    }
    const date = new Date()
    const month = date.getMonth() + 1
    const day = date.getDate().toString().length == 1 ? '0'+date.getDate() : date.getDate()
    const today = `${month}月${day}日`
    // 使用时间
    const useTime = query.useTime
    // 开始时间
    const startTime = query.startTime
    // 结束时间
    const endTime = startTime.length == 4 
    ? (parseInt(startTime.slice(0,1)) + parseInt(useTime.toString())).toString() + ':00'
    : (parseInt(startTime.slice(0,2)) + parseInt(useTime.toString())).toString() + ':00'
    const chooseTime = `${startTime}-${endTime}`
    
    const endTimeNum = endTime.length == 4 ? parseInt(endTime.slice(0,1)) : parseInt(endTime.slice(0,2))
    if(endTimeNum > 24) return {type: 'none', msg: '使用时长过多'}
    // 用户是否预约过
    const isUserOrder = await this.orderRepository.find({
      account: query.account,
      date: query.date
    })
    if(isUserOrder[0]){
      for (let i = 0; i < isUserOrder.length; i++) {
        const v = isUserOrder[i];
        if(!checkTime(v.startTime,v.endTime,startTime,endTime)) return {type: 'none', msg: '当前时间段您已预约'}
      }
    }
    const thisSeat = await this.seatRepository.findOne(seat);
    if(!thisSeat) {return {type: 'none', msg: '预约失败'}}
    // 第一天不存在预约 && 选择的是第一天
    (!thisSeat.date1 && query.date.split('-')[0] == today) && await this.seatRepository.update(seat,{ isOrder: true, chooseTime1: chooseTime, date1: query.date });
    // 第一天存在预约 && 选择的是第一天
    (thisSeat.date1 && query.date.split('-')[0] == today) && await this.seatRepository.update(seat,{ isOrder: true, chooseTime1: `${thisSeat.chooseTime1},${chooseTime}`, date1: query.date });
    // 第二天不存在预约 && 选择的是第二天
    (!thisSeat.date2 && query.date.split('-')[0] != today) && await this.seatRepository.update(seat,{ isOrder: true, chooseTime2: chooseTime, date2: query.date });
    // 第二天存在预约 && 选择的是第二天
    (thisSeat.date2 && query.date.split('-')[0] != today) && await this.seatRepository.update(seat,{ isOrder: true, chooseTime2: `${thisSeat.chooseTime2},${chooseTime}`, date2: query.date });

    // 添加预定记录
    await this.orderRepository.save({
      ...query,
      endTime,
      isCome: false,
      isLeave: false,
      isViolate: false
    })
    return {type: 'success', msg: '预约成功'}
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
      startTime: query.startTime,
      endTime: query.endTime,
    }
    const orderArr = await this.orderRepository.find(findOrderArr)
    const thisseat = {roomNum: query.roomNum, seatNum: query.seatNum}
    if(orderArr[0]){
      await this.orderRepository.update(findOrderArr,{ isLeave: true })
      const thisSeat = await this.seatRepository.findOne(thisseat)
      if(!thisSeat) return 'error'
      this.cancleSeat(query)  // 取消座位
      return 'success'
    }else{
      return 'error'
    }
  }

  // 获取座位
  async getSeat(query: GetSeatType) {
    this.changeDate()    // 初始化座位
    const isNotOrderSeats = await this.seatRepository.find({isOrder: false})  // 未被预定
    // 有空座位
    if(isNotOrderSeats[0]) return { type: 'success', msg: { roomNum: isNotOrderSeats[0].roomNum, seatNum: isNotOrderSeats[0].seatNum } }
    const isOrderSeats = await this.seatRepository.find({isOrder: true})      // 被预定

    const startTime = query.startTime // 开始时间
    const useTime = query.useTime // 使用时间
    const endTime = startTime.length == 4   // 结束时间
    ? (parseInt(startTime.slice(0,1)) + parseInt(useTime.toString())).toString() + ':00'
    : (parseInt(startTime.slice(0,2)) + parseInt(useTime.toString())).toString() + ':00'
    const data = {type: 'error',msg: {roomNum: 0,seatNum: 0}}
    const oneDayOrder = isOrderSeats.filter(v => !v.date2 );  
    // 只有一天被预定
    if(oneDayOrder[0]){
      // 不是同一天
      const notSameDate = oneDayOrder.filter(v => v.date1 != query.date);
      if(notSameDate[0]){
        data.type = 'success'
        data.msg.roomNum = notSameDate[0].roomNum
        data.msg.seatNum = notSameDate[0].seatNum
        return data
      }
      // 同一天但是不冲突
      const times = []
      const chooseTimes = oneDayOrder.map(v => v.chooseTime1)
      chooseTimes.forEach(v => {
        const arr = v.split(',')
        times.push(arr)
      });
      for (let i = 0; i < times.length; i++) {
        const items = times[i];
        if(checkTimes(items,startTime,endTime)){
          return {type: 'success',msg: { roomNum: oneDayOrder[i].roomNum, seatNum: oneDayOrder[i].seatNum } }
        }
      }
      return data
    }else{  // 两天被预定
      // 相同日期
      const sameDate1 = isOrderSeats.filter(v => v.date1 == query.date)
      const sameDate2 = isOrderSeats.filter(v => v.date2 == query.date)
      if(sameDate1[0]){   // 相同日期1
        const times = []
        const chooseTimes = sameDate1.map(v => v.chooseTime1)
        chooseTimes.forEach(v => {
          const arr = v.split(',')
          times.push(arr)
        });
        for (let i = 0; i < times.length; i++) {
          const items = times[i];
          if(checkTimes(items,startTime,endTime)){
            return {type: 'success',msg: { roomNum: sameDate1[i].roomNum, seatNum: sameDate1[i].seatNum } }
          }
        }
        return data
      }
      if(sameDate2[0]){   // 相同日期2
        const times = []
        const chooseTimes = sameDate2.map(v => v.chooseTime2)
        chooseTimes.forEach(v => {
          const arr = v.split(',')
          times.push(arr)
        });
        for (let i = 0; i < times.length; i++) {
          const items = times[i];
          if(checkTimes(items,startTime,endTime)){
            return {type: 'success',msg: { roomNum: sameDate2[i].roomNum, seatNum: sameDate2[i].seatNum } }
          }
        }
        return data
      }
      return data
    }
    
  }
  
  // 获取预约记录
  async getOrder(query: GetOrderType){
    return await this.orderRepository.find(query)
  }

  // 违约
  async violate(query: ViolateType){
    const order = await this.orderRepository.findOne({
      account: query.account,
      startTime: query.startTime,
      date: query.date
    })
    if(!order) return 'error'
    this.cancleSeat(query)  // 取消座位
    const account = await this.violateRepository.findOne({account: query.account})
    account ?
    await this.violateRepository.update({account: query.account},{times: account.times + 1, date: query.date}) :
    await this.violateRepository.save({account: query.account, times: 1, date: query.date});
    await this.orderRepository.update({
      account: query.account,
      date: query.date,
      startTime: query.startTime,
      endTime: query.endTime,
      roomNum: query.roomNum,
      seatNum: query.seatNum
    },{isViolate: true})    // 修改订单违约信息
    return 'success'
  }
  // 取消座位
  async cancleSeat(query: SignInType) {
    const seat = { roomNum: query.roomNum, seatNum: query.seatNum }
    const thisSeat = await this.seatRepository.findOne(seat)
    if(!thisSeat) return 'error'
    const chooseTime1Arr = thisSeat.chooseTime1.split(',');
    const chooseTime2Arr = thisSeat.chooseTime2.split(',');
    const newChooseTime1Arr = chooseTime1Arr.filter(v => v != `${query.startTime}-${query.endTime}`);
    const newChooseTime2Arr = chooseTime2Arr.filter(v => v != `${query.startTime}-${query.endTime}`);
    // 只有一天，第一天，仅有一个预约
    (thisSeat.date1 == query.date && !thisSeat.date2 && chooseTime1Arr.length == 1) && await this.seatRepository.update(seat,{ date1: '', chooseTime1: '', isOrder: false });
    // 只有一天，第二天，仅有一个预约
    (thisSeat.date2 == query.date && !thisSeat.date1 && chooseTime2Arr.length == 1) && await this.seatRepository.update(seat,{ date2: '', chooseTime2: '', isOrder: false });
    // 两天都有，第一天，仅有一个预约
    (thisSeat.date1 == query.date && thisSeat.date2 && chooseTime1Arr.length == 1) && await this.seatRepository.update(seat,{ date1: '', chooseTime1: '' });
    // 两天都有，第二天，仅有一个预约
    (thisSeat.date2 == query.date && thisSeat.date1 && chooseTime2Arr.length == 1) && await this.seatRepository.update(seat,{ date2: '', chooseTime2: '' });
    // 第一天，有多个预约
    chooseTime1Arr.length > 1 && await this.seatRepository.update(seat,{ chooseTime1: newChooseTime1Arr.join(',') });
    // 第二天，有多个预约
    chooseTime2Arr.length > 1 && await this.seatRepository.update(seat,{ chooseTime2: newChooseTime2Arr.join(',') });
    // 两天都有，第一天，有多个预约
    // (thisSeat.date1 == query.date && thisSeat.date2 && chooseTime1Arr.length > 1) && await this.seatRepository.update(seat,{ chooseTime1: newChooseTime1Arr.join(',') });
    // 两天都有，第二天，有多个预约
    // (thisSeat.date2 == query.date && thisSeat.date1 && chooseTime2Arr.length > 1) && await this.seatRepository.update(seat,{ chooseTime2: newChooseTime2Arr.join(',') });
  }
  // 初始化座位
  async changeDate(){
    const date = new Date()
    const month = date.getMonth() + 1
    const day = date.getDate().toString().length == 1 ? '0'+date.getDate() : date.getDate()
    const today = `${month}月${day}日`
    const allSeats = await this.seatRepository.find()
    for (let i = 0; i < allSeats.length; i++) {
      const v = allSeats[i];
      // 第一天是昨天且第二天有预约
      (v.date1.split('-')[0] != today && v.date2) && await this.seatRepository.update(v,{ date1: v.date2, date2: '', chooseTime1: v.chooseTime2, chooseTime2: '' });
      // 第一天是昨天且第二天没有预约
      (v.date1.split('-')[0] != today && !v.date2) && await this.seatRepository.update({id: v.id},{date1: '', chooseTime1: '', isOrder: false});
    }
  }
  // 检查订单
  async checkOrder(){
    const date = new Date()
    const month = date.getMonth() + 1
    const day = date.getDate().toString().length == 1 ? '0'+date.getDate() : date.getDate()
    const week = date.getDay()
    const today = `${month}月${day}日-周${week == 0 ? 7 : week}`
    const todayOrders = await this.orderRepository.find({date: today})
    const hour = date.getHours()
    const minute = date.getMinutes().toString().length == 1 ? `0${date.getMinutes()}` : date.getMinutes()
    const now = `${hour}:${minute}`
    // 今日还未签到订单
    const notSingInOrders = todayOrders.filter(v => !v.isCome)
    if(!notSingInOrders[0]) return 'success'
    for (let i = 0; i < notSingInOrders.length; i++) {
      const v = notSingInOrders[i];
      // 开始时间 <= 当前时间 且 相差大于15分钟
      if(parseInt(v.startTime.split(':')[0]) <= hour && intervalTime(v.startTime, now) > 15){
        // 违约
        this.violate({
          account: v.account,
          roomNum: v.roomNum,
          seatNum: v.seatNum,
          startTime: v.startTime,
          endTime: v.endTime,
          date: v.date
        }) 
      }
    }
  }
}
