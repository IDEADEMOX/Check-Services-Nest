import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtHelperService } from '@/jwt/jwt.service';
import { UsersService } from '@/api/users/users.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtHelperService: JwtHelperService,
    private readonly usersService: UsersService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Clear expired token cookie if it exists
    const clearExpiredTokenCookie = () => {
      if (req.cookies?.accessToken) {
        res.clearCookie('accessToken', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        });
      }
    };

    try {
      // Exclude login and register endpoints
      const excludedPaths = ['/auth/login', '/api/register', '/auth/logout'];
      if (excludedPaths.some((path) => req.baseUrl.startsWith(path))) {
        next();
        return;
      }

      // Extract token from cookie
      const token = req.cookies?.accessToken as string;

      if (!token) {
        clearExpiredTokenCookie();
        throw new UnauthorizedException('认证失败');
      }

      // Verify token
      const payload = this.jwtHelperService.verifyToken(token, 'access');

      // Check if user exists and hasn't logged out
      const user = await this.usersService.findById(payload.sub);

      if (!user) {
        clearExpiredTokenCookie();
        throw new UnauthorizedException('认证失败');
      }

      // Attach user to request
      req.user = user;

      next();
    } catch {
      clearExpiredTokenCookie();
      throw new UnauthorizedException('认证失败');
    }
  }
}
