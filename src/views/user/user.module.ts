import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Admin } from 'src/entity/admin.entity';
import { Order } from 'src/entity/order.entity';

@Module({
  imports:[TypeOrmModule.forFeature([User, Admin, Order])],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
