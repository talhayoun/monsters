import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/Auth/auth.guard";
import { DoorsService } from "./doors.service";

@Controller('doors')
export class DoorsController {
    constructor(private doorsService: DoorsService) { }
    @Get()
    @UseGuards(AuthGuard)
    getAllDoors() {
        let doors = this.doorsService.getAllDoors()
        return doors;
    }

    // @Patch(':id')
    // changeDoorStatus(
    //     @Param('id') id: string
    // ) {
    //     this.doorsService.updateDoor(id);
    // }
}