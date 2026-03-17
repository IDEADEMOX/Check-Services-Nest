import { UserEntity } from '@/entities/user.entity';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Request & { user?: UserEntity } = ctx
      .switchToHttp()
      .getRequest();
    return request.user;
  },
);
