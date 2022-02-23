import {PassportStrategy} from "@nestjs/passport";
import {Injectable, Logger, UnauthorizedException} from "@nestjs/common";
import {Strategy} from "passport-local";
import {Repository} from "typeorm";
import {User} from "./user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";

/**
 * PassportStrategy has a lot of strategy(exclude local & Jwt strategy)
 * super() means that will call the parent constructor(PassportStrategy)
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    private readonly logger = new Logger(LocalStrategy.name);

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {
        super();
    }

    public async validate(username: string, password: string): Promise<any> {

        const user = await this.userRepository.findOne({
            where: {username}
        })

        if (!user) {
            this.logger.debug(`User ${username} not found`);
            throw new UnauthorizedException();
        }

        /**
         * focus!! we CANNOT store the password in the database in a plain text.
         * next => compare the provided passwords with the password stored inside the database
         */
        if (!(await bcrypt.compare(password, user.password))) {
            this.logger.debug(`Invalid credentials for user ${username}`);
            throw new UnauthorizedException();
        }

        return user;
    }

}