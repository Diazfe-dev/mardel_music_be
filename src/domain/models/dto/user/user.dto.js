import Joi from 'joi';
import { BaseDto } from "../base-dto/index.js";

// DTO para mapear datos de usuario de la base de datos (no validación de entrada)
export class UserDto extends BaseDto {
    constructor(row) {
        super(row);
        this.row = row;
        
        // Schema para validar la estructura de datos de base de datos
        this.schema = Joi.object({
            user_id: Joi.number().integer().positive().required(),
            user_name: Joi.string().required(),
            user_lastName: Joi.string().required(),
            user_email: Joi.string().email().required(),
            user_password: Joi.string().required(),
            user_profile_picture: Joi.string().uri().allow(null).optional(),
            user_social_login: Joi.boolean().optional(),
            user_phone_number: Joi.string().allow(null).optional(),
            user_created_at: Joi.date().optional(),
            user_updated_at: Joi.date().optional(),
            role_id: Joi.number().integer().positive().required()
        }).unknown(true); // Permite campos adicionales de la DB
    }

    serialize() {
        return {
            id: this.row.user_id,
            name: this.row.user_name,
            lastName: this.row.user_lastName,
            email: this.row.user_email,
            password: this.row.user_password,
            profile_picture: this.row.user_profile_picture,
            social_login: this.row.user_social_login,
            phone_number: this.row.user_phone_number,
            created_at: this.row.user_created_at,
            updated_at: this.row.user_updated_at,
            role_id: this.row.role_id
        };
    }
}

export class UserDtoWithPermissions extends BaseDto {
    constructor(row) {
        super(row);
        this.row = row;
        
        // Schema para validar datos de usuario con permisos
        this.schema = Joi.object({
            user_id: Joi.number().integer().positive().required(),
            user_name: Joi.string().required(),
            user_lastName: Joi.string().required(),
            user_email: Joi.string().email().required(),
            user_password: Joi.string().required(),
            user_profile_picture: Joi.string().uri().allow(null).optional(),
            user_social_login: Joi.boolean().optional(),
            user_phone_number: Joi.string().allow(null).optional(),
            user_created_at: Joi.date().optional(),
            user_updated_at: Joi.date().optional(),
            role_id: Joi.number().integer().positive().required(),
            role_name: Joi.string().required(),
            permissions: Joi.string().allow(null).optional()
        }).unknown(true);
    }

    serialize() {
        return {
            id: this.row.user_id,
            name: this.row.user_name,
            lastName: this.row.user_lastName,
            email: this.row.user_email,
            password: this.row.user_password,
            profile_picture: this.row.user_profile_picture,
            social_login: !!this.row.user_social_login,
            phone_number: this.row.user_phone_number,
            created_at: this.row.user_created_at,
            updated_at: this.row.user_updated_at,
            role: {
                id: this.row.role_id,
                name: this.row.role_name,
                permissions: this.row.permissions ? this.row.permissions.split(',') : []
            }
        };
    }
}