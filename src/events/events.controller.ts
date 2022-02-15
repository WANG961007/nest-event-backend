import {
    Body, ClassSerializerInterceptor,
    Controller,
    Delete, ForbiddenException,
    Get,
    HttpCode, Logger, NotFoundException,
    Param,
    ParseIntPipe,
    Patch,
    Post, Query, SerializeOptions, UseGuards, UseInterceptors, UsePipes,
    ValidationPipe
} from "@nestjs/common";
import {CreateEventDto} from "./input/create-event.dto";
import {UpdateEventDto} from "./input/update-event.dto";
import {Event} from "./event.entity";
import {Like, MoreThan, Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {Attendee} from "./attendee.entity";
import {EventsService} from "./events.service";
import {ListEvents} from "./input/list.events";
import {CurrentUser} from "../auth/current-user";
import {User} from "../auth/user.entity";
import {AuthGuardJwt} from "../auth/auth-guard.jwt";
import {Serializer} from "v8";

@Controller('/events')
@SerializeOptions({strategy: 'excludeAll'})//on any controller you would like to serialize the data
// and the parameters can be 'excludeAll' & 'exposeAll' the first is to exclude all properties by default(recommended, the second is
// expose the all
export class EventsController {
    private readonly logger = new Logger(EventsController.name);// create a new instance of the lower class

    constructor(
        // @InjectRepository(Event)
        // private readonly repository: Repository<Event>,
        // @InjectRepository(Attendee)
        // private readonly attendRepository: Repository<Attendee>,
        // 下面的方法都替换成了eventService所以我们不再引入上面两个Repository，从而我们在test的时候只需要给eventController注入eventsService就好
        private readonly eventsService: EventsService
    ) { }

    @Get()
    @UseInterceptors(ClassSerializerInterceptor)
    @UsePipes(new ValidationPipe({ transform: true }))// use this to make QueryBuilder be populated with default when defaults are not provided
    async findAll(@Query() filter: ListEvents){
        // this.logger.debug(filter);
        // this.logger.log(`Hit the findAll route`);
        // const events =  await this.repository.find();
        const events = await this.eventsService.getEventsWithAttendeeCountFilterPaginated(
            filter,
            {
                total: true,// we want the total number of results so said it to true
                currentPage: filter.page,
                limit: 2
            });
        // this.logger.debug(`Found ${events.length} events`);
        return events;
    }

    // @Get('practice2')
    // async practice2() {
    //     // return await this.repository.findOne(
    //     //     1,
    //     //     {relations:['attendees']}
    //     // );
    //     const event = await this.repository.findOne(
    //         1,
    //         {relations:['attendees']}
    //     );
    //     // const event = new Event();
    //     // event.id = 1;
    //
    //     const attendee = new Attendee();
    //     attendee.name = 'Using cascade';
    //     // attendee.event = event;
    //
    //     event.attendees.push(attendee);
    //     // event.attendees = [];
    //     // await this.attendRepository.save(attendee);
    //     await this.repository.save(event);
    //     return event;
    //     // 整体步骤：找到Event->新建attendee->把新建的放进去->保存->返回
    // }
    //
    // @Get('/practice3')// 探究一下路由/practice3和practice3的区别 => 没区别
    // async practice3() {
    //     return await this.repository
    //         .createQueryBuilder('e')
    //         .select(['e.id', 'e.name'])
    //         .orderBy('e.id', 'DESC')
    //         .getMany();
    // }



    @Get(':id')
    @UseInterceptors(ClassSerializerInterceptor)// 对应controller上面加的那个注解，然后entity加expose注解
    async findOne(@Param('id', ParseIntPipe) id) {//parseInt就是把id自动转成Number
        // console.log(typeof id);
        // const event = await this.repository.findOne(id);
        // if (!event) {
        //     throw new NotFoundException();
        // }
        // return event;
        // After Query Builder
        const event = await this.eventsService.getEvent((id));
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
    async update(@Param('id') id,
                 @Body() input: UpdateEventDto,
                 @CurrentUser() user:User) {
        const event = await this.eventsService.getEvent(id);

        if (!event) {
            throw new NotFoundException();
        }

        if (event.organizerId !== user.id) {
            throw new ForbiddenException(null,`You are not authorized to change this event`)
        }

        return await this.eventsService.updateEvent(event, input);
    }


    @Delete(':id')
    @HttpCode(204)
    @UseGuards(AuthGuardJwt)
    @UseInterceptors(ClassSerializerInterceptor)
    async remove(@Param('id') id,
                 @CurrentUser() user:User) {
        const event = await this.eventsService.getEvent(id);
        if (!event) {
            throw new NotFoundException();
        }

        if (event.organizerId !== user.id) {
            throw new ForbiddenException(null,`You are not authorized to delete this event`)
        }

        // const event = await this.repository.findOne(id);
        //
        // if (!event) {
        //     throw new NotFoundException();
        // }
        // await this.repository.remove(event);

        // new method
        const result = await this.eventsService.deleteEvent(id);
        if (result?.affected !== 1) {// affected usage in the DeleteResult.ts ==1就是只有一行被影响的意思
            throw new NotFoundException();
        }

    }
}
