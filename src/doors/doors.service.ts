import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as moment from "moment";
import { Model } from "mongoose";
import { IntimidatorService } from "src/intimidator/intimidator.service";
import { Door } from "./schema/doors.schema";

@Injectable()
export class DoorsService {
    constructor(@InjectModel('Doors') private DoorModel: Model<Door>) { }

    async getAllDoors() {
        let doors = await this.DoorModel.find({});
        let availableDoors = await this.validateDoorStatusAndDate(doors);
        if (!doors) throw new NotFoundException();
        return availableDoors;
    }

    async updateDoor(doorId: string): Promise<number> {
        let door = await this.findDoorById(doorId);
        if (door.isActive === false)
            throw new ForbiddenException()
        door.isActive = false;
        door.lastActiveDate = new Date().toISOString().split('T')[0];
        await door.save();
        return door.energy;
    }


    private async findDoorById(id: string) {
        let door = await this.DoorModel.findById(id);
        if (!door)
            throw new NotFoundException();
        return door;
    }

    private async validateDoorStatusAndDate(doors): Promise<Door[]> {
        let todaysDate = moment().format('YYYY-MM-DD');
        let availableDoors = [];
        for (let i = 0; i < doors.length; i++) {
            if (todaysDate !== doors[i].lastActiveDate && !doors[i].isActive) {
                doors[i].isActive = true;
                doors[i].lastActiveDate = ""
                await doors[i].save()
            }
            if (doors[i].isActive) availableDoors.push(doors[i]);
        }
        return availableDoors
    }
}