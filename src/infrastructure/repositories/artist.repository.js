import {InternalServerErrorException} from "../lib/index.js";

export class ArtistRepository {
    constructor(db) {
        this.db = db;
    }

    async createArtistProfile(profileData) {
        try {
            const { userId, name, bio, location, profileImageUrl, genres, socialMedia } = profileData;
            
            // Preparar géneros como array JSON
            const genresJson = JSON.stringify(genres || []);
            
            // Preparar redes sociales como array JSON
            const socialMediaJson = JSON.stringify(socialMedia || []);

            const query = `
                CALL sp_create_artist_profile(?, ?, ?, ?, ?, ?, ?)
            `;
            
            const params = [
                userId,
                name,
                bio,
                location,
                profileImageUrl,
                genresJson,
                socialMediaJson
            ];

            const result = await this.db.query(query, params);
            return result[0][0]; // Retorna el primer resultado del stored procedure
            
        } catch (error) {
            console.error('Error creating artist profile:', error);
            throw new InternalServerErrorException(
                'Error creating artist profile: ' + error.message
            );
        }
    }

    async getArtistProfile(userId) {
        try {
            const query = `
                SELECT 
                    p.id,
                    p.user_id,
                    p.artist_name,
                    p.bio,
                    p.location,
                    p.profile_image_url,
                    p.verified,
                    p.created_at,
                    p.updated_at,
                    GROUP_CONCAT(DISTINCT mg.name) as genres,
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'social_media_id', smp.social_media_id,
                            'platform_name', sm.name,
                            'url', smp.uri
                        )
                    ) as social_media
                FROM profiles p
                LEFT JOIN profile_genres pg ON p.id = pg.profile_id
                LEFT JOIN musical_genres mg ON pg.genre_id = mg.id AND mg.is_active = TRUE
                LEFT JOIN social_media_profile smp ON p.id = smp.profile_id
                LEFT JOIN social_media sm ON smp.social_media_id = sm.id AND sm.is_active = TRUE
                WHERE p.user_id = ?
                GROUP BY p.id
            `;

            const result = await this.db.query(query, [userId]);
            return result[0] || null;
            
        } catch (error) {
            console.error('Error getting artist profile:', error);
            throw new InternalServerErrorException(
                'Error retrieving artist profile: ' + error.message
            );
        }
    }

    async updateArtistProfile(userId, profileData) {
        try {
            const { name, bio, location, profileImageUrl, genres, socialMedia } = profileData;
            
            // Iniciar transacción
            await this.db.beginTransaction();

            // Actualizar datos básicos del perfil
            const updateProfileQuery = `
                UPDATE profiles 
                SET 
                    artist_name = ?,
                    bio = ?,
                    location = ?,
                    profile_image_url = ?,
                    updated_at = NOW()
                WHERE user_id = ?
            `;
            
            await this.db.query(updateProfileQuery, [name, bio, location, profileImageUrl, userId]);
            
            // Obtener el profile_id
            const getProfileIdQuery = `SELECT id FROM profiles WHERE user_id = ?`;
            const profileResult = await this.db.query(getProfileIdQuery, [userId]);
            const profileId = profileResult[0]?.id;

            if (!profileId) {
                throw new Error('Profile not found');
            }

            // Actualizar géneros si se proporcionan
            if (genres && genres.length > 0) {
                // Eliminar géneros existentes
                await this.db.query('DELETE FROM profile_genres WHERE profile_id = ?', [profileId]);
                
                // Insertar nuevos géneros
                for (const genreId of genres) {
                    await this.db.query(
                        'INSERT INTO profile_genres (profile_id, genre_id, created_at) VALUES (?, ?, NOW())',
                        [profileId, genreId]
                    );
                }
            }

            // Actualizar redes sociales si se proporcionan
            if (socialMedia && socialMedia.length > 0) {
                // Eliminar redes sociales existentes
                await this.db.query('DELETE FROM social_media_profile WHERE profile_id = ?', [profileId]);
                
                // Insertar nuevas redes sociales
                for (const social of socialMedia) {
                    await this.db.query(
                        'INSERT INTO social_media_profile (profile_id, social_media_id, uri, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
                        [profileId, social.social_media_id, social.url]
                    );
                }
            }

            await this.db.commit();
            return { success: true, message: 'Profile updated successfully' };
            
        } catch (error) {
            await this.db.rollback();
            console.error('Error updating artist profile:', error);
            throw new InternalServerErrorException(
                'Error updating artist profile: ' + error.message
            );
        }
    }

    async deleteArtistProfile(userId) {
        try {
            const query = `DELETE FROM profiles WHERE user_id = ?`;
            const result = await this.db.query(query, [userId]);
            
            return result.affectedRows > 0;
            
        } catch (error) {
            console.error('Error deleting artist profile:', error);
            throw new InternalServerErrorException(
                'Error deleting artist profile: ' + error.message
            );
        }
    }
}