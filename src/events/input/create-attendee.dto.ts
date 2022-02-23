import {AttendeeAnswerEnum} from "../attendee/attendee.entity";
import {IsEnum} from "class-validator";

export class CreateAttendeeDto{
    @IsEnum(AttendeeAnswerEnum)
    answer: AttendeeAnswerEnum;
}