import {
  Body,
  Controller,
  HttpCode,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LoginDto } from '@/dto/login.dto';
import { UserEntity } from '@/entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { RefreshTokenGuard } from '../auth/guards/refresh-token.guard';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RefreshTokenDto } from '@/dto/refresh-token.dto';
import { CurrentUser } from '@/decorators/current-user.decorator';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 登录
  @Post('login')
  @HttpCode(200)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserEntity> {
    const { accessToken, ...other } = (await this.authService.login(
      loginDto,
    )) as UserEntity & { accessToken: string };
    // 存到cookie
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    return other;
  }

  // 刷新token
  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto.refreshToken);
  }

  // 退出登录
  @Post('logout')
  @UseGuards(AccessTokenGuard)
  async logout(@CurrentUser() user: UserEntity) {
    return this.authService.logout(user.id);
  }

  // 获取用户信息
  @Post('profile')
  @UseGuards(AccessTokenGuard)
  getProfile(@CurrentUser() user: UserEntity) {
    return user;
  }
}
