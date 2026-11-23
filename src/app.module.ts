import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from 'nestjs-pino';
import * as os from 'node:os';

import configuration from './config/configuration';
import { validationSchema } from './config/validation.schema';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
      validationOptions: {
        libraryOptions: {
          allowUnknown: true,
          abortEarly: false,
        },
      },
    }),

    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        pinoHttp: {
          level: config.get<string>('logging.level', 'info'),

          redact: [
            'req.headers.authorization',
            'req.headers.cookie',
            'res.headers.set-cookie',
            'password',
            'token',
          ],
        },
      }),
    }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow<string>('database.mongodbUri'),
        serverSelectionTimeoutMS: 5000,

        // Workaround for MongoDB driver 7.6+ running under Jest
        runtimeAdapters: {
          os,
        },
      }),
    }),

    HealthModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
