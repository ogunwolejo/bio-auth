import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "./prisma.service";
import { PrismaClient } from "@prisma/client";

jest.mock("@prisma/client", () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      $connect: jest.fn(),
      $disconnect: jest.fn(),
    })),
  };
});

describe("PrismaService", () => {
  let prismaService: PrismaService;
  let prismaClient: PrismaClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
    prismaClient = new PrismaClient();
  });

  it("should be defined", () => {
    expect(prismaService).toBeDefined();
  });
});
