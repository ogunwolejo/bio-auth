import {Module} from "@nestjs/common";
import {UsersService} from "./users.service";
import {UsersResolver} from "./users.resolver";
import {PrismaService} from "../prisma/prisma.service";
import {BcryptPasswordService} from "../helpers/bcrypt.service";
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [
    UsersService,
    UsersResolver,
    PrismaService,
    BcryptPasswordService,
  ],
})
export class UsersModule {}
