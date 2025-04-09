import {Test, TestingModule} from "@nestjs/testing";
import {AuthService} from "./auth.service";
import {UsersService} from "../users/users.service";
import {JwtService} from "@nestjs/jwt";
import {BcryptPasswordService} from "../helpers/bcrypt.service";
import {GraphQLError} from "graphql/error";
import {LoginInputDto} from "./dto/login-input.dto";
import {UsersModel} from "../users/users.model";

describe("AuthService", () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let bcryptService: BcryptPasswordService;

  const mockUser = {
    id: 1,
    email: "jayjay@gmail.com",
    password: "password", // This would be a hashed password in production
    name: "jay jay",
    createdAt: new Date(2025, 4, 9),
    updatedAt: new Date(2025, 4, 9),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: BcryptPasswordService,
          useValue: {
            comparePasswords: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    bcryptService = module.get<BcryptPasswordService>(BcryptPasswordService);
  });

  describe("validateUser ", () => {
    it("should throw an error if user is not found", async () => {
      const input: LoginInputDto = {
        email: "test@example.com",
        pass: "password",
      };
      usersService.findOne = jest.fn().mockResolvedValue(null);

      await expect(authService.validateUser(input)).rejects.toThrow(
        GraphQLError,
      );
      await expect(authService.validateUser(input)).rejects.toThrow(
        "User  not found.",
      );
    });

    it("should throw an error if password is invalid", async () => {
      const input: LoginInputDto = {
        email: "jayjay@gmail.com",
        pass: "wrongpassword",
      };
      usersService.findOne = jest.fn().mockResolvedValue(mockUser);
      bcryptService.comparePasswords = jest.fn().mockReturnValue(false);

      await expect(authService.validateUser(input)).rejects.toThrow(
        GraphQLError,
      );
      await expect(authService.validateUser(input)).rejects.toThrow(
        "Invalid password.",
      );
    });

    it("should return user data with access and refresh tokens if credentials are valid", async () => {
      const input: LoginInputDto = {
        email: "jayjay@gmail.com",
        pass: "password",
      };
      usersService.findOne = jest.fn().mockResolvedValue(mockUser);
      bcryptService.comparePasswords = jest.fn().mockReturnValue(true);
      jwtService.sign = jest.fn().mockReturnValue("mockAccessToken");

      const result = await authService.validateUser(input);
      expect(result).toEqual({
        id: 1,
        email: "jayjay@gmail.com",
        password: "password",
        name: "jay jay",
        createdAt: new Date(2025, 4, 9),
        updatedAt: new Date(2025, 4, 9),
        AccessToken: "mockAccessToken",
        RefreshToken: "mockAccessToken",
      });
      expect(usersService.findOne).toHaveBeenCalledWith(input.email);
      expect(bcryptService.comparePasswords).toHaveBeenCalledWith(
        mockUser.password,
        input.pass,
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        id: mockUser.id,
      });
    });
  });
});
