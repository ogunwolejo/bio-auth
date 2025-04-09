import {Module} from "@nestjs/common";
import {PasskeyService} from "./passkey.service";
import {PasskeyResolver} from "./passkey.resolver";

@Module({
  providers: [PasskeyService, PasskeyResolver],
})
export class PasskeyModule {}
