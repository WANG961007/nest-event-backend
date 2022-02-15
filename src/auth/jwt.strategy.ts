import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {Injectable} from "@nestjs/common";
import {Repository} from "typeorm";
import {User} from "./user.entity";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) { //this Strategy come from jwt module not from local like previous
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {
        super(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),// use the extract Jwt class
                ignoreExpiration: false,// we don't want to ignore it when the token is expired
                //=> after 60 minutes token will expire and then we want to force users to log in again
                // further information： 是否检查token的有效时间，为true则不检查
                secretOrKey: process.env.AUTH_SECRET // we need to specify the secret which you know is stored inside
                // environment variable
            }
        );//we need to call the parent constructor with some configuration options
        // so we need to specify how to fetch the tokens from the request
    }

    async validate(payload: any) { // the JWT strategy expects to have an argument called payload which can be anything
        // because at this point, we already know that the token is valid,can return the user back from the method or either from the payload
        // because the payload already contains the user id. if that's enough for you, don't load anything from the database.
        // if you need more user information, plz go to database to fetch it
        // like this,
        return await this.userRepository.findOne(payload.sub)// we generated the payload and used the sub claim to store the user id
    }
    // payload 本身JWT就是分成三个部分的，Header/Payload/Signature
}