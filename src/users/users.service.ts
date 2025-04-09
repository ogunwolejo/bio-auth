import {Injectable} from "@nestjs/common";
import {IUsers, RegisteredUser} from "./users.model";
import {PrismaService} from "../prisma/prisma.service";
import {BcryptPasswordService} from "../helpers/bcrypt.service";
import {GraphQLError} from "graphql/error";
import {CreateUserInputDto} from "../auth/dto/create-user-input.dto";

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly bcryptService: BcryptPasswordService,
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
      throw new GraphQLError(
        `An error occurred while fetching the user: ${e.message}`,
        {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            http: {
              status: 500,
            },
          },
        },
      );
    }
  }

  async CreateUser(u: CreateUserInputDto): Promise<RegisteredUser> {
    try {
      const {name, email, password, passkeyId} = u;

      // Hash password
      const hash = this.bcryptService.hashPassword(password);

      const newUser = await this.prisma.user.create({
        data: {
          email,
          name,
          password: hash,
        },

        // selecting the attributes to be return back
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return newUser as RegisteredUser;
    } catch (e) {
      throw new GraphQLError(
        `An error occurred while creating the user: ${e.message}`,
        {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            http: {
              status: 500,
            },
          },
        },
      );
    }
  }
}
