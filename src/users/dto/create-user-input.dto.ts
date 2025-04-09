import {InputType, Field} from "@nestjs/graphql";
import {IsString, IsEmail, IsNotEmpty} from "class-validator";

@InputType()
export class CreateUserInputDto {
  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  password: string;

  @Field({nullable: true})
  @IsString()
  name?: string;

  @Field({nullable: true})
  biometricKey?: string;

}
