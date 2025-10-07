import Joi from 'joi';
import { BaseDto } from "../base-dto/index.js";

export class CreateEventDto extends BaseDto {
    constructor(data = {}) {
        super(data);
        this.schema = Joi.object({
            name: Joi.string()
                .min(3)
                .max(255)
                .required()
                .messages({
                    'string.min': 'Event name must be at least 3 characters long',
                    'string.max': 'Event name must not exceed 255 characters',
                    'any.required': 'Event name is required'
                }),
                
            description: Joi.string()
                .min(10)
                .max(2000)
                .required()
                .messages({
                    'string.min': 'Description must be at least 10 characters long',
                    'string.max': 'Description must not exceed 2000 characters',
                    'any.required': 'Description is required'
                }),
                
            date: Joi.date()
                .iso()
                .min('now')
                .required()
                .messages({
                    'date.format': 'Date must be in ISO format (YYYY-MM-DDTHH:mm:ss.sssZ)',
                    'date.min': 'Event date must be in the future',
                    'any.required': 'Event date is required'
                }),
                
            location: Joi.string()
                .min(5)
                .max(500)
                .required()
                .messages({
                    'string.min': 'Location must be at least 5 characters long',
                    'string.max': 'Location must not exceed 500 characters',
                    'any.required': 'Location is required'
                }),
                
            ticket_price: Joi.number()
                .precision(2)
                .min(0)
                .max(9999.99)
                .allow(null)
                .optional()
                .messages({
                    'number.min': 'Ticket price must be 0 or greater',
                    'number.max': 'Ticket price must not exceed 9999.99',
                    'number.precision': 'Ticket price can have at most 2 decimal places'
                }),
                
            ticket_url: Joi.string()
                .uri()
                .max(500)
                .allow(null, '')
                .optional()
                .messages({
                    'string.uri': 'Ticket URL must be a valid URL',
                    'string.max': 'Ticket URL must not exceed 500 characters'
                }),
                
            contact_info: Joi.string()
                .max(500)
                .allow(null, '')
                .optional()
                .messages({
                    'string.max': 'Contact info must not exceed 500 characters'
                }),
                
            genres: Joi.array()
                .items(Joi.number().integer().positive())
                .min(0)
                .max(10)
                .optional()
                .messages({
                    'array.min': 'At least 1 genre is recommended',
                    'array.max': 'Maximum 10 genres allowed',
                    'number.positive': 'Genre IDs must be positive numbers'
                }),
                
            is_active: Joi.boolean()
                .optional()
                .default(true)
        });
    }
}