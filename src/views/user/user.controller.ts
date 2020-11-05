import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { AdminType, UserType } from 'src/interface/userType';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService
  ){}

  @Get('/register')
  register(@Query() query: UserType) {
    return this.userService.register(query)
  }

  @Get('/login')
  login(@Query() query: UserType) {
    return this.userService.login(query)
  }
  
  @Post('/adminLogin')
  adminLogin(@Body() body: AdminType){
    return this.userService.adminLogin(body)
  }
  
  @Post('/adminRegister')
  adminRegister(@Body() body: AdminType){
    return this.userService.adminRegister(body)
  }
  
  // 获取签到签退二维码
  @Get('/getScanCode')
  getScanCode(){
    return this.userService.getScanCode()
  }

  // 获取用户信息（预约记录）
  @Get('/getUserInfo')
  getUserInfo(){
    return this.userService.getUserInfo()
  }
}
