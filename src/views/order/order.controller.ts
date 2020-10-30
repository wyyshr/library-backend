import { Controller, Get, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderType, FindOrderType, GetSeatType, GetOrderType } from 'src/interface/orderType';
import { SignInType } from 'src/interface/signInType';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService
  ){}

  @Get()
  order(@Query() query: OrderType) {
    return this.orderService.order(query)
  }

  @Get('/find')
  findOrder(@Query() query: FindOrderType) {
    return this.orderService.findOrder(query)
  }

  @Get('/signIn')
  signIn(@Query() query: SignInType) {
    return this.orderService.signIn(query)
  }

  @Get('/signOut')
  signOut(@Query() query: SignInType) {
    return this.orderService.signOut(query)
  }

  @Get('/getSeat')
  getSeat(@Query() query: GetSeatType) {
    return this.orderService.getSeat(query)
  }

  @Get('/getOrder')
  getOrder(@Query() query: GetOrderType) {
    return this.orderService.getOrder(query)
  }
}
