export class BaseDto {
    constructor() {
    }

    validate() {
        throw new Error("Method not implemented.");
    }

    serialize() {
        throw new Error("Method not implemented.");
    }
}