import {join} from "path";

import {Module} from "@nestjs/common";
import {GraphQLModule} from "@nestjs/graphql";
import {ApolloDriver, ApolloDriverConfig} from "@nestjs/apollo";
import {ConfigModule} from "@nestjs/config";

import {AppController} from "./app.controller";
import {AppService} from "./app.service";
import {UsersModule} from "./users/users.module";
import {PrismaService} from "./prisma/prisma.service";
import {BiometricModule} from "./biometric/biometric.module";
import {GraphQLFormattedError} from "graphql/error";
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
      playground: true,
      // Format for displaying error
      formatError: (error: GraphQLFormattedError) => {
        return {
          message: error.message,
          code: error.extensions?.code,
          path: error.path,
        };
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    UsersModule,
    BiometricModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
