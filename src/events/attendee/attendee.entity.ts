import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Event} from "../event.entity";
import {Expose} from "class-transformer";
import {User} from "../../auth/user.entity";

export enum AttendeeAnswerEnum {
    Accepted = 1,
    Maybe,
    Rejected
}

@Entity()
export class Attendee {
    @PrimaryGeneratedColumn()
    @Expose()
    id: number;

    // @Column()
    // @Expose()
    // name: string;

    @ManyToOne(() => Event, (event) => event.attendees,{
        nullable: true,
        // onDelete: "CASCADE"
        // onUpdate: "CASCADE"
    })
    @JoinColumn()
    event: Event;

    @Column()
    eventId: number;// 为了和event related的时候更方便看，同下面的userId

    @Column('enum', {
        enum: AttendeeAnswerEnum,
        default: AttendeeAnswerEnum.Accepted
    })
    @Expose()
    answer: AttendeeAnswerEnum;

    @ManyToOne(() => User, (user) => user.attended)
    user: User;

    @Column()
    userId: number; // 为了和user related的时候更加方便看，同上面的eventId
}