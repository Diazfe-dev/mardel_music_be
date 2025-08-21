export class ProfileRepository {
    constructor(db) {
        this.db = db;
    }

    async findAll() {
        const [rows] = await this.db.execute(
            `SELECT p.id, p.user_id, p.artist_name, p.bio, p.avatar_url, p.verified, 
                    p.created_at, p.updated_at,
                    u.name, u.lastName, u.email, u.role_id,
                    r.name as role_name
             FROM profiles p
             INNER JOIN users u ON p.user_id = u.id
             INNER JOIN roles r ON u.role_id = r.id`
        );
        return rows;
    }

    async findById(id) {
        const [rows] = await this.db.execute(
            `SELECT p.id, p.user_id, p.artist_name, p.bio, p.avatar_url, p.verified, 
                    p.created_at, p.updated_at,
                    u.name, u.lastName, u.email, u.role_id,
                    r.name as role_name
             FROM profiles p
             INNER JOIN users u ON p.user_id = u.id
             INNER JOIN roles r ON u.role_id = r.id
             WHERE p.id = ?`,
            [id]
        );
        return rows[0] ?? null;
    }

    async findByUserId(userId) {
        const [rows] = await this.db.execute(
            `SELECT p.id, p.user_id, p.artist_name, p.bio, p.avatar_url, p.verified, 
                    p.created_at, p.updated_at,
                    u.name, u.lastName, u.email, u.role_id,
                    r.name as role_name
             FROM profiles p
             INNER JOIN users u ON p.user_id = u.id
             INNER JOIN roles r ON u.role_id = r.id
             WHERE p.user_id = ?`,
            [userId]
        );
        return rows[0] ?? null;
    }

    async findByArtistName(artistName) {
        const [rows] = await this.db.execute(
            `SELECT p.id, p.user_id, p.artist_name, p.bio, p.avatar_url, p.verified, 
                    p.created_at, p.updated_at,
                    u.name, u.lastName, u.email, u.role_id,
                    r.name as role_name
             FROM profiles p
             INNER JOIN users u ON p.user_id = u.id
             INNER JOIN roles r ON u.role_id = r.id
             WHERE p.artist_name = ?`,
            [artistName]
        );
        return rows[0] ?? null;
    }

    async create({ user_id, artist_name, bio, avatar_url, verified = false }) {
        const [result] = await this.db.execute(
            'INSERT INTO profiles (user_id, artist_name, bio, avatar_url, verified) VALUES (?, ?, ?, ?, ?)',
            [user_id, artist_name, bio, avatar_url, verified]
        );
        return this.findById(result.insertId);
    }

    async update(id, { artist_name, bio, avatar_url, verified }) {
        const fields = [];
        const values = [];

        if (artist_name !== undefined) {
            fields.push('artist_name = ?');
            values.push(artist_name);
        }
        if (bio !== undefined) {
            fields.push('bio = ?');
            values.push(bio);
        }
        if (avatar_url !== undefined) {
            fields.push('avatar_url = ?');
            values.push(avatar_url);
        }
        if (verified !== undefined) {
            fields.push('verified = ?');
            values.push(verified);
        }

        if (fields.length === 0) {
            return this.findById(id);
        }

        values.push(id);

        await this.db.execute(
            `UPDATE profiles SET ${fields.join(', ')} WHERE id = ?`,
            values
        );
        return this.findById(id);
    }

    async delete(id) {
        await this.db.execute('DELETE FROM profiles WHERE id = ?', [id]);
        return { message: 'Profile deleted successfully' };
    }

    async searchByArtistName(searchTerm, limit = 10) {
        const [rows] = await this.db.execute(
            `SELECT p.id, p.user_id, p.artist_name, p.bio, p.avatar_url, p.verified, 
                    p.created_at, p.updated_at,
                    u.name, u.lastName, u.email
             FROM profiles p
             INNER JOIN users u ON p.user_id = u.id
             WHERE p.artist_name LIKE ?
             ORDER BY p.verified DESC, p.artist_name ASC
             LIMIT ?`,
            [`%${searchTerm}%`, limit]
        );
        return rows;
    }

    async getVerifiedProfiles(limit = 50) {
        const [rows] = await this.db.execute(
            `SELECT p.id, p.user_id, p.artist_name, p.bio, p.avatar_url, p.verified, 
                    p.created_at, p.updated_at,
                    u.name, u.lastName, u.email
             FROM profiles p
             INNER JOIN users u ON p.user_id = u.id
             WHERE p.verified = true
             ORDER BY p.created_at DESC
             LIMIT ?`,
            [limit]
        );
        return rows;
    }

    async existsByArtistName(artistName, excludeId = null) {
        const query = excludeId
            ? 'SELECT COUNT(*) as count FROM profiles WHERE artist_name = ? AND id != ?'
            : 'SELECT COUNT(*) as count FROM profiles WHERE artist_name = ?';

        const params = excludeId ? [artistName, excludeId] : [artistName];

        const [rows] = await this.db.execute(query, params);
        return rows[0].count > 0;
    }
}