import { Module, Global } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { JwtHelperService } from './jwt.service';

// 全局模块，避免重复导入
@Global()
@Module({
  imports: [
    // 动态注册 JwtModule（不直接写死配置）
    NestJwtModule.register({}),
  ],
  providers: [JwtHelperService],
  exports: [JwtHelperService], // 全局导出，其他模块可直接注入
})
export class JwtModule {}
