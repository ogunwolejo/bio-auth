import {ObjectType, Field, ID, Int} from "@nestjs/graphql";
import {UsersModel} from "../users/users.model";

@ObjectType()
export class PasskeyModel {
  @Field(type => ID)
  id: number;

  @Field()
  userIdentifier: string;

  @Field()
  credentialPublicKey: Uint8Array<ArrayBufferLike>;

  @Field()
  credentialID: string;

  @Field(type => Int)
  counter: number;

  @Field(type => Int)
  userId: number; // Foreign key to the User

  // Relation
  @Field(type => UsersModel, {nullable: true})
  user?: UsersModel; // Optional relation to the User entity

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class LoginWithPasskeyResult {
  @Field()
  success: boolean;

  @Field({nullable: true})
  message?: string;

  @Field({nullable: true})
  token?: string; // Assuming you return a JWT
}
