import {BaseDto} from "../base-dto/index.js";

export class SocialMediaDto extends BaseDto {
    constructor(row) {
        super()

        this.id = row.social_media_id;
        this.name = row.social_media_name;
        this.description = row.social_media_description;
        this.type = {
            id: row.social_media_type_id,
            name: row.social_media_type_name,
            description: row.social_media_type_description
        }
    }

    validate() {

    }

    serialize() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            type: {
                id: this.type.id,
                name: this.type.name,
                description: this.type.description,
            }
        }
    }


}