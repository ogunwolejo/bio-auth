import {Test, TestingModule} from "@nestjs/testing";
import {PrismaService} from "./prisma.service"; // Adjust the import path as necessary
import {PrismaClient} from "@prisma/client";

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

  describe("onModuleInit", () => {
    it("should connect to the database", async () => {
      await prismaService.onModuleInit();
      expect(prismaService.$connect).toHaveBeenCalled();
    });
  });

  describe("onModuleDestroy", () => {
    it("should disconnect from the database", async () => {
      await prismaService.onModuleDestroy();
      expect(prismaService.$disconnect).toHaveBeenCalled();
    });
  });
});
