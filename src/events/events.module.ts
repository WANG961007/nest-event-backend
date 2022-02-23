import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {EventsController} from "./events.controller";
import {Event} from "./event.entity";
import {Attendee} from "./attendee/attendee.entity";
import {EventsService} from "./events.service";
import {AttendeesService} from "./attendee/attendees.service";
import {CurrentUserEventAttendanceController} from "./attendee/current-user-event-attendance.controller";
import {EventAttendeeController} from "./attendee/event-attendee.controller";
import {EventsOrganizedByUserController} from "./events-organized-by-user.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([Event, Attendee]),
    ],
    controllers: [
        EventsController,
        CurrentUserEventAttendanceController,
        EventAttendeeController,
        EventsOrganizedByUserController],
    providers: [EventsService,AttendeesService]
})
export class EventsModule {}
