import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { payloadType, TokenRequest } from '@/api/types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: configService.get('JWT_REFRESH_SECRET') || 'refresh-secret',
      passReqToCallback: true,
    });
  }

  validate(req: TokenRequest, payload: payloadType) {
    const refreshToken = req.body.refreshToken;
    return { ...payload, refreshToken };
  }
}
