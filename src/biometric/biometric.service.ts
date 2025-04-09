import {Injectable} from "@nestjs/common";
import {createHash} from "crypto";

@Injectable()
export class BiometricService {

  // We hash the biometric identifier using sha256 algorithm
  generateBiometricToken(identifier: string): string {
    return createHash('sha256').update(identifier).digest('hex');
  }

  validateBiometricToken(token: string, identifier: string): boolean {
    const generatedToken = this.generateBiometricToken(identifier);
    return generatedToken === token;
  }
}
