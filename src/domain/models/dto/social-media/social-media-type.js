import {BaseDto} from "../base-dto/index.js";

export class SocialMediaTypeDto extends BaseDto {
    constructor(type) {
        super()
        this.type = type;
    }

    validate() {
        let errors = [];
        if (!this.type) {
            errors.push("[type]: Type is required.");
        }
        return errors;
    }

    serialize() {
        return {
            type: this.type
        }
    }


}