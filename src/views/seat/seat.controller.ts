import { Body, Controller, Delete, Get, Query } from '@nestjs/common';
import { AddSeatType } from 'src/interface/addSeatType';
import { SeatService } from './seat.service';

@Controller('seat')
export class SeatController {
  constructor(
    private readonly seatService: SeatService
  ){}

  @Get('/addSeat')
  addSeat(@Query() query: AddSeatType) {
    return this.seatService.addSeat(query)
  }
  @Delete('/deleteSeat')
  deleteSeat(@Query()query, @Body() body){
    return this.seatService.deleteSeat()
  }
}
