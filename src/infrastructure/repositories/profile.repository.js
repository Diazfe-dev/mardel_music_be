import { InternalServerErrorException } from "../lib/index.js";

export class ProfileRepository {
    constructor(db) {
        this.db = db;
    }

    async findById(id) {
        try {
            const [rows] = await this.db.execute(
                `SELECT *
                 FROM user_profile_details
                 WHERE user_id = ?`,
                [id]
            );
            return rows[0] ? this.__mapProfileData(rows[0]) : null;
        } catch (err) {
            console.error('Error in findById:', err);
            throw new InternalServerErrorException('Database query failed: ' + err.message);
        }
    }

    async findByUserId(userId) {
        try {
            const [rows] = await this.db.execute(
                `SELECT *
                 FROM user_profile_details
                 WHERE user_id = ?`,
                [userId]
            );
            return rows[0] ? this.__mapProfileData(rows[0]) : null;
        } catch (err) {
            console.error('Error in findByUserId:', err);
            throw new InternalServerErrorException('Database query failed: ' + err.message);
        }
    }

    async findByProfileId(profileId) {
        try {
            const [rows] = await this.db.execute(
                `SELECT *
                 FROM user_profile_details
                 WHERE profile_id = ?`,
                [profileId]
            );
            return rows[0] ? this.__mapProfileData(rows[0]) : null;
        } catch (err) {
            console.error('Error in findByProfileId:', err);
            throw new InternalServerErrorException('Database query failed: ' + err.message);
        }
    }

    async findAllArtists(limit = 50, offset = 0) {
        try {
            const [rows] = await this.db.execute(
                `SELECT *
                 FROM user_profile_details
                 WHERE profile_id IS NOT NULL
                 ORDER BY profile_created_at DESC
                 LIMIT ? OFFSET ?`,
                [limit, offset]
            );
            return rows.map(row => this.__mapProfileData(row));
        } catch (err) {
            console.error('Error in findAllArtists:', err);
            throw new InternalServerErrorException('Database query failed: ' + err.message);
        }
    }

    async searchArtists(searchTerm, limit = 20, offset = 0) {
        try {
            const searchPattern = `%${searchTerm}%`;
            const [rows] = await this.db.execute(
                `SELECT *
                 FROM user_profile_details
                 WHERE profile_id IS NOT NULL 
                 AND (
                     profile_artist_name LIKE ? OR 
                     profile_bio LIKE ? OR 
                     profile_location LIKE ? OR
                     musical_genres LIKE ?
                 )
                 ORDER BY 
                     CASE 
                         WHEN profile_artist_name LIKE ? THEN 1
                         WHEN profile_bio LIKE ? THEN 2
                         WHEN musical_genres LIKE ? THEN 3
                         ELSE 4
                     END,
                     profile_artist_name
                 LIMIT ? OFFSET ?`,
                [
                    searchPattern, searchPattern, searchPattern, searchPattern,
                    searchPattern, searchPattern, searchPattern,
                    limit, offset
                ]
            );
            return rows.map(row => this.__mapProfileData(row));
        } catch (err) {
            console.error('Error in searchArtists:', err);
            throw new InternalServerErrorException('Database query failed: ' + err.message);
        }
    }

    async findArtistsByGenre(genreId, limit = 20, offset = 0) {
        try {
            const [rows] = await this.db.execute(
                `SELECT *
                 FROM user_profile_details
                 WHERE profile_id IS NOT NULL 
                 AND genre_ids_json LIKE ?
                 ORDER BY profile_created_at DESC
                 LIMIT ? OFFSET ?`,
                [`%${genreId}%`, limit, offset]
            );
            return rows.map(row => this.__mapProfileData(row));
        } catch (err) {
            console.error('Error in findArtistsByGenre:', err);
            throw new InternalServerErrorException('Database query failed: ' + err.message);
        }
    }

    async findArtistsByLocation(location, limit = 20, offset = 0) {
        try {
            const locationPattern = `%${location}%`;
            const [rows] = await this.db.execute(
                `SELECT *
                 FROM user_profile_details
                 WHERE profile_id IS NOT NULL 
                 AND profile_location LIKE ?
                 ORDER BY profile_artist_name
                 LIMIT ? OFFSET ?`,
                [locationPattern, limit, offset]
            );
            return rows.map(row => this.__mapProfileData(row));
        } catch (err) {
            console.error('Error in findArtistsByLocation:', err);
            throw new InternalServerErrorException('Database query failed: ' + err.message);
        }
    }

    // Método legacy mantenido para compatibilidad
    async create({ user_id, artist_name, bio, profile_image_url, verified = false }) {
        try {
            // Este método ahora usa el ArtistService internamente para mantener compatibilidad
            console.warn('ProfileRepository.create() is deprecated. Use ArtistService.createProfile() instead.');

            const profileData = {
                userId: user_id,
                name: artist_name,
                bio: bio,
                profileImageUrl: profile_image_url,
                location: null,
                genres: [],
                socialMedia: []
            };

            // Llamar al stored procedure directamente para compatibilidad
            const [result] = await this.db.execute(
                'CALL sp_create_artist_profile(?, ?, ?, ?, ?, ?, ?)',
                [
                    user_id, artist_name, bio, null, profile_image_url,
                    JSON.stringify([]), JSON.stringify([])
                ]
            );

            return this.findByUserId(user_id);
        } catch (err) {
            console.error('Error in create:', err);
            throw new InternalServerErrorException('Profile creation failed: ' + err.message);
        }
    }

    __mapProfileData(row) {
        try {

            const {
                profile_id,
                profile_artist_name,
                profile_bio,
                profile_location,
                profile_image_url,
                profile_verified,
                profile_created_at,
                profile_updated_at,
                musical_genres: musicalGenresJson,
                social_media: socialMediaJson
            } = row;

            if (!profile_id) {
                return null;
            }

            let musical_genres = [];
            let social_media = [];

            try {
                musical_genres = JSON.parse(musicalGenresJson || '[]');
            } catch (e) {
                console.warn('Error parsing musical_genres JSON:', e);
                musical_genres = [];
            }

            try {
                social_media = JSON.parse(socialMediaJson || '[]');
            } catch (e) {
                console.warn('Error parsing social_media JSON:', e);
                social_media = [];
            }

            return {
                profile_id,
                profile_artist_name,
                profile_bio,
                profile_location,
                profile_image_url,
                profile_verified,
                profile_created_at,
                profile_updated_at,
                musical_genres,
                social_media
            };
        } catch (err) {
            console.error('Error mapping profile data:', err);
            throw new InternalServerErrorException('Error processing profile data: ' + err.message);
        }
    }

    async getStats() {
        try {
            const [rows] = await this.db.execute(`
                SELECT 
                    COUNT(DISTINCT user_id) as total_users,
                    COUNT(DISTINCT profile_id) as total_artists,
                    COUNT(DISTINCT CASE WHEN profile_verified = 1 THEN profile_id END) as verified_artists
                FROM user_profile_details
            `);
            return rows[0] || { total_users: 0, total_artists: 0, verified_artists: 0 };
        } catch (err) {
            console.error('Error in getStats:', err);
            throw new InternalServerErrorException('Database query failed: ' + err.message);
        }
    }
}