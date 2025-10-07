import Joi from 'joi';
import { BaseDto } from "../base-dto/index.js";

export class LoginUserDto extends BaseDto {
    constructor(data = {}) {
        super(data);
        this.schema = Joi.object({
            email: Joi.string()
                .email({ minDomainSegments: 2, tlds: { allow: true } })
                .required()
                .messages({
                    'string.email': 'Please provide a valid email address',
                    'any.required': 'Email is required'
                }),
            
            password: Joi.string()
                .min(6)
                .max(100)
                .required()
                .messages({
                    'string.min': 'Password must be at least 6 characters long',
                    'string.max': 'Password must not exceed 100 characters',
                    'any.required': 'Password is required'
                })
        });
    }
}