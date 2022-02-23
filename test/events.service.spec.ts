import {EventsService} from "../src/events/events.service";
import {Repository} from "typeorm";
import {Event} from "../src/events/event.entity";
import {Test} from "@nestjs/testing";
import {getRepositoryToken} from "@nestjs/typeorm";


describe('EventsService', () => {
    let service: EventsService;
    let repository: Repository<Event>;
    let selectQb;

    // we create a real module which would have the real jest context
    // it is a little bit fake because it created in a special class that only used for testing
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                EventsService,
                {
                    provide: getRepositoryToken(Event),
                    useValue: {
                        save: jest.fn(),
                        createQueryBuilder: jest.fn().mockReturnValue(selectQb),
                        delete: jest.fn(),
                        where: jest.fn(),
                        execute: jest.fn()
                    }
                }
            ]
        }).compile();

        service = module.get<EventsService>(EventsService);
        repository = module.get<Repository<Event>>(
            getRepositoryToken(Event)
        );
        selectQb = {
            delete: jest.fn(),// where every single one of them is a mock
            where: jest.fn(),
            execute: jest.fn(),
            orderBy: jest.fn(),
            leftJoinAndSelect: jest.fn()
        }
    });

    describe('updateEvent', () => {
        it('should update the event', async () => {
            const repoSpy = jest.spyOn(repository, 'save')
                .mockResolvedValue({id: 1} as Event);
            await expect(service.updateEvent(new Event({id: 1}), {
                name: 'New name'
            })).resolves.toEqual({id: 1})
            expect(repoSpy).toBeCalledWith({id:1, name: 'New name'})
        });
    });

    describe('deleteEvent', () => {
        it('should delete an event', async () => {

        });
    });
});