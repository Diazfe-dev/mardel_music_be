import {BaseDto} from "../index.js";

export class SaveProfileImageDto extends BaseDto {
    constructor(data, file) {
        super();
        this.user_id = data.user_id;
        this.profile_image = file;
    }

    validate() {
        let errors = [];
        if (!this.user_id) {
            errors.push("[user_id] User id is required");
        }
        if (!this.profile_image) {
            errors.push("[profile_image] Image is required");
        }
        return []
    }

    serialize() {
        return {
            user_id: this.user_id,
            profile_image: this.profile_image
        }
    }
}