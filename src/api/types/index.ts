import { Request } from 'express';

export type payloadType = {
  sub: number;
  username: string;
};

export interface TokenRequest extends Request {
  body: { refreshToken: string } & Omit<
    Request['body'],
    keyof { refreshToken: string }
  >;
}
