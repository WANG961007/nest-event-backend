import {
    ClassSerializerInterceptor,
    Controller,
    Get,
    Param, ParseIntPipe,
    SerializeOptions,
    UseInterceptors
} from "@nestjs/common";
import {AttendeesService} from "./attendees.service";
import {ApiOperation} from "@nestjs/swagger";


@Controller('events/:eventId/attendees')
@SerializeOptions({strategy: 'excludeAll'})
export class EventAttendeeController {
    constructor(
        private readonly attendeesService: AttendeesService
    ) {
    }

    // @ts-ignore
    @ApiOperation("get all attendees who attend specified event")
    @Get()
    @UseInterceptors(ClassSerializerInterceptor)
    async findAll(
        @Param("eventId", ParseIntPipe) eventId: number
    ) {
        return await this.attendeesService.findByEventId(eventId);
    }
}
