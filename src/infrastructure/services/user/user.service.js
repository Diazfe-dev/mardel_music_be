import { BadRequestException, UnauthorizedException } from "../../lib/index.js";

export class UserService {
    constructor(userRepository, profileRepository) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
    }

    async getUserProfile(userId) {
        if (!userId) {
            throw new BadRequestException("User ID is required");
        }

        const user = await this.userRepository.findById(userId);
        delete user.password;

        if (!user) throw new UnauthorizedException("User not found");

        const profileData = await this.profileRepository.findByUserId(userId);

        if (!profileData) {
            return {
                ...user,
                profile: null
            };
        }

        return {
            ...user,
            profile: {
                ...profileData
            }
        }

    }

    async saveProfileImage(userId, imageUrl) {
        if (!userId) {
            throw new BadRequestException("User ID is required");
        }
        if (!imageUrl) {
            throw new BadRequestException("Profile image is required");
        }

        return await this.userRepository.updateProfileImage(userId, imageUrl);
    }

    async getArtistsList(limit = 50, offset = 0) {
        return await this.profileRepository.findAllArtists(limit, offset);
    }

    async searchArtists(searchTerm, limit = 20, offset = 0) {
        if (!searchTerm || searchTerm.trim().length === 0) {
            throw new BadRequestException("Search term is required");
        }
        return await this.profileRepository.searchArtists(searchTerm.trim(), limit, offset);
    }

    async getArtistsByGenre(genreId, limit = 20, offset = 0) {
        if (!genreId) {
            throw new BadRequestException("Genre ID is required");
        }
        return await this.profileRepository.findArtistsByGenre(genreId, limit, offset);
    }

    async getArtistsByLocation(location, limit = 20, offset = 0) {
        if (!location || location.trim().length === 0) {
            throw new BadRequestException("Location is required");
        }
        return await this.profileRepository.findArtistsByLocation(location.trim(), limit, offset);
    }

    async getUserStats() {
        return await this.profileRepository.getStats();
    }

    async getPublicUserProfile(userId) {
        if (!userId) {
            throw new BadRequestException("User ID is required");
        }

        const profileData = await this.profileRepository.findByUserId(userId);

        if (!profileData) {
            return null;
        }

        // Retornar solo información pública (sin datos sensibles)
        const response = {
            user: {
                id: profileData.user_id,
                name: profileData.user_name,
                lastName: profileData.user_last_name,
                role: profileData.user_role,
                profile: null
            }
        };

        // Solo agregar perfil de artista si existe
        if (profileData.has_artist_profile) {
            response.user.profile = {
                id: profileData.profile_id,
                artist_name: profileData.profile_artist_name,
                bio: profileData.profile_bio,
                location: profileData.profile_location,
                profile_image_url: profileData.profile_image_url,
                verified: profileData.profile_verified,
                musical_genres: profileData.musical_genres,
                social_media: profileData.social_media,
                created_at: profileData.profile_created_at
            };
        }

        return response;
    }
}