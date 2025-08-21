import { BaseException } from "../index.js";

export class ConflictException extends BaseException {
    constructor(message) {
        super(message, 409);
    }
}