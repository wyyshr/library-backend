import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Admin } from 'src/entity/admin.entity';
import { Order } from 'src/entity/order.entity';
import { Violate } from 'src/entity/violate.entity';

@Module({
  imports:[TypeOrmModule.forFeature([User, Admin, Order, Violate])],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
