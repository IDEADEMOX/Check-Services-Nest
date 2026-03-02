import { Injectable } from '@nestjs/common';
import { RegisterEntity } from './entities/register.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class RegisterService {
  constructor(
    @InjectRepository(RegisterEntity)
    private readonly registerRepository: Repository<RegisterEntity>,
  ) {}

  // 注册
  async register(registerDto: RegisterDto): Promise<RegisterEntity> {
    // 校验用户名是否已存在
    const existingUser = await this.registerRepository.findOne({
      where: { username: registerDto.username },
    });
    if (existingUser) {
      throw new Error('用户名已存在');
    }
    return this.registerRepository.save(registerDto);
  }
}
