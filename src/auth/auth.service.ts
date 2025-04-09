import {Injectable} from "@nestjs/common";
import {UsersService} from "../users/users.service";
import {JwtService} from "@nestjs/jwt";
import {GraphQLError} from "graphql/error";
import {UsersModel} from "../users/users.model";
import {BcryptPasswordService} from "../helpers/bcrypt.service";
import {LoginInputDto} from "./dto/login-input.dto";
import { PasskeyService } from '../passkey/passkey.service';
import { CreateUserInputDto } from './dto/create-user-input.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly bcryptService: BcryptPasswordService,
    private readonly passkeyService: PasskeyService,
  ) {}

  async validateUser(input: LoginInputDto): Promise<UsersModel | null> {
    let {email, pass} = input;
    const user = await this.usersService.findOne(email);

    // when user is not found i.e null
    if (!user) {
      throw new GraphQLError("User  not found.", {
        extensions: {
          code: "USER_NOT_FOUND",
          http: {
            status: 404,
            headers: new Map([
              ["X-Error-Message", "User  with this email does not exist."],
            ]),
          },
        },
      });
    }

    // compare passwords
    const doesPasswordMatch = this.bcryptService.comparePasswords(
      user.password,
      pass,
    );

    if (!doesPasswordMatch) {
      throw new GraphQLError("Invalid password.", {
        extensions: {
          code: "INVALID_CREDENTIALS",
          http: {
            status: 401,
            headers: new Map([
              ["X-Error-Message", "The provided password is incorrect."],
            ]),
          },
        },
      });
    }

    const {password, passkeyId, ...rest} = user; // using Destructuring to remove sending the sensitive data

    const payload = {
      email: rest.email,
      id: rest.id,
    };

    return {
      ...rest,
      AccessToken: this.jwtService.sign(payload),
      RefreshToken: this.jwtService.sign(payload, {expiresIn: "60d"}),
    };
  }

  async registerUserWithPasskey(input: CreateUserInputDto): Promise<string> {
    try {
      const {email, passkeyId} = input;
      const { verified, credential } = await this.passkeyService.verifyRegistration(email, passkeyId);

      // If registration was not verify we throw an error
      if (!verified || !credential) {
        throw new Error('Passkey verification failed');
      }

      // create new user
      const newUser = await this.usersService.CreateUser(input);

      // create passKey
      await this.passkeyService.createPasskey(
        newUser.email,
        newUser.id,
        credential
      );

      return newUser.id;

    } catch (e) {
      throw new GraphQLError(e.message, {
        extensions: {
          code: "USER_NOT_FOUND",
          http: {
            status: 404,
            headers: new Map([
              ["X-Error-Message", `${e.message}`],
            ]),
          },
        },
      });
    }
  }

}
