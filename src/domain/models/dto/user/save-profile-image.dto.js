import Joi from 'joi';
import { BaseDto } from "../base-dto/index.js";

export class SaveProfileImageDto extends BaseDto {
    constructor(data = {}, file = null) {
        super({ ...data, profile_image: file });
        
        this.schema = Joi.object({
            user_id: Joi.number()
                .integer()
                .positive()
                .required()
                .messages({
                    'number.base': 'User ID must be a number',
                    'number.integer': 'User ID must be an integer',
                    'number.positive': 'User ID must be positive',
                    'any.required': 'User ID is required'
                }),
            
            profile_image: Joi.object({
                fieldname: Joi.string().required(),
                originalname: Joi.string().required(),
                encoding: Joi.string().required(),
                mimetype: Joi.string().valid(
                    'image/jpeg', 
                    'image/jpg', 
                    'image/png', 
                    'image/webp'
                ).required().messages({
                    'any.only': 'Only JPEG, JPG, PNG and WEBP images are allowed'
                }),
                size: Joi.number().max(5 * 1024 * 1024).required().messages({
                    'number.max': 'Image size must not exceed 5MB'
                }),
                buffer: Joi.binary().required()
            }).required().messages({
                'any.required': 'Profile image is required'
            })
        });
    }

    // Método de conveniencia para obtener solo los datos necesarios
    getProcessedData() {
        return {
            user_id: this.data.user_id,
            profile_image: this.data.profile_image
        };
    }
}