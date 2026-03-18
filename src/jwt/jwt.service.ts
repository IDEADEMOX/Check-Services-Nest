import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtHelperService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // 统一生成 Token（抽离 AuthService 中的生成逻辑）
  signToken(payload: Record<string, any>, type: 'access' | 'refresh'): string {
    const secret: string =
      type === 'access'
        ? this.configService.get('JWT_ACCESS_SECRET') || 'access-secret'
        : this.configService.get('JWT_REFRESH_SECRET') || 'refresh-secret';

    const expiresIn = type === 'access' ? '1m' : '7d';

    return this.jwtService.sign(payload, { secret, expiresIn });
  }

  // 统一验证 Token
  verifyToken(token: string, type: 'access' | 'refresh'): Record<string, any> {
    const secret: string =
      type === 'access'
        ? this.configService.get('JWT_ACCESS_SECRET') || 'access-secret'
        : this.configService.get('JWT_REFRESH_SECRET') || 'refresh-secret';

    return this.jwtService.verify(token, { secret });
  }
}
