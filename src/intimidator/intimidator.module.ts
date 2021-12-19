import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthGuard } from "src/Auth/auth.guard";
import { AuthModule } from "src/Auth/auth.module";
import { AuthService } from "src/Auth/auth.service";
import { DoorsModule } from "src/doors/doors.module";
import { IntimidatorController } from "./intimidator.controller";
import { IntimidatorService } from "./intimidator.service";
import { IntimidatorSchema } from "./schema/IntimidatorSchema";

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Intimidator', schema: IntimidatorSchema }]), AuthModule, DoorsModule],
    controllers: [IntimidatorController],
    providers: [IntimidatorService],
})

export class IntimidatorModule { };