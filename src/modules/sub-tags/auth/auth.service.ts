import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { User } from '../../../database/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hashPasswordHelper } from './common/utils';
import { EmailQueue } from '../queue/queues/email.queue';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';



@Injectable()
export class AuthService {
   private users = [
    {id: 1, name: 'NVA', email:'mail1@gmail.com' }, 
    {id: 2, name: 'NVB', email:'mail2@gmail.com' },
  ];
constructor(
  @Inject(CACHE_MANAGER) private cacheManager: Cache,
  @InjectModel(User.name) private userModel: Model<User>,
  private emailQueue: EmailQueue, 
) {}
//check email
   isEmailExit = async(email : string) => {
    const user = await this.userModel.exists({email});
    if(user) {
      console.log(`Email: ${email} đã được sử dụng!`);
      return true;
    }
    return false;
  }

//register
async create(createAuthDto: CreateAuthDto) {
  const {name, password, email} = createAuthDto;
  //check mail
  const isExit = await this.isEmailExit(email);
  if (isExit === true){
    throw new BadRequestException(`Email exit: ${email}. Please use another email!`);   
  }
  //hash pword
  const hashPassword = await hashPasswordHelper(password);
  const user = await this.userModel.create({
    name, email, password: hashPassword
  })

  //send email
 await this.emailQueue.sendWelcomeEmail(user.email);

  //xoa cache
 await this.cacheManager.del('uses_list');

  console.log("Tạo tài khoản thành công!");
  return {
    _id: user._id,
    message: 'Tạo tài khoản thành công!, vui lòng kiểm tra email để xác nhận tài khoản.',
  };

}


 async findAll() {
    const cachedUsers = 'uses_list';
    const cachedData = await this.cacheManager.get(cachedUsers);
    if (cachedData) {
      console.log('Lấy dữ liệu từ cache');
      return cachedData;
    }
    console.log('Lấy dữ liệu từ DB');
    const users = await this.userModel.find();
    // console.log('Lay dữ liệu từ Mock!');
    // const users = this.users;


    await this.cacheManager.set(cachedUsers, users, 30); 
    return users;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
