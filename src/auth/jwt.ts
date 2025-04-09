import {ExtractJwt, Strategy} from "passport-jwt";
import {PassportStrategy} from "@nestjs/passport";
import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";

interface JwtPayload {
  email: string;
  id: number; // Adjust the type based on your actual user ID type
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private config: ConfigService) {
    const secret = config.get<string>("SECRET");
    if (!secret) {
      throw new Error("JWT secret is not defined in the environment variables");
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload) {
    return {email: payload.email, id: payload.id};
  }
}
