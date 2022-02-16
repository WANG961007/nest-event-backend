import {
    ClassSerializerInterceptor,
    Controller,
    Get,
    Param, ParseIntPipe,
    SerializeOptions,
    UseInterceptors
} from "@nestjs/common";
import {AttendeesService} from "./attendees.service";

@Controller('events/:eventId/attendees')
@SerializeOptions({strategy: 'excludeAll'})
export class EventAttendeeController {
    constructor(
        private readonly attendeesService: AttendeesService
    ) {
    }

    @Get()
    @UseInterceptors(ClassSerializerInterceptor)
    async findAll(@Param("eventId", ParseIntPipe) eventId: number) {
        return await this.attendeesService.findByEventID(eventId);

    }
}