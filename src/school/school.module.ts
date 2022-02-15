import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from './subject.entity';
import { Teacher } from './teacher.entity';
import { TrainingController } from "./training.controller";
import {User} from "../auth/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Subject, Teacher, User])],
  controllers: [TrainingController]
})
export class SchoolModule { }