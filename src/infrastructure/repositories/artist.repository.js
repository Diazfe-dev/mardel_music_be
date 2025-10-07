import { InternalServerErrorException } from "../lib/index.js";

export class ArtistRepository {
    constructor(db) {
        this.db = db;
    }

    async createArtistProfile(profileData) {
        try {
            const { userId, name, bio, location, profileImageUrl, genres, socialMedia } = profileData;

            const genresJson = JSON.stringify(genres || []);

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
            return result[0][0];

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
                    profile_id,
                    user_id,
                    artist_name,
                    bio,
                    location,
                    profile_image_url,
                    verified,
                    created_at,
                    updated_at,
                    user_name,
                    user_lastName,
                    user_email,
                    genres,
                    social_media,
                    total_genres,
                    total_social_media
                FROM view_artist_profile_details
                WHERE user_id = ?
            `;

            const [result] = await this.db.execute(query, [userId]);
            if (result.length === 0) {
                return null;
            }

            const profile = result[0];

            if (profile.genres) {
                profile.genres = profile.genres.map(genre => genre).filter(genre => genre !== null);
            } else {
                profile.genres = [];
            }

            if (profile.social_media) {
                profile.social_media = profile.social_media.map(social => social).filter(social => social !== null);
            } else {
                profile.social_media = [];
            }
            return profile;

        } catch (error) {
            throw new InternalServerErrorException(
                'Error retrieving artist profile: ' + error.message
            );
        }
    }

    async getAllArtistProfiles(limit = 20, offset = 0) {
        try {
            const query = `
                SELECT 
                    profile_id,
                    user_id,
                    artist_name,
                    bio,
                    location,
                    profile_image_url,
                    verified,
                    created_at,
                    updated_at,
                    user_name,
                    user_email,
                    genres_list,
                    total_genres,
                    total_social_media,
                    primary_social_media
                FROM view_artist_profiles_list
                LIMIT ? OFFSET ?
            `;

            const [result] = await this.db.execute(query, [limit, offset]);

            // Procesar primary_social_media JSON
            return result.map(profile => ({
                ...profile,
                primary_social_media: profile.primary_social_media ?
                    JSON.parse(profile.primary_social_media) : null
            }));

        } catch (error) {
            console.error('Error getting all artist profiles:', error);
            throw new InternalServerErrorException(
                'Error retrieving artist profiles: ' + error.message
            );
        }
    }

    async searchArtistProfiles(searchTerm, limit = 20, offset = 0) {
        try {
            const query = `
                SELECT 
                    profile_id,
                    user_id,
                    artist_name,
                    bio,
                    location,
                    profile_image_url,
                    verified,
                    created_at,
                    updated_at,
                    user_name,
                    user_email,
                    genres_list,
                    total_genres,
                    total_social_media,
                    primary_social_media
                FROM view_artist_profiles_list
                WHERE 
                    artist_name LIKE ? OR 
                    bio LIKE ? OR 
                    location LIKE ? OR 
                    genres_list LIKE ?
                ORDER BY 
                    CASE 
                        WHEN artist_name LIKE ? THEN 1
                        WHEN bio LIKE ? THEN 2
                        WHEN location LIKE ? THEN 3
                        ELSE 4
                    END,
                    artist_name
                LIMIT ? OFFSET ?
            `;

            const searchPattern = `%${searchTerm}%`;
            const searchPatternStart = `${searchTerm}%`;

            const [result] = await this.db.execute(query, [
                searchPattern,      // artist_name LIKE
                searchPattern,      // bio LIKE
                searchPattern,      // location LIKE
                searchPattern,      // genres_list LIKE
                searchPatternStart, // ORDER BY priority 1
                searchPatternStart, // ORDER BY priority 2
                searchPatternStart, // ORDER BY priority 3
                limit,
                offset
            ]);

            // Procesar primary_social_media JSON
            return result.map(profile => ({
                ...profile,
                primary_social_media: profile.primary_social_media ?
                    JSON.parse(profile.primary_social_media) : null
            }));

        } catch (error) {
            console.error('Error searching artist profiles:', error);
            throw new InternalServerErrorException(
                'Error searching artist profiles: ' + error.message
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