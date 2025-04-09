import {Test, TestingModule} from "@nestjs/testing";
import {BcryptPasswordService} from "./bcrypt.service";
import {hashSync, genSaltSync, compareSync} from "bcryptjs";

jest.mock("bcryptjs", () => ({
  hashSync: jest.fn(),
  genSaltSync: jest.fn(),
  compareSync: jest.fn(),
}));

describe("BcryptPasswordService", () => {
  let bcryptService: BcryptPasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BcryptPasswordService],
    }).compile();

    bcryptService = module.get<BcryptPasswordService>(BcryptPasswordService);
  });

  describe("hashPassword", () => {
    it("should hash the password correctly", () => {
      const password = "myPassword";
      const salt = "randomSalt";
      const hashedPassword = "hashedPassword";

      (genSaltSync as jest.Mock).mockReturnValue(salt);
      (hashSync as jest.Mock).mockReturnValue(hashedPassword);

      const result = bcryptService.hashPassword(password);

      expect(genSaltSync).toHaveBeenCalledWith(10);
      expect(hashSync).toHaveBeenCalledWith(password, salt);
      expect(result).toBe(hashedPassword);
    });
  });

  describe("comparePasswords", () => {
    it("should return true if passwords match", () => {
      const hash = "hashedPassword";
      const text = "myPassword";

      (compareSync as jest.Mock).mockReturnValue(true);

      const result = bcryptService.comparePasswords(hash, text);

      expect(compareSync).toHaveBeenCalledWith(text, hash);
      expect(result).toBe(true);
    });

    it("should return false if passwords do not match", () => {
      const hash = "hashedPassword";
      const text = "wrongPassword";

      (compareSync as jest.Mock).mockReturnValue(false);

      const result = bcryptService.comparePasswords(hash, text);

      expect(compareSync).toHaveBeenCalledWith(text, hash);
      expect(result).toBe(false);
    });
  });
});
