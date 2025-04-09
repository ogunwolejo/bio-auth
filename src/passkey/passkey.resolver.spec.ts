import {Test, TestingModule} from "@nestjs/testing";
import {PasskeyResolver} from "./passkey.resolver";

describe("PasskeyResolver", () => {
  let resolver: PasskeyResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasskeyResolver],
    }).compile();

    resolver = module.get<PasskeyResolver>(PasskeyResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
