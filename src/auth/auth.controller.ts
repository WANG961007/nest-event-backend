import {
    ClassSerializerInterceptor,
    Controller,
    Get,
    Post,
    Request,
    SerializeOptions,
    UseGuards,
    UseInterceptors
} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {AuthService} from "./auth.service";
import {User} from "./user.entity";
import {CurrentUser} from "./current-user";
import {AuthGuardLocal} from "./auth-guard.local";
import {AuthGuardJwt} from "./auth-guard.jwt";

@Controller('auth')
@SerializeOptions({strategy: 'excludeAll'})
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Post('login')
    @UseGuards(AuthGuardLocal)// guard determine the request will be handled or not,this is a decorator
    // it like a frontman the bouncer that separates you from entering the club, and you must show your password and name
    // about the arguments we can see from PassportStrategy
    // local是因为local.strategy里面的passwordStrategy里面第二个参数没有给，所以就是默认为local，如果给了那么就和第二个参数保持一致就可以
    // 至于AuthGuard，it calls the strategy to verify the credential. so function validata will be called
    async login(@CurrentUser() user: User) {
        return {
            // userId: request.user.id,
            // after we create the current user, we can modify like
            userId: user.id,
            token: this.authService.getTokenForUser(user)
        };// 进行到这一步时UserGuard是已经验证过的状态
    }

    @Get('profile')
    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(AuthGuardJwt)// 和上面的local一样，主要看strategy是从哪来的，local就是local，jwt就是jwt（如果没有设置第二个参数的话
    async getProfile(@CurrentUser() user: User) {
        return user;// simple return the request user to fetch the user profile
    }

}