import {createParamDecorator, ExecutionContext} from "@nestjs/common";

/**
 *  data : can pass some data to this created decorator
 *  ctx : allow us to get some context, information about the request
 *  return request.user ?? null : when this decorator used & someone is authenticated, return user object or null
 */
export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user ?? null;
    }
);