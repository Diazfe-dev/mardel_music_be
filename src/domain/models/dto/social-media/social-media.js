import Joi from 'joi';
import { BaseDto } from "../base-dto/index.js";

// DTO para mapear datos de redes sociales desde la base de datos
export class SocialMediaDto extends BaseDto {
    constructor(row) {
        super(row);
        
        // Schema para validar datos de redes sociales de la base de datos
        this.schema = Joi.object({
            social_media_id: Joi.number().integer().positive().required(),
            social_media_name: Joi.string().required(),
            social_media_description: Joi.string().allow(null).optional(),
            social_media_type_id: Joi.number().integer().positive().required(),
            social_media_type_name: Joi.string().required(),
            social_media_type_description: Joi.string().allow(null).optional()
        }).unknown(true); // Permite campos adicionales de la DB
    }

    serialize() {
        return {
            id: this.data.social_media_id,
            name: this.data.social_media_name,
            description: this.data.social_media_description,
            type: {
                id: this.data.social_media_type_id,
                name: this.data.social_media_type_name,
                description: this.data.social_media_type_description,
            }
        };
    }
}