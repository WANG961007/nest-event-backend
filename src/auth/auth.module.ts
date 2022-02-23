import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./user.entity";
import {LocalStrategy} from "./local.strategy";
import {AuthController} from "./auth.controller";
import {JwtModule} from "@nestjs/jwt";
import {AuthService} from "./auth.service";
import {JwtStrategy} from "./jwt.strategy";
import {UserController} from "./input/user.controller";

/**
 * secret: something that took a generation will base on
 */
@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.registerAsync({
            useFactory: () => ({
                secret: process.env.AUTH_SECRET,
                signOptions: {
                    expiresIn: '60m'
                }
            })
        })
    ],
    providers: [LocalStrategy, JwtStrategy, AuthService],
    controllers: [AuthController,UserController]
})
export class AuthModule {

}