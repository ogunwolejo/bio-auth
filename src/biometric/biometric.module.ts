import {Module} from "@nestjs/common";
import {BiometricService} from "./biometric.service";

@Module({
  providers: [BiometricService],
})
export class BiometricModule {}
