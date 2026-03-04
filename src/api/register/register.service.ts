import { Injectable } from '@nestjs/common';
import { UserEntity } from '@/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from '@/dto/register.dto';
import { BcryptUtil } from '@/utils/bcrypt.util';

@Injectable()
export class RegisterService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly registerRepository: Repository<UserEntity>,
  ) {}

  // 注册
  async register(registerDto: RegisterDto): Promise<UserEntity> {
    // 校验用户名是否已存在
    const existingUser = await this.registerRepository.findOne({
      where: { username: registerDto.username },
    });
    if (existingUser) {
      throw new Error('用户名已存在');
    }
    // 密码加密
    const encryptedPassword = await BcryptUtil.encrypt(registerDto.password);
    console.log(encryptedPassword);
    // 用户
    const user = {
      ...registerDto,
      password: encryptedPassword,
    };
    // 保存用户
    return this.registerRepository.save(user);
  }
}
