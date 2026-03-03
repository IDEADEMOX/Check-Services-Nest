import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterDto } from './dto/register.dto';

@Controller('api')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post('register')
  @HttpCode(200)
  async register(@Body() registerDto: RegisterDto) {
    return this.registerService.register(registerDto);
  }
}
