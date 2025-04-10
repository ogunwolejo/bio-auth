// users.resolver.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { UsersModel } from './users.model'; // Import UsersModel
import { JwtAuthGuard } from '../auth/gql-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { JwtService } from '@nestjs/jwt';

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  let usersService: UsersService;
  let jwtService: JwtService;

  // Create a mock user model
  const mockUser: UsersModel = {
    id: 1,
    email: 'john.doe@example.com',
    name: 'John Doe',
    createdAt: new Date(),
    updatedAt: new Date(),
    AccessToken: 'mockAccessToken',
    RefreshToken: 'mockRefreshToken',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'testSecret', // Use a test secret
          signOptions: { expiresIn: '60s' }, // Set any options you need
        }),
      ],
      providers: [
        UsersResolver,
        {
          provide: UsersService,
          useValue: {
            // Mock any methods you need from UsersService here
            findUserById: jest.fn().mockResolvedValue(mockUser),
  },
  },
    JwtAuthGuard, // Include the guard if you want to test it
  ],
  }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('fetchRoles', () => {
    it('should return a string with user context', () => {
      const mockContext = {
        user: 'John Doe',
      };

      const result = resolver.fetchRoles(mockContext as any);
      expect(result).toBe('Thank you for this opporunity John Doe');
    });
  });
});
