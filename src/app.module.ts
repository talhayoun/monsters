import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthModule } from './Auth/auth.module';
import { IntimidatorModule } from './intimidator/intimidator.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DoorsModule } from './doors/doors.module';

@Module({
  imports: [ConfigModule.forRoot({ envFilePath: "./config/dev.env", isGlobal: true, expandVariables: true }), MongooseModule.forRootAsync({
    imports: [ConfigService],
    useFactory: async (configService: ConfigService) => ({
      uri: configService.get('MONGODB_URL')
    }),
    inject: [ConfigService]
  }), AuthModule, IntimidatorModule, DoorsModule],
  controllers: [AppController],
  providers: [AppService],
  exports: [ConfigModule]
})
export class AppModule { }
