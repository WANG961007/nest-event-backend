import {Injectable} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {User} from "./user.entity";
import * as bcrypt from "bcrypt";

/**
 * never put any secrets inside the token because that token can be publicly visible
 * bcrypt cryptographic is to use to hash the password
 */
@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService
    ) { }

    public getTokenForUser(user: User): string {
        return this.jwtService.sign({
            username: user.username,
            sub: user.id
        });
    }

    public async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);// the more rounds you do, the more secure the hash is
    }
}