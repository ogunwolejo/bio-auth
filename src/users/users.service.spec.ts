// users.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { BcryptPasswordService } from '../helpers/bcrypt.service';
import { GraphQLError } from 'graphql/error';
import { CreateUserInputDto } from '../auth/dto/create-user-input.dto';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;
  let bcryptService: BcryptPasswordService;

  const mockUser  = {
    id: 1,
    email: 'john.doe@example.com',
    name: 'John Doe',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockBcryptService = {
    hashPassword: jest.fn().mockReturnValue('hashedPassword'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: BcryptPasswordService, useValue: mockBcryptService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
    bcryptService = module.get<BcryptPasswordService>(BcryptPasswordService);
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser );

      const result = await service.findOne('john.doe@example.com');
      expect(result).toEqual(mockUser );
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'john.doe@example.com' },
      });
    });

    it('should return null if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.findOne('notfound@example.com');
      expect(result).toBeNull();
    });

    it('should throw an error if an exception occurs', async () => {
      mockPrismaService.user.findUnique.mockRejectedValue(new Error('Database error'));

      await expect(service.findOne('john.doe@example.com')).rejects.toThrow(GraphQLError);
    });
  });

  describe('CreateUser ', () => {
    it('should create a new user and return it', async () => {
      const createUserDto: CreateUserInputDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        passkeyId: 'somePasskeyId',
      };

      mockPrismaService.user.create.mockResolvedValue(mockUser);

      const result = await service.CreateUser (createUserDto);
      expect(result).toEqual(mockUser );
      expect(mockBcryptService.hashPassword).toHaveBeenCalledWith('password123');
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: 'john.doe@example.com',
          name: 'John Doe',
          password: 'hashedPassword',
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    });

    it('should throw an error if an exception occurs', async () => {
      const createUserDto: CreateUserInputDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        passkeyId: 'somePasskeyId',
      };

      mockPrismaService.user.create.mockRejectedValue(new Error('Database error'));

      await expect(service.CreateUser (createUserDto)).rejects.toThrow(GraphQLError);
    });
  });
});
