import {createParamDecorator, ExecutionContext} from "@nestjs/common";

export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {//data means you can pass some data to your decorator
        // the second allows you to get some context, information about the request.
        const request = ctx.switchToHttp().getRequest();
        return request.user ?? null;// means that this decorator when used, if someone is authenticated,it will return the user object or null
    }
);