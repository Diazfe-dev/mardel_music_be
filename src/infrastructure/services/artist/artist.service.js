import { BadRequestException } from "../../lib/index.js";

export class ArtistService {
    constructor(artistRepository, genreRepository) {
        this.artistRepository = artistRepository;
        this.genreRepository = genreRepository;
    }

    async createProfile(profileData) {

        const processedGenres = profileData.genres ? profileData.genres.split(',').map(g => g.trim()) : [];
        
        const processedSocialMedia = this.processSocialMedia(profileData.social_media);

        const processedData = {
            userId: profileData.userId,
            name: profileData.name,
            bio: profileData.bio,
            location: profileData.location,
            profileImageUrl: profileData.profileImageUrl,
            genres: processedGenres,
            socialMedia: processedSocialMedia
        };

        return await this.artistRepository.createArtistProfile(processedData);
    }

    async getProfile(userId) {
        try {
            if (!userId) {
                throw new BadRequestException('User ID is required');
            }
            const profile = await this.artistRepository.getArtistProfile(userId);

            if (!profile) {
                return null;
            }

            return {
                id: profile.id,
                userId: profile.user_id,
                name: profile.artist_name,
                bio: profile.bio,
                location: profile.location,
                profileImageUrl: profile.profile_image_url,
                genres: profile.genres ? profile.genres.split(',') : [],
                socialMedia: profile.social_media ? JSON.parse(profile.social_media) : [],
                verified: profile.verified,
                createdAt: profile.created_at,
                updatedAt: profile.updated_at
            };

        } catch (error) {
            console.error('Error in getProfile service:', error);
            throw error;
        }
    }

    async updateProfile(userId, profileData) {
        try {
            // Validar que el usuario tenga un perfil existente
            const existingProfile = await this.getProfile(userId);
            if (!existingProfile) {
                throw new BadRequestException('Artist profile not found');
            }

            // Procesar géneros musicales
            const processedGenres = profileData.genres ?
                await this.processGenres(profileData.genres) : undefined;

            // Procesar redes sociales
            const processedSocialMedia = profileData.social_media ?
                this.processSocialMedia(profileData.social_media) : undefined;

            const processedData = {
                name: profileData.name,
                bio: profileData.bio,
                location: profileData.location,
                profileImageUrl: profileData.profileImageUrl,
                genres: processedGenres,
                socialMedia: processedSocialMedia
            };

            const result = await this.artistRepository.updateArtistProfile(userId, processedData);

            return {
                success: result.success,
                message: result.message
            };

        } catch (error) {
            console.error('Error in updateProfile service:', error);
            throw error;
        }
    }

    async deleteProfile(userId) {
        try {
            if (!userId) {
                throw new BadRequestException('User ID is required');
            }

            const deleted = await this.artistRepository.deleteArtistProfile(userId);

            if (!deleted) {
                throw new BadRequestException('Artist profile not found');
            }

            return {
                success: true,
                message: 'Artist profile deleted successfully'
            };

        } catch (error) {
            console.error('Error in deleteProfile service:', error);
            throw error;
        }
    }

    processSocialMedia(socialMediaInput) {
        if (!socialMediaInput) return [];

        try {
            // Si es un string, parsearlo como JSON
            if (typeof socialMediaInput === 'string') {
                return JSON.parse(socialMediaInput);
            }

            // Si ya es un array, devolverlo como está
            if (Array.isArray(socialMediaInput)) {
                return socialMediaInput;
            }

            return [];
        } catch (error) {
            console.error('Error processing social media:', error);
            throw new BadRequestException('Invalid social media format');
        }
    }
}