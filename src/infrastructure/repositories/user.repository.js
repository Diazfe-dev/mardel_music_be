import { InternalServerErrorException } from "../lib/index.js";

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
            return this.__mapUserWithPermissions(rows);
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
            return this.__mapUserWithPermissions(rows);
        } catch (err) {
            throw new InternalServerErrorException('Database query failed: ' + err.message);
        }
    }

    async create({ role_id = null, name, lastName, email, password, profile_picture = null }) {
        try {
            await this.db.execute(
                `CALL sp_create_user(?, ?, ?, ?, ?, ?, @new_user_id)`,
                [name, lastName, email, password, profile_picture, role_id]
            );

            const [result] = await this.db.execute(`SELECT @new_user_id AS user_id`);
            const new_user_id = result[0].user_id;

            if (!new_user_id) {
                throw new InternalServerErrorException('Failed to retrieve user_id after creation from SP.');
            }
            return this.findById(new_user_id);
        } catch (err) {
            throw new InternalServerErrorException('Failed to create user via SP: ' + err.message);
        }
    }

    __mapUserWithPermissions(rows) {
        if (!rows || rows.length === 0) return null;

        const {
            user_id,
            user_name,
            user_lastName,
            user_email,
            user_password,
            user_profile_picture,
            user_created_at,
            user_updated_at,
            role_id,
            role_name,
            permissions
        } = rows[0];

        return {
            id: user_id,
            name: user_name,
            lastName: user_lastName,
            email: user_email,
            profile_picture: user_profile_picture,
            password: user_password,
            createdAt: user_created_at,
            updatedAt: user_updated_at,
            role: {
                id: role_id,
                name: role_name
            },
            permissions: permissions ? permissions.split(',').map(p => p.trim()) : []
        };
    }
}
