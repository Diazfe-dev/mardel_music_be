import {BaseException } from "../index.js";

export class NotFoundException extends BaseException {
    constructor(message = "Resource not found") {
        super(message, 404);
    }
}