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
    try {
      // Exclude login and register endpoints
      const excludedPaths = ['/auth/login', '/api/register'];
      if (excludedPaths.some((path) => req.baseUrl.startsWith(path))) {
        next();
      }

      // Extract token from cookie
      const token = req.cookies?.accessToken as string;

      if (!token) {
        throw new UnauthorizedException('认证失败');
      }

      // Verify token
      const payload = this.jwtHelperService.verifyToken(token, 'access');

      // Check if user exists and hasn't logged out
      const user = await this.usersService.findById(payload.sub);

      if (!user) {
        throw new UnauthorizedException('认证失败');
      }

      // Attach user to request
      req.user = user;

      next();
    } catch {
      throw new UnauthorizedException('认证失败');
    }
  }
}
