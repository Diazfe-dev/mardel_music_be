export class SocialMediaRepository {
    constructor(db) {
        this.db = db;
    }
    async findAllTypes() {
        const [rows] = await this.db.execute(
            'SELECT id, name, description FROM social_media_type ORDER BY name ASC'
        );
        return rows;
    }

    async findTypeById(id) {
        const [rows] = await this.db.execute(
            'SELECT id, name, description FROM social_media_type WHERE id = ?',
            [id]
        );
        return rows[0] ?? null;
    }

    async createType({ name, description }) {
        const [result] = await this.db.execute(
            'INSERT INTO social_media_type (name, description) VALUES (?, ?)',
            [name, description]
        );
        return this.findTypeById(result.insertId);
    }

    async findAll() {
        const [rows] = await this.db.execute(
            `SELECT sm.id, sm.name, sm.description, sm.created_at, sm.updated_at,
                    smt.id as type_id, smt.name as type_name, smt.description as type_description
             FROM social_media sm
             INNER JOIN social_media_type smt ON sm.type_id = smt.id
             ORDER BY smt.name ASC, sm.name ASC`
        );
        return rows;
    }

    async findById(id) {
        const [rows] = await this.db.execute(
            `SELECT sm.id, sm.name, sm.description, sm.created_at, sm.updated_at,
                    smt.id as type_id, smt.name as type_name, smt.description as type_description
             FROM social_media sm
             INNER JOIN social_media_type smt ON sm.type_id = smt.id
             WHERE sm.id = ?`,
            [id]
        );
        return rows[0] ?? null;
    }

    async findByType(typeId) {
        const [rows] = await this.db.execute(
            `SELECT sm.id, sm.name, sm.description, sm.created_at, sm.updated_at,
                    smt.id as type_id, smt.name as type_name
             FROM social_media sm
             INNER JOIN social_media_type smt ON sm.type_id = smt.id
             WHERE sm.type_id = ?
             ORDER BY sm.name ASC`,
            [typeId]
        );
        return rows;
    }

    async create({ name, description, type_id }) {
        const [result] = await this.db.execute(
            'INSERT INTO social_media (name, description, type_id) VALUES (?, ?, ?)',
            [name, description, type_id]
        );
        return this.findById(result.insertId);
    }

    async update(id, { name, description, type_id }) {
        const fields = [];
        const values = [];

        if (name !== undefined) {
            fields.push('name = ?');
            values.push(name);
        }
        if (description !== undefined) {
            fields.push('description = ?');
            values.push(description);
        }
        if (type_id !== undefined) {
            fields.push('type_id = ?');
            values.push(type_id);
        }

        if (fields.length === 0) {
            return this.findById(id);
        }

        values.push(id);

        await this.db.execute(
            `UPDATE social_media SET ${fields.join(', ')} WHERE id = ?`,
            values
        );
        return this.findById(id);
    }

    async delete(id) {
        await this.db.execute('DELETE FROM social_media WHERE id = ?', [id]);
        return { message: 'Social media platform deleted successfully' };
    }

    // Métodos para asociaciones con perfiles
    async addToProfile(profileId, socialMediaId, uri) {
        const [result] = await this.db.execute(
            'INSERT INTO social_media_profile (profile_id, social_media_id, uri) VALUES (?, ?, ?)',
            [profileId, socialMediaId, uri]
        );
        return result.insertId;
    }

    async updateProfileAssociation(profileId, socialMediaId, uri) {
        await this.db.execute(
            'UPDATE social_media_profile SET uri = ? WHERE profile_id = ? AND social_media_id = ?',
            [uri, profileId, socialMediaId]
        );
        return true;
    }

    async removeFromProfile(profileId, socialMediaId) {
        await this.db.execute(
            'DELETE FROM social_media_profile WHERE profile_id = ? AND social_media_id = ?',
            [profileId, socialMediaId]
        );
        return { message: 'Social media removed from profile successfully' };
    }

    async findByProfileId(profileId) {
        const [rows] = await this.db.execute(
            `SELECT sm.id, sm.name, sm.description, 
                    smt.name as type, smt.description as type_description,
                    smp.uri, smp.created_at as associated_at
             FROM social_media_profile smp
             INNER JOIN social_media sm ON smp.social_media_id = sm.id
             INNER JOIN social_media_type smt ON sm.type_id = smt.id
             WHERE smp.profile_id = ?
             ORDER BY smt.name ASC, sm.name ASC`,
            [profileId]
        );
        return rows;
    }

    async findProfileAssociation(profileId, socialMediaId) {
        const [rows] = await this.db.execute(
            `SELECT smp.id, smp.uri, smp.created_at, smp.updated_at,
                    sm.name as social_media_name, sm.description as social_media_description
             FROM social_media_profile smp
             INNER JOIN social_media sm ON smp.social_media_id = sm.id
             WHERE smp.profile_id = ? AND smp.social_media_id = ?`,
            [profileId, socialMediaId]
        );
        return rows[0] ?? null;
    }

    async getMostUsedPlatforms(limit = 10) {
        const [rows] = await this.db.execute(
            `SELECT sm.id, sm.name, sm.description, 
                    smt.name as type, COUNT(smp.id) as usage_count
             FROM social_media sm
             INNER JOIN social_media_type smt ON sm.type_id = smt.id
             LEFT JOIN social_media_profile smp ON sm.id = smp.social_media_id
             GROUP BY sm.id, sm.name, sm.description, smt.name
             ORDER BY usage_count DESC, sm.name ASC
             LIMIT ?`,
            [limit]
        );
        return rows;
    }

    async getProfilesByPlatform(socialMediaId) {
        const [rows] = await this.db.execute(
            `SELECT p.id, p.artist_name, p.avatar_url, p.verified, smp.uri
             FROM social_media_profile smp
             INNER JOIN profiles p ON smp.profile_id = p.id
             WHERE smp.social_media_id = ?
             ORDER BY p.verified DESC, p.artist_name ASC`,
            [socialMediaId]
        );
        return rows;
    }
}