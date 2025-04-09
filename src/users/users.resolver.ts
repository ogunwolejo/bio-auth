import {Resolver, Query, Mutation, Args} from "@nestjs/graphql";
import { RegisteredUser, UsersModel } from './users.model';
import {UsersService} from "./users.service";
import { GqlAuthGuard } from '../auth/guards/gql-auth/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user/current-user.decorator';
import { LoginInputDto } from './dto/login-input.dto';
import { CreateUserInputDto } from './dto/create-user-input.dto';

@Resolver(of => UsersModel)
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Mutation(returns => UsersModel, {nullable: true})
  async login(
    @Args("loginInput") input: LoginInputDto,
  ): Promise<UsersModel | null> {
    return await this.userService.authenticateUser(input);
  }


  @Mutation(returns => RegisteredUser)
  async registerUser(
    @Args("input") input: CreateUserInputDto,
  ): Promise<RegisteredUser> {
    return await this.userService.CreateUser(input);
  }


  @UseGuards(GqlAuthGuard)
  @Query(() => String)
  fetchRoles(@CurrentUser() user: any): string {
    return `Thank you for this opporunity, ${user}`
  }
}
