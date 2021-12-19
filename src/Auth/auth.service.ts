import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs';
import { Intimidator } from "src/intimidator/schema/IntimidatorSchema";

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) { }
    async generateAuthToken(user: Intimidator) {
        const token = await this.jwtService.signAsync(
            {
                username: user.username,
                _id: user._id
            }
        )
        return token;
    }

    verifyToken(token: string) {
        const isVerified = this.jwtService.verify(token);
        return isVerified;
    }

}