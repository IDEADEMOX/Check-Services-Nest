import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginDto } from '@/dto/login.dto';
import { UserEntity } from '@/entities/user.entity';

@Controller('api')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  // 登录
  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto): Promise<UserEntity> {
    return this.loginService.login(loginDto);
  }
}
