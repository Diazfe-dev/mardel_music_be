import {BaseDto} from "../base-dto/index.js";

export class GenreDto extends BaseDto {
    constructor(row) {
        super()
        this.id = row.id;
        this.name = row.name;
        this.description = row.description;
    }

    validate() {
        const errors = [];
        
        if (!this.name || typeof this.name !== 'string' || this.name.trim().length === 0) {
            errors.push('Name is required and must be a non-empty string');
        } else if (this.name.length > 100) {
            errors.push('Name must be less than 100 characters');
        }

        if (this.description && (typeof this.description !== 'string' || this.description.length > 255)) {
            errors.push('Description must be a string less than 255 characters');
        }

        return errors;
    }

    serialize() {
        return {
            id: this.id,
            name: this.name,
            description: this.description
        }
    }


}