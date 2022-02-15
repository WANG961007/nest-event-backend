import {IsEmail, Length} from "class-validator";

export class CreateUserDto {
    @Length(5)
    username: string;
    @Length(8)
    password: string;
    @Length(8)
    retypedPassword: string;// we want the users to type the password two times so we can verify the password
    @Length(2)
    firstName: string;
    @Length(2)
    lastName: string;
    @IsEmail()
    email: string;
}