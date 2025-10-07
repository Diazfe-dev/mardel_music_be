import Joi from 'joi';
import { BaseDto } from "../base-dto/index.js";

// DTO para mapear datos de géneros desde la base de datos
export class GenreDto extends BaseDto {
    constructor(row) {
        super(row);
        
        // Schema para validar datos de género de la base de datos
        this.schema = Joi.object({
            id: Joi.number().integer().positive().required(),
            name: Joi.string().min(1).max(100).required(),
            description: Joi.string().max(255).allow(null).optional()
        }).unknown(true); // Permite campos adicionales de la DB
    }

    serialize() {
        return {
            id: this.data.id,
            name: this.data.name,
            description: this.data.description
        };
    }
}