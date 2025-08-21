import { BaseException } from "../index.js";
export class UnauthorizedException extends BaseException {
    constructor(message) {
        super(message, 401);
    }
}