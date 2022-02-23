import {BadRequestException, Body, Controller, Post} from "@nestjs/common";
import {AuthService} from "../auth.service";
import {CreateUserDto} from "./create.user.dto";
import {User} from "../user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Controller('users')
export class UserController {
    constructor(
        private readonly authService: AuthService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
    }

    /**
     * existingUser to verify that whether there already have the username or email
     * @param createUserDto
     */
    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        const user = new User();
        const existingUser = await this.userRepository.findOne({
            where: [
                {username: createUserDto.username},
                {email: createUserDto.email}
            ]
        })

        if (createUserDto.password !== createUserDto.retypedPassword) {
            throw new BadRequestException(['Password are not identical']);
        }

        if (existingUser) {
            throw new BadRequestException(['username or email is already taken'])
        }

        user.username = createUserDto.username;
        user.password = await this.authService.hashPassword(createUserDto.password);
        user.email = createUserDto.email;
        user.firstName = createUserDto.firstName;
        user.lastName = createUserDto.lastName;

        return {
            ...(await this.userRepository.save(user)),
            token: this.authService.getTokenForUser(user)
        };
    }
}