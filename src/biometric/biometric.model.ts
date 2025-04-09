import {ObjectType, Field, ID} from "@nestjs/graphql";
import {UsersModel} from "../users/users.model";

@ObjectType()
export class BiometricModel {
  @Field(() => ID)
  id: number;

  @Field()
  key: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => UsersModel)
  user: UsersModel;
}
