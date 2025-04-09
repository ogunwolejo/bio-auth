// src/passkey/dto/login-passkey.input.ts
import { InputType, Field } from '@nestjs/graphql';
import {IsString, IsEmail, IsNotEmpty} from "class-validator";

@InputType()
export class LoginWithPasskeyInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  passKey: string;
}

