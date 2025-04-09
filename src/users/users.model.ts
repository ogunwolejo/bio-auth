import {ObjectType, Field, ID} from "@nestjs/graphql";

@ObjectType()
export class UsersModel {
  @Field(type => ID)
  id: number;

  @Field()
  email: string;

  @Field({nullable: true})
  name?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  AccessToken: string;

  @Field()
  RefreshToken: string;
}

@ObjectType()
export class RegisteredUser {
  @Field(type => ID)
  id: number;

  @Field()
  email: string;

  @Field({nullable: true})
  name?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export class IUsers {
  @Field(type => ID)
  id: number;

  @Field()
  email: string;

  @Field({nullable: true})
  name?: string;

  @Field()
  password: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(type => String, {nullable: true})
  passkeyId?: string;
}
