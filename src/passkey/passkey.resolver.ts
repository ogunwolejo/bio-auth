// import {Resolver, Mutation, Args} from "@nestjs/graphql";
// import {PasskeyService} from "./passkey.service";
// import {
//   WebAuthnInput,
//   PublicKeyCredentialCreationOptionsOutput,
//   WebAuthnVerificationResult,
// } from "./dto/webauthn.graphql";
//
// @Resolver()
// export class PasskeyResolver {
//   constructor(private readonly passkeyService: PasskeyService) {}
//
//   @Mutation(() => PublicKeyCredentialCreationOptionsOutput)
//   async generateRegistrationOptions(
//     @Args("input") input: WebAuthnInput,
//   ): Promise<PublicKeyCredentialCreationOptionsOutput> {
//     const options = await this.passkeyService.generateRegistrationOptions(
//       input.identifier,
//     );
//     return {options: JSON.stringify(options)};
//   }
//
//   @Mutation(() => WebAuthnVerificationResult)
//   async verifyRegistration(
//     @Args("input") input: WebAuthnInput,
//   ): Promise<WebAuthnVerificationResult> {
//     const response = JSON.parse(input.response);
//     const result = await this.passkeyService.verifyRegistration(
//       input.identifier,
//       response,
//     );
//     return {verified: result.verified};
//   }
//
//   @Mutation(() => PublicKeyCredentialCreationOptionsOutput)
//   async generateAuthenticationOptions(
//     @Args("input") input: WebAuthnInput,
//   ): Promise<PublicKeyCredentialCreationOptionsOutput> {
//     const options = await this.passkeyService.generateAuthenticationOptions(
//       input.identifier,
//     );
//     return {options: JSON.stringify(options)};
//   }
//
//   @Mutation(() => WebAuthnVerificationResult)
//   async verifyAuthentication(
//     @Args("input") input: WebAuthnInput,
//   ): Promise<WebAuthnVerificationResult> {
//     const result = await this.passkeyService.verifyAuthentication(
//       input.identifier,
//       input.response,
//     );
//     return {verified: result.verified};
//   }
// }
