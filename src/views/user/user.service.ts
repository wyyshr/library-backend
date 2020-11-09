import { Injectable } from '@nestjs/common';
import { AdminType, UserType } from 'src/interface/userType';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entity/user.entity';
import { Admin } from 'src/entity/admin.entity';
import axios from 'axios'
import { Order } from 'src/entity/order.entity';
import { GetAllUserType } from 'src/interface/getAllSeatType';
import { Violate } from 'src/entity/violate.entity';
import { ChangeUserViolateType } from 'src/interface/ChangeUserViolateType';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) 
    private readonly userRepository: Repository<User>,

    @InjectRepository(Admin) 
    private readonly adminRepository: Repository<Admin>,

    @InjectRepository(Order) 
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(Violate) 
    private readonly violateRepository: Repository<Violate>,
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
 
  async adminLogin(body: AdminType){
    const admin = await this.adminRepository.findOne(body)
    if(!admin) return {
      type: 'error',
      msg: '用户名或密码错误'
    }
    return {
      type: 'success',
      msg: '登陆成功'
    }
  }

  async adminRegister(body: AdminType){
    const admin = await this.adminRepository.findOne({username: body.username})
    if(admin) return {
      type: 'error',
      msg: '用户名已存在'
    }
    await this.adminRepository.save(body)
    return {
      type: 'success',
      msg: '注册成功'
    }
  }
  // 二维码
  async getScanCode() {
    const data = new Date().getTime().toString().slice(0,-3)
    const url = `https://qr.api.cli.im/newqr/createParam?qrcodeconfig%5Bdata%5D=${data}&qrcodeconfig%5Bsize%5D=400&qrcodeconfig%5Blogourl%5D=&qrcodeconfig%5Blogoshape%5D=ellipse&qrcodeconfig%5Bforetype%5D=2&qrcodeconfig%5Bforecolor%5D=%2368B56B&qrcodeconfig%5Bgradient_way%5D=vertical&qrcodeconfig%5Bforecolor2%5D=%2304777A&qrcodeconfig%5Beye_use_fore%5D=1&qrcodeconfig%5Bbgcolor%5D=%23ffffff&qrcodeconfig%5Bbackground%5D=%2F%2Fstatic.clewm.net%2Fcli%2Fimages%2Fbackground%2F31.png&qrcodeconfig%5Btransparent%5D=0&qrcodeconfig%5Bqrcode_eyes%5D=circle_circle&qrcodeconfig%5Boutcolor%5D=%23063492&qrcodeconfig%5Bincolor%5D=%231183E8&qrcodeconfig%5Bbody_type%5D=17&qrcodeconfig%5Bmarginblock%5D=2&qrcodeconfig%5Blevel%5D=H&qrcodeconfig%5Bqr_rotate%5D=0&qrcodeconfig%5Btext%5D=&qrcodeconfig%5Blogo_pos%5D=0&callback=__qrStyle5`
    const res= await axios({
      url,
      headers: {
        'accept': '*/*',
        'referer': 'https://cli.im/?fromTopNav=1',
        'sec-fetch-dest': 'script',
        'sec-fetch-mode': 'no-cors',
        'sec-fetch-site': 'same-site',
      }
    })
    return res.data.slice(29, -4)
  }
  // 获取用户信息(含订单)
  async getUserInfo(query: GetAllUserType){
    const userArr = await this.userRepository.find()
    const violateArr = await this.violateRepository.find()
    const findObj = {
      pageSize: query.pageSize,
      current: query.current,
      length: userArr.length
    }
    const first = findObj.current * findObj.pageSize - findObj.pageSize
    const second = findObj.pageSize * findObj.current
    
    const userOrders = []
    if(userArr[0]){
      for (let i = 0; i < userArr.length; i++) {
        const v = userArr[i];
        const userOrder = await this.orderRepository.find({account: v.account})
        const violate = await this.violateRepository.findOne({account: v.account})
        const userOrderObj = { account: v.account, order: userOrder, violate }
        userOrders.push(userOrderObj)
      }
    }
    if(!query.current) {
      return userOrders
    }
    return {
      list: userOrders.slice(first, second),
      total: findObj.length
    }
  }
  // 修改用户违约次数
  async changeUserViolate(body: ChangeUserViolateType){
    const user = await this.violateRepository.findOne({account: body.account})
    const date = new Date()
    const month = date.getMonth() + 1
    const day = date.getDate().toString().length == 1 ? '0'+date.getDate() : date.getDate()
    const week = date.getDay()
    const today = `${month}月${day}日-周${week == 0 ? 7 : week}`
    if(body.times == 0){
      await this.violateRepository.delete({account: body.account})
      return 'success'
    }
    user ? 
    await this.violateRepository.update({account: body.account},{times: body.times}) :
    await this.violateRepository.save({
      account: body.account,
      times: body.times,
      date: today
    })
    return 'success'
  }
}
