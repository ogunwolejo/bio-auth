import {Test, TestingModule} from "@nestjs/testing";
import {JwtAuthGuard} from "./gql-auth.guard";
import {JwtService} from "@nestjs/jwt";
import {ExecutionContext, UnauthorizedException} from "@nestjs/common";

describe("JwtAuthGuard", () => {
  let guard: JwtAuthGuard;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe("canActivate", () => {
    it("should throw UnauthorizedException if authorization header is missing", async () => {
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {},
          }),
        }),
      } as ExecutionContext;

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(guard.canActivate(context)).rejects.toThrow(
        "Authorization header is missing",
      );
    });

    it("should throw UnauthorizedException if token is missing", async () => {
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {
              authorization: "Bearer ",
            },
          }),
        }),
      } as ExecutionContext;

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(guard.canActivate(context)).rejects.toThrow(
        "Token is missing",
      );
    });

    it("should throw UnauthorizedException if token is invalid", async () => {
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {
              authorization: "Bearer invalidtoken",
            },
          }),
        }),
      } as ExecutionContext;

      jwtService.verifyAsync = jest
        .fn()
        .mockRejectedValue(new Error("Invalid token"));

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(guard.canActivate(context)).rejects.toThrow("Invalid token");
    });

    it("should return true and attach user payload to request if token is valid", async () => {
      const userPayload = {id: 1, email: "test@example.com"};
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {
              authorization: "Bearer validtoken",
            },
          }),
        }),
      } as ExecutionContext;

      jwtService.verifyAsync = jest.fn().mockResolvedValue(userPayload);

      const result = await guard.canActivate(context);
      expect(result).toBe(true);
      expect(context.switchToHttp().getRequest().user).toEqual(userPayload);
    });
  });
});
