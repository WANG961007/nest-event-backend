import {Injectable} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {User} from "./user.entity";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService
    ) { }

    public getTokenForUser(user: User): string {
        return this.jwtService.sign({
            username: user.username,
            sub: user.id // never put any secrets inside the token because taht token can be publicly visible
            // it can be read by everyone else
        });
    }

    public async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);// the more rounds you do, the more secure the hash is

    }
}