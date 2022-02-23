import {Repository, SelectQueryBuilder} from "typeorm";
import {Event, PaginatedEvents} from "./event.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Injectable, Logger} from "@nestjs/common";
import {AttendeeAnswerEnum} from "./attendee/attendee.entity";
import {ListEvents, WhenEventFilter} from "./input/list.events";
import {paginate, PaginateOptions} from "../pagination/paginator";
import {CreateEventDto} from "./input/create-event.dto";
import {User} from "../auth/user.entity";
import {UpdateEventDto} from "./input/update-event.dto";

@Injectable()
export class EventsService {
    private readonly logger = new Logger(EventsService.name);

    constructor(
    @InjectRepository(Event)
        private readonly eventsRepository: Repository<Event>) {
    }

    private getEventBaseQuery(): SelectQueryBuilder<Event> {
        return this.eventsRepository
            .createQueryBuilder('e')
            .orderBy('e.id', 'DESC');
    }

    public getEventsWithAttendeeCountQuery(): SelectQueryBuilder<Event> {
        return this.getEventBaseQuery()// First to get a raw count from mysql(.getCount), but for more complicated can
            // use loadRelationCountAndMap(can be used to related entities/property but not column
            .loadRelationCountAndMap(
                'e.attendeeCount','e.attendees'// first是我们给的名字，后面是relation name
            )
            .loadRelationCountAndMap(
                'e.attendeeAccepted',
                'e.attendees',
                'attendee',
                (qb) => qb
                    .where('attendee.answer = :answer',
                        { answer: AttendeeAnswerEnum.Accepted}
                    )
            )
            .loadRelationCountAndMap(
                'e.attendeeMaybe',
                'e.attendees',
                'attendee',
                (qb) => qb
                    .where('attendee.answer = :answer',
                        { answer: AttendeeAnswerEnum.Maybe}
                    )
            )
            .loadRelationCountAndMap(
                'e.attendeeRejected',
                'e.attendees',
                'attendee',
                (qb) => qb
                    .where('attendee.answer = :answer',
                        { answer: AttendeeAnswerEnum.Rejected}
                    )
            )
    }

    private getEventsWithAttendeeCountFilteredQuery(filter?: ListEvents): SelectQueryBuilder<Event> {
        let query = this.getEventsWithAttendeeCountQuery();
        if (!filter) {
            return query;
        }
        if (filter.when) {
            if (filter.when == WhenEventFilter.Today) {
                query = query.andWhere(
                    'e.when >= CURDATE() AND e.when <= CURDATE() + INTERVAL 1 DAY'
                );// CURDATE() is the sql function that will get u the current data without the time
            }
            if (filter.when == WhenEventFilter.Tomorrow) {
                query = query.andWhere(
                    `e.when >= CURDATE() + INTERVAL 1 DAY AND e.when <= CURDATE() + INTERVAL 2 DAY`
                );// CURDATE() is the sql function that will get u the current data without the time
            }
            if (filter.when == WhenEventFilter.ThisWeek) {
                query = query.andWhere('YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(),1)');
            }
            if (filter.when == WhenEventFilter.ThisWeek) {
                query = query.andWhere('YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(),1) + 1');
            }
        }
        return query;
    }

    public async getEventsWithAttendeeCountFilterPaginated(
        filter: ListEvents,
        paginateOptions: PaginateOptions
    ): Promise<PaginatedEvents> {
        return await paginate(
            await this.getEventsWithAttendeeCountFilteredQuery(filter),
            paginateOptions
        );
    }

    /**
     * for controller findOne function
     * without filter and paginated just for controller findOne
     * @param id
     */
    public async getEventWithAttendeeCount(id: number): Promise<Event | undefined> {

        const query = this.getEventsWithAttendeeCountQuery()
            .andWhere('e.id = :id', {id});

        this.logger.debug(query.getSql());

        return await query.getOne();
    }

    /**
     * for update function
     * @param id
     */
    public async findOne(id: number): Promise<Event | undefined> {
        return await this.eventsRepository.findOne(id);
    }

    public async createEvent(input: CreateEventDto, user: User): Promise<Event> {
        return await this.eventsRepository.save(
            new Event({
                ...input,
                organizer: user,
                when: new Date(input.when)
            })
        );
    }

    public async updateEvent(event: Event, input: UpdateEventDto): Promise<Event> {
        return await this.eventsRepository.save(
            new Event({
                ...event,
                ...input,
                when: input.when ? new Date(input.when) : event.when
            })
        );
    }
    public async deleteEvent(id: number) {
        return await this.eventsRepository
            .createQueryBuilder('e')
            .delete()
            .where('id= :id', { id })
            .execute();
    }

    /**
     * for events-organized-by-user
     * @param userId
     * @param paginateOptions
     */
    public async getEventsOrganizedByUserIdPaginated(
        userId: number, paginateOptions: PaginateOptions
    ): Promise<PaginatedEvents>{// which is created in the 63 lecture
        return await paginate<Event>(this.getEventsOrganizedByUserIdQuery(userId),
            paginateOptions);
    }

    private getEventsOrganizedByUserIdQuery(
        userId: number
    ): SelectQueryBuilder<Event> {
        return this.getEventBaseQuery()
            .where('e.organizerId = :userId', {userId})
    }
    // the responsibility is to generate a query that will fetch all the events organized by a user with a specific ID

    /**
     * for current-user-event-attendance.controller
     * without filter function
     * @param userId
     * @param paginateOptions
     */
    public async getEventsAttendedByUserIdPaginated(
        userId: number, paginateOptions: PaginateOptions
    ): Promise<PaginatedEvents>{// which is created in the 63 lecture
        return await paginate<Event>(this.getEventsAttendedByUserIdQuery(userId),
            paginateOptions);
    }

    private getEventsAttendedByUserIdQuery(
        userId: number
    ): SelectQueryBuilder<Event> {
        return this.getEventBaseQuery()
            .leftJoinAndSelect('e.attendees', 'a')
            .where('a.userId = :userId', {userId})
        // leftJoinAndSelect is used for load relation
    }
}