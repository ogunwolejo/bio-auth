import {Module} from "@nestjs/common";
import {PasskeyService} from "./passkey.service";
import {PrismaService} from "../prisma/prisma.service";

@Module({
  providers: [PasskeyService, PrismaService],
  exports: [PasskeyService],
})
export class PasskeyModule {}
