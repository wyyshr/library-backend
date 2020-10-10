import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UserType } from 'src/interface/userType';

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
}
