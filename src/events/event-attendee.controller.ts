import {
    ClassSerializerInterceptor,
    Controller,
    Get,
    Param,
    SerializeOptions,
    UseInterceptors
} from "@nestjs/common";
import {AttendeesService} from "./attendees.service";

@Controller('events/:eventId:attendees')
@SerializeOptions({strategy: 'excludeAll'})
export class EventAttendeeController {
    constructor(
        private readonly attendeesService: AttendeesService
    ) {
    }

    @Get()
    @UseInterceptors(ClassSerializerInterceptor)
    async findAll(@Param('eventId') eventId: number) {
        return await this.attendeesService.findByEventID(eventId);

    }
}