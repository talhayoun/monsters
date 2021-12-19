import { Body, Controller, Get, Param, Patch, Post, Request, Response, UseFilters, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/Auth/auth.guard";
import { AllExceptionsFilter } from "src/http-exception.filter";
import { IntimidatorService } from "./intimidator.service";

@Controller('intimidator')
export class IntimidatorController {

    constructor(private intimidatorService: IntimidatorService) { }
    @Post("signup")
    async signUp(
        @Body('username') username: string,
        @Body('password') password: string
    ) {
        await this.intimidatorService.register(username, password);
        return null;
    }

    @Post('login')
    async login(
        @Body('username') username: string,
        @Body('password') password: string,
        @Response() res
    ) {
        const token = await this.intimidatorService.login(username, password);
        res.cookie('Authorization', 'Bearer ' + token);
        // res.setHeader('Authorization', 'Bearer ' + token);
        res.send({ token })
    }

    @Get()
    @UseFilters(AllExceptionsFilter)
    @UseGuards(AuthGuard)
    async getWorkerCard(
        @Request() req
    ) {
        const tokenUserId = req.userId;
        const intimidator = await this.intimidatorService.getIntimidatorData(tokenUserId);
        await intimidator.populate('dailyAccessedDoors.door')
        return intimidator;
    }

    @Patch(':doorId')
    @UseFilters(AllExceptionsFilter)
    @UseGuards(AuthGuard)
    async updateIntimidator(
        @Param('doorId') doorId: string,
        @Request() req
    ) {
        this.intimidatorService.updateIntimidator(req.userId, doorId)
    }
}