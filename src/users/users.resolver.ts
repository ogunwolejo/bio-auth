import {Resolver, Query, Context} from "@nestjs/graphql";
import {UsersModel} from "./users.model";
import {UsersService} from "./users.service";
import {JwtAuthGuard} from "../auth/gql-auth.guard";
import {UseGuards} from "@nestjs/common";

@Resolver(of => UsersModel)
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => String)
  fetchRoles(@Context() context): string {
    return `Thank you for this opporunity ${context.user}`;
  }
}
