import { Body, Controller, HttpCode, Post, Res, Session } from '@nestjs/common';
import { LoginDto } from '@/dto/login.dto';
import { UserEntity } from '@/entities/user.entity';
import { AuthService } from '../auth/auth.service';
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
    @Session() session: Record<string, any>,
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
    // 存到session
    session.user = other;
    return other;
  }

  // 刷新token
  @Post('refresh')
  async refreshTokens(
    @Res({ passthrough: true }) res: Response,
    @Session() session: Record<string, any>,
  ) {
    // 从session中获取用户信息
    const { user } = session as { user: UserEntity };
    const { accessToken: newAccessToken } =
      await this.authService.refreshTokens(user.refreshToken);
    // 存到cookie
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    return user;
  }

  // 退出登录
  @Post('logout')
  async logout(
    @Body() user: UserEntity,
    @Res({ passthrough: true }) res: Response,
    @Session() session: Record<string, any>,
  ) {
    // 清除cookie
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    // 清除session
    session.user = null;
    return this.authService.logout(user.id);
  }
}
