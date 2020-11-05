import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seat } from 'src/entity/seat.entity';
import { AddSeatType } from 'src/interface/addSeatType';
import { DeleteSeatType } from 'src/interface/deleteSeatType';
import { GetAllSeatType } from 'src/interface/getAllSeatType';
import { Repository } from 'typeorm';

@Injectable()
export class SeatService {
  constructor(
    @InjectRepository(Seat) 
    private readonly seatRepository: Repository<Seat>,
  ){}

  // 获取座位
  async getAllSeat(query: GetAllSeatType){
    const allSeats = await this.seatRepository.find()
    const findObj = {
      pageSize: query.pageSize,
      current: query.current,
      length: allSeats.length,
    }
    const first = findObj.current * findObj.pageSize - findObj.pageSize
    const second = findObj.pageSize * findObj.current

    return await allSeats.slice(first, second)
  }

  // 添加座位
  async addSeat(query: AddSeatType){
    const seats = await this.seatRepository.find(query)
    if(seats[0]) return 'error'
    await this.seatRepository.save({ ...query, isOrder: false, chooseTime1: '', date1: '', chooseTime2: '', date2: ''})
    return 'success'
  }
  // 删除座位
  async deleteSeat(body: DeleteSeatType) {
    await this.seatRepository.delete(body.id)
    return 'success'
  }
}
