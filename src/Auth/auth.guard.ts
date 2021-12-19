import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService) { }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const header = request.headers.authorization;
        if (!header) {
            throw new UnauthorizedException()
        }
        const token = header.replace("Bearer ", "");

        const isVerfied = this.authService.verifyToken(token);
        request.userId = isVerfied._id;
        return isVerfied
    }
}