import Joi from 'joi';
import { BaseDto } from "../base-dto/index.js";

export class SocialMediaTypeDto extends BaseDto {
    constructor(data = {}) {
        super(data);
        
        this.schema = Joi.object({
            type: Joi.string()
                .min(1)
                .max(50)
                .trim()
                .required()
                .messages({
                    'string.min': 'Social media type is required',
                    'string.max': 'Social media type must not exceed 50 characters',
                    'any.required': 'Social media type is required'
                })
        });
    }
}