import {SocialMediaDto} from '../../domain/models/dto/social-media/social-media.js';
export class SocialMediaRepository {
    constructor(db) {
        this.db = db;
    }

    // Get all social media types
    async findAllTypes() {
        const [rows] = await this.db.execute(
            'SELECT id, name, description FROM social_media_type ORDER BY name ASC'
        );
        return rows;
    }
    // Get social media type by name
    async findType(name) {
        const [rows] = await this.db.execute(
            'SELECT id, name, description FROM social_media_type WHERE name = ?',
            [name]
        );
        return rows[0] ?? null;
    }

    // Get all social media by type name
    async findAllByType(type) {
        const [rows] = await this.db.execute(
            `SELECT *
             FROM social_media_type_by_name
             WHERE social_media_type_name = ?`,
            [type]
        );
        if (rows) {
            return rows.map(this.mapToDto)
        }
        return null;
    }

    // Get all social media with their types
    async findAll() {
        const [rows] = await this.db.execute(
            `SELECT sm.id AS social_media_id,
                    sm.name AS social_media_name,
                    sm.description AS social_media_description,
                    smt.id          as social_media_type_id,
                    smt.name        as social_media_type_name,
                    smt.description as social_media_type_description
             FROM social_media sm
                      INNER JOIN social_media_type smt ON sm.type_id = smt.id
             ORDER BY smt.name ASC, sm.name ASC`
        );
        if (rows) {
            return rows.map(this.mapToDto)
        }
        return null;
    }

    // Map database row to DTO
    mapToDto(row) {
        return new SocialMediaDto(row).serialize();
    }
}