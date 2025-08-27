export class RoleRepository {
    constructor(db) {
        this.db = db;
    }

    async findAll() {
        const [rows] = await this.db.execute(
            'SELECT id, name, description, created_at, updated_at FROM roles'
        );
        return rows;
    }

    async findById(id) {
        const [rows] = await this.db.execute(
            'SELECT id, name, description, created_at, updated_at FROM roles WHERE id = ? LIMIT 1',
            [id]
        );
        return rows[0] ?? null;
    }

    async findByName(name) {
        const [rows] = await this.db.execute(
            'SELECT id, name, description, created_at, updated_at FROM roles WHERE name = ?',
            [name]
        );
        return rows[0] ?? null;
    }

    async findWithPermissionsById(id) {
        const [rows] = await this.db.execute(
            `SELECT r.id AS role_id, r.name AS role_name, r.description AS role_description,
                    p.id AS permission_id, p.name AS permission_name, p.description AS permission_description
             FROM roles r
             LEFT JOIN permissions_to_roles pr ON r.id = pr.role_id
             LEFT JOIN permissions p ON pr.permission_id = p.id
             WHERE r.id = ?`,
            [id]
        );
        return rows;
    }

    async create({ name, description }) {
        const [result] = await this.db.execute(
            'INSERT INTO roles (name, description) VALUES (?, ?)',
            [name, description]
        );
        return this.findById(result.insertId);
    }

    async update(id, { name, description }) {
        await this.db.execute(
            'UPDATE roles SET name = ?, description = ? WHERE id = ?',
            [name, description, id]
        );
        return this.findById(id);
    }

    async delete(id) {
        await this.db.execute(
            'DELETE FROM roles WHERE id = ?',
            [id]
        );
        return { message: 'Role deleted successfully' };
    }
}
