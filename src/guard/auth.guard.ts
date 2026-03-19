// 认证守卫
import { buildSignatureContent } from '@/utils';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import CryptoJS from 'crypto-js';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    // 记录已使用的nonce
    const usedNonces = new Map<string, number>();

    // 防重放相关常量
    const SIGNATURE_KEY = 'signature';
    const method = request.headers['x-method'] as string | undefined;
    const nonce = request.headers['x-nonce'] as string | undefined;
    const timestamp = request.headers['x-timestamp'] as string | undefined;
    const url = request.headers['x-url'] as string | undefined;
    const signature = request.headers['x-signature'] as string | undefined;

    // 验证请求头是否完整
    if (!method || !nonce || !timestamp || !url || !signature) {
      return false;
    }

    // 验证时间
    const TIME_WINDOW = 5 * 60 * 1000; // 5分钟时间窗口
    const currentTime = Date.now();
    if (Math.abs(currentTime - Number(timestamp)) > TIME_WINDOW) {
      return false;
    }

    // 验证签名
    const expectedSignature = CryptoJS.HmacSHA256(
      buildSignatureContent(
        method,
        url,
        Number(timestamp),
        nonce,
        request.body,
      ),
      SIGNATURE_KEY,
    ).toString();
    if (signature !== expectedSignature) {
      return false;
    }
    // 验证nonce是否已使用// 4. 记录已使用的nonce
    // 记录当前时间戳
    usedNonces.set(nonce, Date.now() + 5 * 60 * 1000);

    return true;
  }
}
