import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/entity/order.entity';
import { Seat } from 'src/entity/seat.entity';
import { Violate } from 'src/entity/violate.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Order, Seat, Violate])],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule {}
