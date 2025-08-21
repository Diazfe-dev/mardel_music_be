import { BaseException } from "../index.js";

export class InternalServerErrorException extends BaseException {
    constructor(message = 'Internal Server Error') {
        super(message, 500);
    }
}