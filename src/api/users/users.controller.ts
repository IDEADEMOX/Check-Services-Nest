import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDto } from '@/dto/login.dto';
import { UserEntity } from '@/entities/user.entity';

@Controller('api')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 登录
  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto): Promise<UserEntity> {
    return this.usersService.login(loginDto);
  }
}
