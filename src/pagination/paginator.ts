import {SelectQueryBuilder} from "typeorm";
import {Expose} from "class-transformer";

export interface PaginateOptions {
    limit: number;//the number is the amount of item you would like to see in the current page
    currentPage: number;
    total?: boolean;//total number of results
}

export class PaginationResult<T> {//T exists because data type is T
    constructor(partial:Partial<PaginationResult<T>>) //partial means that it will be a new kind of class or new kind of object
    // which can be optional
    {
        Object.assign(this, partial);
    }
    @Expose()
    first: number;
    @Expose()
    last: number;
    @Expose()
    limit: number;
    @Expose()
    total?: number;
    @Expose()
    data: T[];//Use T because it might be used for many types like events or attendees or maybe users
}

export async function paginate<T>(
    qb: SelectQueryBuilder<T>,
    options: PaginateOptions = {
        limit: 10,
        currentPage: 1,
    }
): Promise<PaginationResult<T>> {
    const offset = (options.currentPage - 1) * options.limit;//offset is the order number of record we want to start from this page
    const data = await qb.limit(options.limit)
        .offset(offset).getMany();

    return new PaginationResult<T>({
        first: offset + 1,
        last: offset + data.length,
        limit: options.limit,
        total: options.total ? await qb.getCount() : null,
        data
    })
}