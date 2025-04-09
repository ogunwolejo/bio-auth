import { Injectable } from '@nestjs/common';
import { IUsers, RegisteredUser, UsersModel } from './users.model';
import { LoginInputDto } from './dto/login-input.dto';
import { PrismaService } from '../prisma/prisma.service';
import { BcryptPasswordService } from '../helpers/bcrypt.service';
import { GraphQLError } from 'graphql/error';
import { TokenService } from '../helpers/token';
import { CreateUserInputDto } from './dto/create-user-input.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly bcryptService: BcryptPasswordService,
    private readonly tokenService: TokenService,
  ) {}
  async findOne(email: string): Promise<IUsers | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      return user as IUsers | null;

    } catch (e) {
      console.log("error login: ", e);

      throw new GraphQLError('An error occurred while fetching the user.', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
          http: {
            status: 500,
          },
        },
      });
    }

  }

  async CreateUser(u: CreateUserInputDto): Promise<RegisteredUser> {
    try {
      const { name, email, password, biometricKey } = u;

      // Hash password
      const hash = this.bcryptService.hashPassword(password);

      const newUser =  await this.prisma.user.create({
        data: {
          email,
          name,
          password: hash,
          biometricKey: biometricKey ? { create: { key: biometricKey } } : undefined,
        },

        // selecting the attributes to be return back
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        }
      });

      return newUser as RegisteredUser;
    } catch (e) {
      console.log("error", e);
      throw new GraphQLError('An error occurred while creating the user.', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
          http: {
            status: 500,
          },
        },
      });
    }
  }

  async authenticateUser(
    loginInput: LoginInputDto,
  ): Promise<UsersModel | null> {
    const foundUser = await this.findOne(loginInput.email);

    if (!foundUser) {
      throw new GraphQLError('User  not found.', {
        extensions: {
          code: 'USER_NOT_FOUND',
          http: {
            status: 404,
            headers: new Map([
              ['X-Error-Message', 'User  with this email does not exist.'],
            ]),
          },
        },
      });
    }

    const doesPasswordMatch = this.bcryptService.comparePasswords(
      foundUser.password,
      loginInput.password,
    );

    if (!doesPasswordMatch) {
      throw new GraphQLError('Invalid password.', {
        extensions: {
          code: 'INVALID_CREDENTIALS',
          http: {
            status: 401,
            headers: new Map([
              ['X-Error-Message', 'The provided password is incorrect.'],
            ]),
          },
        },
      });
    }

    const {password, biometricKeys,  ...rest} = foundUser; // using Destructuring to remove sending the sensitive data

    return {
      ...rest,
      AccessToken: this.tokenService.generateToken({email: rest.email, id: rest.id, expires: 60 * 15}),
      RefreshToken: this.tokenService.generateToken({email: rest.email, id: rest.id, expires: 60 * 60 * 30}),
    };
  }

}
