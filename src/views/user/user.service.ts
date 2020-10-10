import { Injectable } from '@nestjs/common';
import { UserType } from 'src/interface/userType';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) 
    private readonly userRepository: Repository<User>
  ){}
  
  async register(query: UserType){
    const isAccountExist = await this.userRepository.find({account: query.account})
    if(isAccountExist[0]) return 'error'
    await this.userRepository.save(query)
    return 'success'
  }

  async login(query: UserType){
    const isUserExist = await this.userRepository.find(query)
    if(!isUserExist[0]) return 'error'
    return 'success'
  }
}
