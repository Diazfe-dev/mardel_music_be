export class BaseException extends Error {
    statusCode;
    constructor(message, statusCode, stack) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        if (stack) this.stack = stack;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}