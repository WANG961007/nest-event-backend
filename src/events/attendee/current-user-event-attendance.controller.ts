import {
    Body, ClassSerializerInterceptor,
    Controller, DefaultValuePipe,
    Get, NotFoundException,
    Param,
    ParseIntPipe,
    Put, Query,
    SerializeOptions,
    UseGuards,
    UseInterceptors
} from "@nestjs/common";
import {EventsService} from "../events.service";
import {AttendeesService} from "./attendees.service";
import {CreateAttendeeDto} from "../input/create-attendee.dto";
import {CurrentUser} from "../../auth/current-user";
import {User} from "../../auth/user.entity";
import {AuthGuardJwt} from "../../auth/auth-guard.jwt";
import {ApiOperation} from "@nestjs/swagger";

/**
 * ParseIntPipe : verify the eventId is number
 */

@Controller('events-attendance')
@SerializeOptions({strategy: 'excludeAll'})
export class CurrentUserEventAttendanceController {
    constructor(
        private readonly eventsService: EventsService,
        private readonly attendeesService: AttendeesService
    ) {
    }

    // @ts-ignore
    @ApiOperation("get All Event with attendees")
    @Get()
    @UseGuards(AuthGuardJwt)
    @UseInterceptors(ClassSerializerInterceptor)
    async findAll(
        @CurrentUser() user: User,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1
    ) {
        return await this.eventsService.
        getEventsAttendedByUserIdPaginated(
            user.id,{limit:6, currentPage: page}
        )
    }

    // @ts-ignore
    @ApiOperation("get attendee by eventId")
    @Get(":eventId")
    @UseGuards(AuthGuardJwt)
    @UseInterceptors(ClassSerializerInterceptor)
    async findOne(
        @Param('eventId', ParseIntPipe) eventId: number,
        @CurrentUser() user: User
    ) {
        const attendee = await this.attendeesService
            .findOneAttendeeByEventIdAndUserId(eventId, user.id);
        if (!attendee) {
            throw new NotFoundException();
        }
        return attendee;
    }

    // @ts-ignore
    @ApiOperation("Create attendee for specified event")
    @Put("/:eventId")
    @UseGuards(AuthGuardJwt)
    @UseInterceptors(ClassSerializerInterceptor)
    async createOrUpdate(
        @Param("eventId", ParseIntPipe) eventId: number,
        @CurrentUser() user: User,
        @Body() input: CreateAttendeeDto
    ) {
        return this.attendeesService.createOrUpdate(input, eventId, user.id);
    }
}