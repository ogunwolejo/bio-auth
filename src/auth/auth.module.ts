import {Module} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {UsersModule} from "../users/users.module";
import * as process from "process";
import {JwtModule} from "@nestjs/jwt";
import {BcryptPasswordService} from "../helpers/bcrypt.service";
import {AuthResolver} from "./auth.resolver";

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: {expiresIn: "60s"},
    }),
  ],
  providers: [AuthService, BcryptPasswordService, AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}
