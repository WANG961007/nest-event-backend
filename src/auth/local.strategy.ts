import {PassportStrategy} from "@nestjs/passport";
import {Injectable, Logger, UnauthorizedException} from "@nestjs/common";
import {Strategy} from "passport-local";
import {Repository} from "typeorm";
import {User} from "./user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){//PassportStrategy已经给我们提供了好多方法了
    private readonly logger = new Logger(LocalStrategy.name);

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {
        super();// call the super method that will call the parent constructor(PassportStrategy)
    }

    public async validate(username: string, password: string): Promise<any> {// return value shoule be any
        const user = await this.userRepository.findOne({
            where: {username}// so this should fetch the user by username
        });

        if (!user) {
            this.logger.debug(`User ${username} not found!`);
            throw new UnauthorizedException();
        }

        // focus!! we CANNOT store the password in the database in a plain text.
        // So the next step is to compare the provided passwords with the password stored inside the database.
        if (!(await bcrypt.compare(password, user.password))) {
            this.logger.debug(`Invalid credentials for user ${username}`);
            throw new UnauthorizedException();
        }

        return user;
    }
}