import { Module } from '@nestjs/common';
import {GqlAuthGuard} from "./guards/gql-auth/gql-auth.guard";
import {TokenService} from '../helpers/token';

@Module({
  providers: [TokenService, GqlAuthGuard],
  exports: [TokenService, GqlAuthGuard],
})
export class AuthModule {}
