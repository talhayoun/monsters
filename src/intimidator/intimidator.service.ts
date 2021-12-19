import { ForbiddenException, Injectable, InternalServerErrorException, NotAcceptableException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as moment from 'moment';
import * as bcrypt from 'bcryptjs';
import * as mongoose from "mongoose";
import { Model } from "mongoose";
import { AuthService } from "src/Auth/auth.service";
import { Intimidator } from "./schema/IntimidatorSchema";
import { DoorsService } from "src/doors/doors.service";

@Injectable()
export class IntimidatorService {
    constructor(@InjectModel('Intimidator') private intimidatorModel: Model<Intimidator>, private authService: AuthService, private doorService: DoorsService) { }

    async register(username: string, password: string) {
        let tentacles = Math.floor(Math.random() * 6) + 1;
        this.validatePasswordRequirements(password);
        const intimidator = new this.intimidatorModel({ username, password, tentacles, currentEnergy: 0 });
        if (!intimidator) throw new InternalServerErrorException();
        await intimidator.save();
        return;
    }

    async login(username: string, password: string): Promise<string> {
        const intimidator = await this.findIntimidator(username);
        await this.validatePassword(password, intimidator.password);

        const token = await this.authService.generateAuthToken(intimidator);
        const requiredEnergy = this.calculateRequiredEnergy(intimidator);
        intimidator.requiredEnergy = requiredEnergy;
        await intimidator.save();
        return token

    }

    async getIntimidatorData(tokenUserId: string): Promise<Intimidator> {
        const intimidator = await this.findIntimidator("", tokenUserId)
        return intimidator;
    }

    async updateIntimidator(intimidatorId: string, doorId: string) {
        let intimidator = await this.findIntimidator("", intimidatorId);
        let doorEnergy = await this.doorService.updateDoor(doorId);
        intimidator.currentEnergy = intimidator.currentEnergy + doorEnergy;
        intimidator.dailyAccessedDoors = intimidator.dailyAccessedDoors.concat({ door: doorId })
        await intimidator.save();

    }

    private async validatePassword(inputPassword: string, dbPassword: string) {
        const isPassMatch = await bcrypt.compare(inputPassword, dbPassword);
        if (!isPassMatch) throw new UnauthorizedException();
    }

    private calculateRequiredEnergy(intimidator: Intimidator): number {
        let experience = moment(intimidator.createdAt);
        let todayDate = moment()
        let todayDateMinusExperience = todayDate.diff(experience, 'years') + 1;
        let requiredEnergy = 100 + (20 * (todayDateMinusExperience - 1));
        return requiredEnergy
    }

    private async findIntimidator(username?: string, id?: string): Promise<Intimidator> {
        let intimidator: Intimidator;
        if (username.length > 0)
            intimidator = await this.intimidatorModel.findOne({ username })
        else
            intimidator = await this.intimidatorModel.findById(id).select('-password');
        if (!intimidator) throw new NotFoundException();
        return intimidator;
    }

    private validatePasswordRequirements(value: string) {
        let regex = /^.*(?=.{8,})(?=.*[A-Z])(?=.*[!@#$%^&+=]).*$/.test(value)
        if (!regex)
            throw new NotAcceptableException()
    }
}