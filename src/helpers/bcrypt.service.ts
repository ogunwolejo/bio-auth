import {hashSync, genSaltSync, compareSync} from "bcryptjs";
import {Injectable} from "@nestjs/common";

@Injectable()
export class BcryptPasswordService {
  hashPassword(password: string): string {
    const salt = genSaltSync(10);
    return hashSync(password, salt);
  }

  comparePasswords(hash: string, text: string): boolean {
    return compareSync(text, hash);
  }
}
