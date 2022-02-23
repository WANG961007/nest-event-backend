import {AuthGuard} from "@nestjs/passport";

/**
 * this class won't do anything else.
 */
export class AuthGuardJwt extends AuthGuard('jwt') {

}