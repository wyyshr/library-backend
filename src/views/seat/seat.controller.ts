import { Body, Controller, Delete, Get, Query } from '@nestjs/common';
import { AddSeatType } from 'src/interface/addSeatType';
import { DeleteSeatType } from 'src/interface/deleteSeatType';
import { GetAllSeatType } from 'src/interface/getAllSeatType';
import { SeatService } from './seat.service';

@Controller('seat')
export class SeatController {
  constructor(
    private readonly seatService: SeatService
  ){}

  // 添加座位
  @Get('/addSeat')
  addSeat(@Query() query: AddSeatType) {
    return this.seatService.addSeat(query)
  }

  // 获取座位信息
  @Get('/getAllSeat')
  getAllSeat(@Query() query: GetAllSeatType){
    return this.seatService.getAllSeat(query)
  }

  // 删除座位
  @Delete('/deleteSeat')
  deleteSeat(@Body() body: DeleteSeatType){
    return this.seatService.deleteSeat(body)
  }
}
