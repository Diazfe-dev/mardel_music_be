export class PermissionRepository {
    constructor(db) {
        this.db = db;
    }

    async findAll() {
        const [rows] = await this.db.execute(
            'SELECT id, name, description, created_at, updated_at FROM permissions'
        );
        return rows;
    }

    async findByRoleId(roleId) {
        const [rows] = await this.db.execute(
            `SELECT p.id, p.name, p.description, p.created_at, p.updated_at
             FROM permissions p
             INNER JOIN permissions_to_roles pr ON p.id = pr.permission_id
             WHERE pr.role_id = ?`,
            [roleId]
        );
        return rows;
    }

    async findByName(name) {
        const [rows] = await this.db.execute(
            'SELECT id, name, description, created_at, updated_at FROM permissions WHERE name = ?',
            [name]
        );
        return rows[0] ?? null;
    }

    async findById(id) {
        const [rows] = await this.db.execute(
            'SELECT id, name, description, created_at, updated_at FROM permissions WHERE id = ? LIMIT 1',
            [id]
        );
        return rows[0] ?? null;
    }

    async create({ name, description }) {
        const [result] = await this.db.execute(
            'INSERT INTO permissions (name, description) VALUES (?, ?)',
            [name, description]
        );
        return this.findById(result.insertId);
    }

    async update(id, { name, description }) {
        await this.db.execute(
            'UPDATE permissions SET name = ?, description = ? WHERE id = ?',
            [name, description, id]
        );
        return this.findById(id);
    }

    async delete(id) {
        await this.db.execute(
            'DELETE FROM permissions WHERE id = ?',
            [id]
        );
        return { message: 'Permission deleted successfully' };
    }
}
