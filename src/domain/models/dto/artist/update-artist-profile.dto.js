import Joi from 'joi';
import { BaseDto } from "../base-dto/index.js";

export class UpdateArtistProfileDto extends BaseDto {
    constructor(data = {}) {
        super(data);

        this.schema = Joi.object({
            name: Joi.string()
                .min(1)
                .max(255)
                .trim()
                .optional()
                .messages({
                    'string.min': 'Artist name cannot be empty',
                    'string.max': 'Artist name must not exceed 255 characters'
                }),

            bio: Joi.string()
                .min(10)
                .max(1000)
                .trim()
                .optional()
                .messages({
                    'string.min': 'Bio must be at least 10 characters long',
                    'string.max': 'Bio must not exceed 1000 characters'
                }),

            location: Joi.string()
                .max(255)
                .trim()
                .optional()
                .allow(null, '')
                .messages({
                    'string.max': 'Location must not exceed 255 characters'
                }),

            genres: Joi.alternatives()
                .try(
                    Joi.array().items(Joi.number().integer().positive()),
                    Joi.string().pattern(/^(\d+,)*\d+$/)
                )
                .optional()
                .messages({
                    'alternatives.match': 'Genres must be an array of numbers or comma-separated string of numbers'
                }),

            social_media: Joi.alternatives()
                .try(
                    Joi.array().items(
                        Joi.object({
                            social_media_id: Joi.number().integer().positive().required(),
                            url: Joi.string().uri().required()
                        })
                    ),
                    Joi.string().custom((value, helpers) => {
                        try {
                            const parsed = JSON.parse(value);
                            if (!Array.isArray(parsed)) {
                                return helpers.error('any.invalid');
                            }
                            return parsed;
                        } catch {
                            return helpers.error('any.invalid');
                        }
                    })
                )
                .optional()
                .messages({
                    'alternatives.match': 'Social media must be an array of objects with social_media_id and url',
                    'any.invalid': 'Social media must be valid JSON array'
                }),

            profileImageUrl: Joi.string()
                .uri()
                .optional()
                .allow(null, '')
                .messages({
                    'string.uri': 'Profile image URL must be a valid URL'
                })
        }).min(1).messages({
            'object.min': 'At least one field must be provided for update'
        });
    }
}
