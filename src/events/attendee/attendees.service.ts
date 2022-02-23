import {InjectRepository} from "@nestjs/typeorm";
import {Attendee} from "./attendee.entity";
import {Repository} from "typeorm";
import {Injectable} from "@nestjs/common";
import {CreateAttendeeDto} from "../input/create-attendee.dto";

@Injectable()
export class AttendeesService {
    constructor(
        @InjectRepository(Attendee)
        private readonly attendeeRepository: Repository<Attendee>
    ) {
    }

    /**
     * @param eventId
     */
    public async findByEventId(eventId: number): Promise<Attendee[]> {
        return await this.attendeeRepository.find({
            event:{id: eventId}
            });
    }

    /**
     * @param eventId
     * @param userId
     */
    public async findOneAttendeeByEventIdAndUserId(eventId: number, userId: number
    ): Promise<Attendee | undefined> {
        return await this.attendeeRepository.findOne(
            {
                event: {id: eventId},
                user: {id: userId}
            }
        );
    }

    /**
     * this method will let attendee enroll(create or update) at least an event
     * @param input
     * @param eventId
     * @param userId
     * @return
     */
    public async createOrUpdate(
        input: CreateAttendeeDto, eventId: number, userId: number
    ): Promise<Attendee> {
        const attendee = await this.findOneAttendeeByEventIdAndUserId(eventId, userId)
            ?? new Attendee();

        attendee.answer = input.answer;
        attendee.eventId = eventId;
        attendee.userId = userId;

        return await this.attendeeRepository.save(attendee);
    }
}