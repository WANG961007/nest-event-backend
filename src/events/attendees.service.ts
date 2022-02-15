import {InjectRepository} from "@nestjs/typeorm";
import {Attendee} from "./attendee.entity";
import {Repository} from "typeorm";
import {Injectable} from "@nestjs/common";
import {CreateAttendeeDto} from "./input/create-attendee.dto";

@Injectable()
export class AttendeesService {
    constructor(
        @InjectRepository(Attendee)
        private readonly attendeeRepository: Repository<Attendee>
    ) {
    }

    public async findByEventID(eventId: number): Promise<Attendee[]> {
        return await this.attendeeRepository.find({
            event: {id: eventId}
        });
    }

    public async findOneByEventIdAndUserId(
        eventId: number, userId: number
    ): Promise<Attendee | undefined> {
        return await this.attendeeRepository.findOne(
            {
                event: {id: eventId},
                user: {id: userId}
            }
        )
    }

    // this method will let you enroll at least an event
    public async createOrUpdate(
        input: CreateAttendeeDto, eventId: number, userId: number
    ): Promise<Attendee> {
        const attendee = await this.findOneByEventIdAndUserId(eventId, userId)
            ?? new Attendee();
        // means that you haven't decide yet whether you want to attend an event or not
        // then here will pass the data from the input to the attendee

        attendee.eventId = eventId;
        attendee.userId = userId;
        attendee.answer = input.answer;

        return await this.attendeeRepository.save(attendee);
    }
}