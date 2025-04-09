import {Test, TestingModule} from "@nestjs/testing";
import {UsersResolver} from "./users.resolver";
import {UsersService} from "./users.service";
import {JwtAuthGuard} from "../auth/gql-auth.guard";
import {ExecutionContext} from "@nestjs/common";
import {GqlExecutionContext} from "@nestjs/graphql";

describe("UsersResolver", () => {
  let resolver: UsersResolver;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn().mockImplementation((email: string) => {
              if (email === "test@example.com") {
                return {
                  id: 1,
                  email: "test@example.com",
                  password: "hashedpassword",
                  name: "test example",
                  createdAt: Date.now(),
                  updatedAt: Date.now(),
                };
              }
              return null; // Simulate user not found
            }),
          },
        },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
    usersService = module.get<UsersService>(UsersService);
  });

  describe("fetchRoles", () => {
    it("should return a greeting message with user info", () => {
      // Mock the context with user information
      const context = {
        user: {
          email: "test@example.com",
          id: 1,
        },
      };

      const result = resolver.fetchRoles(context);
      expect(result).toBe("Thank you for this opporunity [object Object]");
    });

    it("should return a greeting message with user info for a different user", () => {
      // Mock the context with user information for a different user
      const context = {
        user: {
          email: "admin@example.com",
          id: 2,
        },
      };

      const result = resolver.fetchRoles(context);
      expect(result).toBe("Thank you for this opporunity [object Object]");
    });
  });
});
