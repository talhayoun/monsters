import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { AuthService } from "./auth.service";

@Module({
    imports: [JwtModule.registerAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
            secret: configService.get('SECRET_TOKEN'), signOptions: { expiresIn: '24h' }
        }),
        inject: [ConfigService]
    })],
    providers: [AuthService],
    exports: [AuthService, JwtModule]
})
export class AuthModule { }