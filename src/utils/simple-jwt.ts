import crypto from 'crypto';

export class SimpleJWT {
  // 密钥
  private secret: string;

  constructor(secret: string) {
    this.secret = secret;
  }

  // Base64编码
  base64urlEncode(str: string) {
    return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  // Base64解码
  base64urlDecode(str: string) {
    return atob(str.replace(/-/g, '+').replace(/_/g, '/'));
  }

  // 生成签名
  sign(payload: string) {
    const signature = crypto
      .createHmac('sha256', this.secret)
      .update(payload)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    return signature;
  }

  // 生成JWT
  signToken(payload: string, expiresIn: string = '1h') {
    const header = { alg: 'HS256', typ: 'JWT' };

    // 添加过期时间
    const exp =
      Math.floor(Date.now() / 1000) + this.parseExpirationTime(expiresIn);
    const fullPayload = { ...payload, exp };

    // 编码header和payload
    const headerBase64 = this.base64urlEncode(JSON.stringify(header));
    const payloadBase64 = this.base64urlEncode(JSON.stringify(fullPayload));

    // 生成签名
    const signature = this.sign(`${headerBase64}.${payloadBase64}`);

    // 生成JWT
    return `${headerBase64}.${payloadBase64}.${signature}`;
  }

  // 验证JWT
  verifyToken(token: string) {
    const [headerBase64, payloadBase64, signature] = token.split('.');

    // 验证签名
    const expectedSignature = this.sign(`${headerBase64}.${payloadBase64}`);
    if (signature !== expectedSignature) {
      throw new Error('Token signature verification failed');
    }

    // 解码payload
    const payload = JSON.parse(this.base64urlDecode(payloadBase64));

    // 验证过期时间
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      throw new Error('Token expired');
    }

    return payload;
  }

  // 解析过期时间
  parseExpirationTime(exp: number) {
    const unit = exp.slice(-1);
    const value = parseInt(exp.slice(0, -1));

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 60 * 60;
      case 'd':
        return value * 60 * 60 * 24;
      default:
        return 3600;
    }
  }
}
