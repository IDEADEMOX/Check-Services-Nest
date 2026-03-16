import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@/entities/user.entity';
import { LoginDto } from '@/dto/login.dto';
import { BcryptUtil } from '@/utils/bcrypt.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  // 登录
  async login(loginDto: LoginDto): Promise<UserEntity> {
    // 校验用户名是否存在
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });
    if (!user) {
      throw new Error('用户名不存在');
    }
    // 校验密码是否正确
    const isPasswordValid = await BcryptUtil.verify(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new Error('密码错误');
    }
    return user;
  }

  // 根据ID查找用户
  async findById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new Error('用户不存在');
    }
    return user;
  }
}
