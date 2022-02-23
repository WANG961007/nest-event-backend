import {
    ClassSerializerInterceptor,
    Controller,
    Get,
    Post,
    SerializeOptions,
    UseGuards,
    UseInterceptors
} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {User} from "./user.entity";
import {CurrentUser} from "./current-user";
import {AuthGuardLocal} from "./auth-guard.local";
import {AuthGuardJwt} from "./auth-guard.jwt";

/**
 * @UseGuard(different type) : determine the request will handled or not
 * AuthGuard : call the strategy to verify the credential. So function validate will be called
 */
@Controller('auth')
@SerializeOptions({strategy: 'excludeAll'})
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Post('login')
    @UseGuards(AuthGuardLocal)
    async login(@CurrentUser() user: User) {
        return {
            userId: user.id,
            token: this.authService.getTokenForUser(user)
        };
    }

    @Get('profile')
    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(AuthGuardJwt)
    async getProfile(@CurrentUser() user: User) {
        return user;
    }

}