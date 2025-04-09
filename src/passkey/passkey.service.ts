import {Injectable} from "@nestjs/common";
import {PrismaService} from "../prisma/prisma.service";
import {
  generateRegistrationOptions,
  generateAuthenticationOptions,
} from "@simplewebauthn/server";
import {PasskeyModel} from "./passkey.model";
import {GraphQLError} from "graphql/error";

// Default webauthn configuration
const webauthnConfig = {
  rpName: "Test App",
  rpID: "localhost",
  origin: "http://localhost:3000",
};

// mock the credential data
type MockCredential = {
  credentialID: string;
  credentialPublicKey: Uint8Array<ArrayBuffer>;
  counter: number;
};

@Injectable()
export class PasskeyService {
  private challenges = new Map<string, string>();
  private userCreds = new Map<string, MockCredential[]>();

  constructor(private readonly prisma: PrismaService) {}

  async generateRegistrationOptions(identifier: string) {
    const options = await generateRegistrationOptions({
      rpName: webauthnConfig.rpName,
      rpID: webauthnConfig.rpID,
      //userID: identifier,
      userName: identifier,
      timeout: 60000,
      attestationType: "none",
      authenticatorSelection: {
        residentKey: "preferred",
        userVerification: "preferred",
      },
      //excludeCredentials: this.userCreds.get(identifier) || [],
    });

    this.challenges.set(identifier, options.challenge);
    return options;
  }

  async verifyRegistration(
    identifier: string,
    attestationResponse: string,
  ): Promise<{verified: boolean; credential: MockCredential}> {
    const fakeCred: MockCredential = {
      credentialID: attestationResponse, //|| "mock-cred-id",
      credentialPublicKey: new Uint8Array([1, 2, 3]),
      counter: 0,
    };

    const creds = this.userCreds.get(identifier) || [];
    creds.push(fakeCred);
    this.userCreds.set(identifier, creds);

    return {verified: true, credential: fakeCred};
  }

  async generateAuthenticationOptions(identifier: string) {
    const creds = this.userCreds.get(identifier) || [];

    const options = await generateAuthenticationOptions({
      timeout: 60000,
      rpID: webauthnConfig.rpID,
      allowCredentials: creds.map(cred => ({
        id: cred.credentialID,
        type: "public-key",
      })),
      userVerification: "preferred",
    });

    this.challenges.set(identifier, options.challenge);
    return options;
  }

  async verifyAuthentication(identifier: string, assertionResponse: string) {
    const creds = this.userCreds.get(identifier) || [];

    const dbCred = creds.find(c => c.credentialID === assertionResponse);

    if (!dbCred) return {verified: false};

    // Just bump counter and call it "verified"
    dbCred.counter += 1;

    return {verified: true};
  }

  async createPasskey(
    email: string,
    userId: number,
    credential: MockCredential,
  ): Promise<PasskeyModel> {
    try {
      const key = await this.prisma.passKey.create({
        data: {
          userIdentifier: email,
          credentialID: credential.credentialID,
          credentialPublicKey: credential.credentialPublicKey,
          counter: credential.counter,
          user: {connect: {id: userId}},
        },
      });

      return key as PasskeyModel;
    } catch (e) {
      throw new GraphQLError(e.message, {
        extensions: {
          code: "USER_NOT_FOUND",
          http: {
            status: 404,
            headers: new Map([["X-Error-Message", `${e.message}`]]),
          },
        },
      });
    }
  }
}
