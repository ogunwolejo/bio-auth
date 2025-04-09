import {Injectable, UnauthorizedException} from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import { decode, Jwt, JwtPayload, sign, verify } from 'jsonwebtoken';

interface Payload {
  id: number;
  email: string;
  expires: number;
}

@Injectable()
export class TokenService {

  constructor(private configService: ConfigService) {}
  generateToken(payload: Payload): string {
    const secret = this.configService.get<string>('SECRET');
    if (!secret) {
      throw new Error('SECRET environment variable is not defined');
    }

    const {expires, id, email} = payload;
    return sign({id, email}, secret, {
      algorithm: "HS256",
      expiresIn: expires,
    });
  }

  decodeToken(tkn: string): Jwt | null {
    return decode(tkn, {
      complete: true,
    });
  }

  async verifyToken(tkn: string): Promise<JwtPayload | string | Error> {
    try {
      const secret = this.configService.get<string>('SECRET');
      if (!secret) {
        throw new Error('SECRET environment variable is not defined');
      }

      const decoded =  await verify(tkn, secret, {
        algorithms: ["HS256"],
        complete: true,
      });

      return decoded.payload;
    } catch (e) {
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
}
