import {InputType, Field} from "@nestjs/graphql";
import {IsString, IsEmail, IsNotEmpty} from "class-validator";

@InputType()
export class LoginInputDto {
  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  password: string;
}
