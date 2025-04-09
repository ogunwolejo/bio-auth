import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import {GqlExecutionContext} from "@nestjs/graphql";
import {Observable} from "rxjs";

import {TokenService} from "../../../helpers/token";

@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;

    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException(
        "Missing or invalid Authorization header",
      );
    }

    const token = authHeader.split(" ")[1]; // Get the bearer token
    const decode = await this.tokenService.verifyToken(token);
    console.log("DECODE AUTH GUARD: ", decode)
    req.user = decode; //
    return true;
  }
}
