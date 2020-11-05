import { Controller, Get, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderType, FindOrderType, GetSeatType, GetOrderType } from 'src/interface/orderType';
import { SignInType } from 'src/interface/signInType';
import { ViolateType } from 'src/interface/violateType';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService
  ){}

  // 预约
  @Get()
  order(@Query() query: OrderType) {
    return this.orderService.order(query)
  }

  // 查询预约记录
  @Get('/find')
  findOrder(@Query() query: FindOrderType) {
    return this.orderService.findOrder(query)
  }

  // 签到
  @Get('/signIn')
  signIn(@Query() query: SignInType) {
    return this.orderService.signIn(query)
  }

  // 签退
  @Get('/signOut')
  signOut(@Query() query: SignInType) {
    return this.orderService.signOut(query)
  }

  // 获取座位
  @Get('/getSeat')
  getSeat(@Query() query: GetSeatType) {
    return this.orderService.getSeat(query)
  }

  // 获取预约
  @Get('/getOrder')
  getOrder(@Query() query: GetOrderType) {
    return this.orderService.getOrder(query)
  }

  // 违约
  @Get('/violate')
  violate(@Query() query: ViolateType){
    return this.orderService.violate(query)
  }
}
