import Joi from 'joi';
import { BaseDto } from "../base-dto/index.js";

export class RegisterUserDto extends BaseDto {
    constructor(data = {}) {
        super(data);
        this.schema = Joi.object({
            name: Joi.string()
                .min(3)
                .max(50)
                .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
                .required()
                .messages({
                    'string.min': 'Name must be at least 3 characters long',
                    'string.max': 'Name must not exceed 50 characters',
                    'string.pattern.base': 'Name must contain only letters and spaces',
                    'any.required': 'Name is required'
                }),
            
            lastName: Joi.string()
                .min(3)
                .max(50)
                .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
                .required()
                .messages({
                    'string.min': 'Last name must be at least 3 characters long',
                    'string.max': 'Last name must not exceed 50 characters',
                    'string.pattern.base': 'Last name must contain only letters and spaces',
                    'any.required': 'Last name is required'
                }),
            
            email: Joi.string()
                .email({ minDomainSegments: 2, tlds: { allow: true } })
                .max(255)
                .required()
                .messages({
                    'string.email': 'Please provide a valid email address',
                    'string.max': 'Email must not exceed 255 characters',
                    'any.required': 'Email is required'
                }),
            
            password: Joi.string()
                .min(6)
                .max(100)
                .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
                .required()
                .messages({
                    'string.min': 'Password must be at least 6 characters long',
                    'string.max': 'Password must not exceed 100 characters',
                    'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, and one number',
                    'any.required': 'Password is required'
                }),
            
            phone_number: Joi.string()
                .min(7)
                .max(20)
                .pattern(/^[\+]?[0-9\s\-\(\)]+$/)
                .optional()
                .allow(null, '')
                .messages({
                    'string.min': 'Phone number must be at least 7 characters long',
                    'string.max': 'Phone number must not exceed 20 characters',
                    'string.pattern.base': 'Please provide a valid phone number'
                })
        });
    }
}
