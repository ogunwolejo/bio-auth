import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException("Authorization header is missing");
    }

    const token = authHeader.split(" ")[1]; // Extract the token from the Bearer string

    if (!token) {
      throw new UnauthorizedException("Token is missing");
    }

    try {
      const payload = await this.jwtService.verifyAsync(token); // Verify the token
      request.user = payload; // Attach the user payload to the request object
      return true; // Allow access
    } catch (error) {
      throw new UnauthorizedException("Invalid token");
    }
  }
}
