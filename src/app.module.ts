import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './views/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModule } from './views/order/order.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '123456',
    database: 'library',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
  }),UserModule, OrderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
