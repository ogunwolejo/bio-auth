import {Module} from "@nestjs/common";
import {UsersService} from "./users.service";
import {UsersResolver} from "./users.resolver";
import {PrismaService} from "../prisma/prisma.service";
import {BcryptPasswordService} from "../helpers/bcrypt.service";
import {JwtService} from "@nestjs/jwt";

@Module({
  providers: [
    UsersService,
    UsersResolver,
    PrismaService,
    BcryptPasswordService,
    JwtService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
