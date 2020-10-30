import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/entity/order.entity';
import { Seat } from 'src/entity/seat.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Order, Seat])],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule {}
