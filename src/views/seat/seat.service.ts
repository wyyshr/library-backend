import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seat } from 'src/entity/seat.entity';
import { AddSeatType } from 'src/interface/addSeatType';
import { Repository } from 'typeorm';

@Injectable()
export class SeatService {
  constructor(
    @InjectRepository(Seat) 
    private readonly seatRepository: Repository<Seat>,
  ){}

  // 添加座位
  async addSeat(query: AddSeatType){
    const seats = await this.seatRepository.find(query)
    if(seats[0]) return 'error'
    await this.seatRepository.save({ ...query, isOrder: false})
    return 'success'
  }
  // 删除座位
  async deleteSeat() {
    
  }
}
