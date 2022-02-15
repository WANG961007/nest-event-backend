// test grouping
import {EventsController} from "./events.controller";
import {EventsService} from "./events.service";
import {Repository} from "typeorm";
import {Event} from "./event.entity";
import {ListEvents} from "./input/list.events";

describe('EventsController', () => {
    let eventsController: EventsController;
    let eventsService: EventsService;
    let eventRepository: Repository<Event>;

    beforeAll(() => console.log('this logged once'));// this called all group
    beforeEach(() => {
        eventsService = new EventsService(eventRepository);
        eventsController = new EventsController(eventsService);
    });// this called everytime a test is run inside this group
    it('should return a list of events', async () => {
        const result = {
            first:1,
            last:1,
            limit:10,
            data:[]
        }

        eventsService.getEventsWithAttendeeCountFilterPaginated
            = jest.fn().mockImplementation((): any => result);// 这里测试的不是eventsService的方法，而是controller，所以我们直接mock了
        expect(await eventsController.findAll(new ListEvents))
            .toEqual(result)
    });
});// group is created by colleagues
