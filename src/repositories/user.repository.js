export class UserRepository {
    constructor(db) {
        this.db = db;
    }

    async findByEmail(email) {
        const [rows] = await this.db.execute(
            `
                SELECT u.id,
                       u.name,
                       u.lastName,
                       u.email,
                       u.password,
                       u.profile_picture,
                       u.created_at,
                       u.updated_at,
                       r.id   AS role_id,
                       r.name AS role_name,
                       p.id   AS permission_id,
                       p.name AS permission_name
                FROM users u
                         LEFT JOIN roles r ON u.role_id = r.id
                         LEFT JOIN permissions_to_roles rp ON r.id = rp.role_id
                         LEFT JOIN permissions p ON rp.permission_id = p.id
                WHERE u.email = ?
            `,
            [email]
        );

        return this.__mapUserWithPermissions(rows);
    }

    async findById(id) {
        const [rows] = await this.db.execute(
            `
                SELECT u.id,
                       u.name,
                       u.lastName,
                       u.email,
                       u.password,
                       u.profile_picture,
                       u.created_at,
                       u.updated_at,
                       r.id   AS role_id,
                       r.name AS role_name,
                       p.id   AS permission_id,
                       p.name AS permission_name
                FROM users u
                         LEFT JOIN roles r ON u.role_id = r.id
                         LEFT JOIN permissions_to_roles rp ON r.id = rp.role_id
                         LEFT JOIN permissions p ON rp.permission_id = p.id
                WHERE u.id = ? LIMIT 100
            `,
            [id]
        );

        return this.__mapUserWithPermissions(rows);
    }

    async create({role_id, name, lastName, email, password, profile_picture = null}) {
        const [result] = await this.db.execute(
            `
                INSERT INTO users (role_id, name, lastName, email, password, profile_picture)
                VALUES (?, ?, ?, ?, ?, ?)
            `,
            [role_id, name, lastName, email, password, profile_picture]
        );

        return this.findById(result.insertId);
    }

    __mapUserWithPermissions(rows) {
        if (!rows.length) return null;

        const {id, name, lastName, email, password, profile_picture, created_at, updated_at, role_id, role_name} = rows[0];
        const permissions = rows
            .filter(r => r.permission_id)
            .map(r => (r.permission_name));

        return {
            id,
            name,
            lastName,
            email,
            profile_picture,
            password,
            created_at,
            updated_at,
            role: role_name,
            permissions
        };
    }

}
