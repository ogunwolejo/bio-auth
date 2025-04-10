import { Test, TestingModule } from "@nestjs/testing";
import { AuthResolver } from "./auth.resolver";
import { AuthService } from "./auth.service";
import { UsersService } from "../users/users.service";
import { PasskeyService } from "../passkey/passkey.service";
import { LoginInputDto } from "./dto/login-input.dto";
import { CreateUserInputDto } from "./dto/create-user-input.dto";
import { UsersModel, RegisteredUser  } from "../users/users.model";
import { GraphQLError } from "graphql/error";
import { JwtModule } from '@nestjs/jwt';
import {PasskeyModule} from '../passkey/passkey.module';
import { JwtService } from '@nestjs/jwt';

describe("AuthResolver", () => {
  let authResolver: AuthResolver;
  let authService: AuthService;
  let usersService: UsersService;
  let passkeyService: PasskeyService;
  let jwtService: JwtService;

  const mockUser: UsersModel = {
    id: 1,
    email: "jayjay@gmail.com",
    name: "jay jay",
    createdAt: new Date(2025, 4, 9),
    updatedAt: new Date(2025, 4, 9),
    AccessToken: "accessToken",
    RefreshToken: "refreshToken",
  };

  const mockRegistered: RegisteredUser  = {
    id: 1,
    email: "jayjay@gmail.com",
    name: "jay jay",
    createdAt: new Date(2025, 2, 13),
    updatedAt: new Date(2025, 5, 13),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PasskeyModule,
        JwtModule.register({
          secret: 'testSecret', // Use a test secret
          signOptions: { expiresIn: '60s' }, // Set any options you need
        }),
      ],
      providers: [
        AuthResolver,
        {
          provide: AuthService,
          useValue: {
            validateUser:  jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            CreateUser:  jest.fn(),
          },
        },
        {
          provide: PasskeyService, // Mock PasskeyService
          useValue: {
            // Add any methods you need to mock here
            someMethod: jest.fn(),
          },
        },
      ],
    }).compile();

    authResolver = module.get<AuthResolver>(AuthResolver);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    passkeyService = module.get<PasskeyService>(PasskeyService);
    jwtService = module.get<JwtService>(JwtService);

  });

  describe("login", () => {
    it("should return a user model when login is successful", async () => {
      const input: LoginInputDto = {
        email: "jayjay@gmail.com",
        pass: "password",
      };
      authService.validateUser  = jest.fn().mockResolvedValue(mockUser );

      const result = await authResolver.login(input);
      expect(result).toEqual(mockUser );
      expect(authService.validateUser ).toHaveBeenCalledWith(input);
    });

    it("should throw an error if login fails", async () => {
      const input: LoginInputDto = {
        email: "jayjay@gmail.com",
        pass: "wrongpassword",
      };
      authService.validateUser  = jest
        .fn()
        .mockRejectedValue(new GraphQLError("Invalid credentials"));

      await expect(authResolver.login(input)).rejects.toThrow(GraphQLError);
      await expect(authResolver.login(input)).rejects.toThrow("Invalid credentials");
    });
  });

  describe("registerUser ", () => {
    it("should return a registered user when registration is successful", async () => {
      const input: CreateUserInputDto = {
        email: "jayjay@gmail.com",
        password: "password",
        name: "jay jay",
      };
      usersService.CreateUser  = jest.fn().mockResolvedValue(mockRegistered);

      const result = await authResolver.registerUser(input);
      expect(result).toEqual(mockRegistered.id);
      expect(usersService.CreateUser).toHaveBeenCalledWith(input);
    });

    it("should throw an error if registration fails", async () => {
      const input: CreateUserInputDto = {
        email: "jayjay@gmail.com",
        password: "password",
        name: "jay jay",
      };
      usersService.CreateUser  = jest
        .fn()
        .mockRejectedValue(new GraphQLError("Registration failed"));

      await expect(authResolver.registerUser (input)).rejects.toThrow(GraphQLError);
      await expect(authResolver.registerUser (input)).rejects.toThrow("Registration failed");
    });
  });
});
