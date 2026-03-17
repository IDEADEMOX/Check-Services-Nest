import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserEntity } from '@/entities/user.entity';
import { JwtHelperService } from '@/jwt/jwt.service';
import { LoginDto } from '@/dto/login.dto';
import { BcryptUtil } from '@/utils/bcrypt.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly JwtHelperService: JwtHelperService,
  ) {}

  // 登录
  async login(loginDto: LoginDto): Promise<UserEntity> {
    // 校验用户名是否存在
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new Error('用户名不存在');
    }
    // 校验密码是否正确
    const isPasswordValid = await BcryptUtil.verify(
      loginDto.password,
      user.password,
    );

    // 生成访问令牌
    const { accessToken, refreshToken } = await this.generateAccessToken(user);

    if (!isPasswordValid) {
      throw new Error('密码错误');
    }

    const result = {
      ...user,
      accessToken,
      refreshToken,
    } as UserEntity & { accessToken: string; refreshToken: string };

    return result;
  }

  // 注销用户, 清除用户的refresh token
  async logout(userId: number) {
    await this.usersService.clearRefreshToken(userId);
    return { message: 'Logged out successfully' };
  }

  // 生成访问令牌
  async generateAccessToken(user: UserEntity): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const payload = { sub: user.id, username: user.username };
    // 生成access token（短期，如15分钟）
    const accessToken = this.JwtHelperService.signToken(payload, 'access');

    // 生成refresh token（长期，如7天）
    const refreshToken = this.JwtHelperService.signToken(payload, 'refresh');

    // 保存refresh token到数据库
    await this.usersService.updateRefreshToken(user.id, refreshToken);

    // 返回access token和refresh token
    return { accessToken, refreshToken };
  }

  // 刷新访问令牌
  async refreshTokens(refreshToken: string) {
    try {
      // 验证refresh token
      const payload = this.JwtHelperService.verifyToken(
        refreshToken,
        'refresh',
      ) as { sub: number; username: string };
      this.JwtHelperService.verifyToken(refreshToken, 'refresh');

      // 从数据库获取用户
      const user = await this.usersService.findById(payload.sub);

      // 验证refresh token是否匹配
      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // 验证refresh token是否过期
      if (user.refreshTokenExpires && new Date() > user.refreshTokenExpires) {
        throw new UnauthorizedException('Refresh token expired');
      }

      // 生成新的token对
      return this.generateAccessToken(user);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
