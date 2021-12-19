import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "src/Auth/auth.module";
import { IntimidatorModule } from "src/intimidator/intimidator.module";
import { DoorsController } from "./doors.controller";
import { DoorsService } from "./doors.service";
import { DoorSchema } from "./schema/doors.schema";

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Doors', schema: DoorSchema }]), AuthModule],
    controllers: [DoorsController],
    providers: [DoorsService],
    exports: [DoorsService]
})

export class DoorsModule { }