import {Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Profile} from "./profile.entity";
import {Event} from "../events/event.entity";
import {Expose} from "class-transformer";
import {Attendee} from "../events/attendee/attendee.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    @Expose()
    id: number;

    @Column({unique: true})
    @Expose()
    username: string;

    @Column()
    password: string;

    @Column({unique: true})
    @Expose()
    email: string;

    @Column()
    @Expose()
    firstName: string;

    @Column()
    @Expose()
    lastName: string;

    @OneToOne(() => Profile,{cascade: true})
    @JoinColumn()//Means that on the user table, there will be a profile ID column linking to this relationship
    @Expose()
    profile: Profile;

    @OneToMany(() => Event, (event) => event.organizer,{cascade: true})
    @Expose()
    organized: Event;

    @OneToMany(() => Attendee, (attendee) => attendee.user,{cascade: true})
    attended: Attendee[];
}