import {Resolver, Mutation, Args} from "@nestjs/graphql";
import {RegisteredUser, UsersModel} from "../users/users.model";
import {UsersService} from "../users/users.service";
import {LoginInputDto} from "./dto/login-input.dto";
import {CreateUserInputDto} from "./dto/create-user-input.dto";
import {AuthService} from "./auth.service";
import {LoginWithPasskeyResult} from "../passkey/passkey.model";
import {LoginWithPasskeyInput} from "./dto/passkey-input.dto";
import {PasskeyService} from "../passkey/passkey.service";
import {JwtService} from "@nestjs/jwt";

@Resolver(of => UsersModel)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly passkeyService: PasskeyService,
    private jwtService: JwtService,
  ) {}

  @Mutation(returns => UsersModel, {nullable: true})
  async login(
    @Args("loginInput") input: LoginInputDto,
  ): Promise<UsersModel | null> {
    return await this.authService.validateUser(input);
  }

  @Mutation(returns => String)
  async registerUser(
    @Args("input") input: CreateUserInputDto,
  ): Promise<number> {
    // If passKey is provided
    if (input.passkeyId && input.passkeyId.length) {
      return await this.authService.registerUserWithPasskey(input);
    }

    // when passKey is not provided
    const newUser = await this.userService.CreateUser(input);
    return newUser.id;
  }

  @Mutation(() => LoginWithPasskeyResult)
  async loginWithPasskey(
    @Args("input") input: LoginWithPasskeyInput,
  ): Promise<LoginWithPasskeyResult> {
    const {email, passKey} = input;
    const result = await this.passkeyService.verifyAuthentication(
      email,
      passKey,
    );

    if (!result.verified) {
      return {success: false, message: "Authentication failed"};
    }

    // Fetch the user by email
    const user = await this.userService.findOne(email);

    if (!user) {
      return {success: false, message: "User not found"};
    }

    // Optional: return JWT
    const token = this.jwtService.sign({sub: user.id, email: user.email});

    return {
      success: true,
      message: "Authentication successful",
      token,
    };
  }
}
