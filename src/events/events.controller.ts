import {
    Body, ClassSerializerInterceptor,
    Controller,
    Delete, ForbiddenException,
    Get,
    HttpCode, NotFoundException,
    Param,
    ParseIntPipe,
    Patch,
    Post, Query, SerializeOptions, UseGuards, UseInterceptors, UsePipes,
    ValidationPipe
} from "@nestjs/common";
import {CreateEventDto} from "./input/create-event.dto";
import {UpdateEventDto} from "./input/update-event.dto";
import {EventsService} from "./events.service";
import {ListEvents} from "./input/list.events";
import {CurrentUser} from "../auth/current-user";
import {User} from "../auth/user.entity";
import {AuthGuardJwt} from "../auth/auth-guard.jwt";

@Controller('/events')
@SerializeOptions({strategy: 'excludeAll'})
export class EventsController {
    // private readonly logger = new Logger(EventsController.name);

    constructor(
        private readonly eventsService: EventsService
    ) { }

    @Get()
    @UseInterceptors(ClassSerializerInterceptor)
    @UsePipes(new ValidationPipe({transform: true}))
    async findAll(@Query() filter: ListEvents) {
        // const events = await this.eventsService.getEventsWithAttendeeCountFilterPaginated(
        //     filter,
        //     {
        //         total: true,
        //         currentPage: filter.page,
        //         limit: 2
        //     });
        // return events;
        return await this.eventsService.getEventsWithAttendeeCountFilterPaginated(
            filter,
            {
                total: true,
                currentPage: filter.page,
                limit: 2
            })
    }

    @Get(':id')
    @UseInterceptors(ClassSerializerInterceptor)
    async findOne(@Param('id', ParseIntPipe) id) {
        const event = await this.eventsService.getEventWithAttendeeCount((id));
        if (!event) {
            throw new NotFoundException();
        }
        return event;
    }

    @Post()
    @UseGuards(AuthGuardJwt)
    @UseInterceptors(ClassSerializerInterceptor)
    async create(@Body() input: CreateEventDto,
                 @CurrentUser() user:User) {
        return await this.eventsService.createEvent(input, user);
    };

    @Patch(':id')
    @UseGuards(AuthGuardJwt)
    @UseInterceptors(ClassSerializerInterceptor)
    async update(@Param('id', ParseIntPipe) id,
                 @Body() input: UpdateEventDto,
                 @CurrentUser() user: User) {
        const event = await this.eventsService.findOne(id);

        if (!event) {
            throw new NotFoundException();
        }

        if (event.organizerId !== user.id) {
            throw new ForbiddenException(null, `You are not authorized to change this event`)
        }

        return await this.eventsService.updateEvent(event, input);
    }


    /**
     * @param id
     * @param user
     */
    @Delete(':id')
    @HttpCode(204)
    @UseGuards(AuthGuardJwt)
    @UseInterceptors(ClassSerializerInterceptor)
    async remove(@Param('id', ParseIntPipe) id,
                 @CurrentUser() user: User) {
        const event = await this.eventsService.findOne(id);
        if (!event) {
            throw new NotFoundException();
        }

        if (event.organizerId !== user.id) {
            throw new ForbiddenException(null, `You are not authorized to delete this event`)
        }

        const result = await this.eventsService.deleteEvent(id);
        if (result?.affected !== 1) {// affected usage in the DeleteResult.ts ==1就是只有一行被影响的意思
            throw new NotFoundException();
        }

    }
}
