import {ObjectType, Field, ID, Int} from "@nestjs/graphql";
import {UsersModel} from "../users/users.model";

@ObjectType()
export class PasskeyModel {
  @Field(type => ID)
  id: number;

  publicKey: String; // Raw public key bytes

  @Field()
  webauthnUserID: string;

  @Field(type => Int)
  counter: number;

  @Field()
  deviceType: string;

  @Field()
  backedUp: boolean; // Indicates if the Passkey is backed up

  @Field()
  transports?: string; // Optional transports, can be a CSV string

  @Field(type => Int)
  userId: number; // Foreign key to the User

  // Relation
  @Field(type => UsersModel, {nullable: true})
  user?: UsersModel; // Optional relation to the User entity
}


@ObjectType()
export class LoginWithPasskeyResult {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  message?: string;

  @Field({ nullable: true })
  token?: string; // Assuming you return a JWT
}
