// auth/dto/webauthn.graphql.ts
import {Field, ObjectType, InputType} from "@nestjs/graphql";

@InputType()
export class WebAuthnInput {
  @Field()
  identifier: string;

  @Field(() => String, {nullable: true})
  response: string; // JSON string from browser
}

@ObjectType()
export class PublicKeyCredentialCreationOptionsOutput {
  @Field(() => String)
  options: string; // Return JSON string of options
}

@ObjectType()
export class WebAuthnVerificationResult {
  @Field()
  verified: boolean;
}
