import {InternalServerErrorException} from "../lib/index.js";
import {UserDto, UserDtoWithPermissions} from "../../domain/models/dto/index.js";

export class UserRepository {
    constructor(db) {
        this.db = db;
    }

    async findByEmail(email) {
        try {
            const [rows] = await this.db.execute(
                'SELECT * FROM user_permissions_details WHERE user_email = ?',
                [email]
            );
            if (!rows || rows.length === 0 || !rows[0]) {
                return null; // No se encontró el usuario
            }
            return new UserDtoWithPermissions(rows[0]).serialize();
        } catch (err) {
            throw new InternalServerErrorException('Database query failed: ' + err.message);
        }
    }

    async findById(id) {
        try {
            const [rows] = await this.db.execute(
                'SELECT * FROM user_permissions_details WHERE user_id = ?',
                [id]
            );
            return new UserDtoWithPermissions(rows[0]).serialize();
        } catch (err) {
            throw new InternalServerErrorException('Database query failed: ' + err.message);
        }
    }

    async create({
                     role_id = null,
                     name,
                     lastName,
                     email,
                     password,
                     profile_picture = null,
                     social_login = false,
                     phone_number = null
                 }) {
        try {
            await this.db.execute(
                `CALL sp_create_user(?, ?, ?, ?, ?, ?, ?, ?, @new_user_id)`,
                [name, lastName, email, password, profile_picture, role_id, social_login, phone_number]
            );
            const [result] = await this.db.execute(`SELECT @new_user_id AS user_id`);
            const new_user_id = result && result.length > 0 ? result[0].user_id : null;

            if (!new_user_id) {
                throw new InternalServerErrorException('Failed to retrieve user_id after creation from SP.');
            }
            return this.findById(new_user_id);
        } catch (err) {
            throw new InternalServerErrorException('Failed to create user via SP: ' + err.message);
        }
    }

    async updateProfileImage(userId, imageUrl) {
        console.log(userId, imageUrl);
        try {
            const [result] = await this.db.execute(
                `UPDATE users SET profile_picture = ? WHERE id = ?`,
                [imageUrl, userId]
            );
            return result.affectedRows > 0;
        } catch (err) {
            throw new InternalServerErrorException('Failed to update profile image: ' + err.message);
        }
    }
}
