import { Controller, Post } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from './subject.entity';
import { Teacher } from './teacher.entity';
import {User} from "../auth/user.entity";
import {Profile} from "../auth/profile.entity";

@Controller('school')
export class TrainingController {
  constructor(
      @InjectRepository(Subject)
      private readonly subjectRepository: Repository<Subject>,
      @InjectRepository(Teacher)
      private readonly teacherRepository: Repository<Teacher>,
      @InjectRepository(User)
      private readonly userRepository: Repository<User>
  ) {
  }

  @Post('/create1')
  public async savingRelationForUser() {
    const user = new User()
    user.username = 'Test';
    user.password = '123456';
    user.email = '231231';
    user.firstName = 'hahah';
    user.lastName = 'nksdkfh';

    const profile = new Profile();
    profile.age = 88;

    user.profile = profile;
    await this.userRepository.save(user);
  }

  @Post('/create')
  public async savingRelation() {

    // const subject = new Subject();
    // subject.name = 'Math';
    const subject = await this.subjectRepository.findOne(3);//Because we want to use the 3 Math as example

    // const teacher1 = new Teacher();
    // teacher1.name = 'John Doe';
    // const teacher2 = new Teacher();
    // teacher2.name = 'Harry Doe';
    // // subject.teachers = [teacher1, teacher2];
    // await this.teacherRepository.save([teacher1, teacher2])
    const teacher1 = await this.teacherRepository.findOne(3);// find id in the adminer
    const teacher2 = await this.teacherRepository.findOne(4);
    await this.subjectRepository
        .createQueryBuilder()
        .relation(Subject, 'teachers')
        .of(subject)
        .add([teacher1, teacher2]);

    // How to use One to One
    // const user = new User();
    // const profile = new Profile();

    // user.profile = profile;
    // user.profile = null;
    // Save the user here

  }

  @Post('/remove')
  public async removingRelation() {
    // const subject = await this.subjectRepository.findOne(
    //   1,
    //   { relations: ['teachers'] }
    // );

    // subject.teachers = subject.teachers.filter(
    //   teacher => teacher.id !== 2
    // );

    // await this.subjectRepository.save(subject);
    await this.subjectRepository.createQueryBuilder('s')
        .update()
        .set({name: "Confidential"})
        .execute();
  }

}