import { BaseException } from "../index.js";

export class BadRequestException extends BaseException {
    constructor(message) {
        super(message, 400);
    }
}