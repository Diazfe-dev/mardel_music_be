import {InternalServerErrorException, BadRequestException} from "../../../infrastructure/lib/index.js";
import {successResponse} from "../../../infrastructure/lib/index.js";

export class UserController {
    constructor(userService, fileService) {
        this.fileService = fileService;
        this.userService = userService;
    }

    async getUserProfile(req, res) {
        try {
            const response = await this.userService.getUserProfile(req.session.user.id);
            return successResponse(res, response, 200);
        } catch (error) {
            console.error('getUserProfile error:', error);
            throw new InternalServerErrorException("Failed to retrieve user profile");
        }
    }

    async saveProfileImage(req, res) {
        try {
            let profileImage = null;
            if (req.headers['content-type']?.includes('multipart/form-data')) {
                profileImage = await this.fileService.saveFile(req, res, 'profile_image');
            }
            if (!profileImage) {
                throw new InternalServerErrorException("Profile image upload failed");
            }
            const result = await this.userService.saveProfileImage(req.session.user.id, profileImage.url);
            return successResponse(res, {result}, 201);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async getArtistsList(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 50;
            const offset = parseInt(req.query.offset) || 0;
            
            const artists = await this.userService.getArtistsList(limit, offset);
            return successResponse(res, { artists, pagination: { limit, offset, count: artists.length } });
        } catch (error) {
            throw new InternalServerErrorException("Failed to retrieve artists list", error);
        }
    }

    async searchArtists(req, res) {
        try {
            const { q: searchTerm } = req.query;
            const limit = parseInt(req.query.limit) || 20;
            const offset = parseInt(req.query.offset) || 0;
            
            if (!searchTerm) {
                throw new BadRequestException("Search term 'q' is required");
            }
            
            const artists = await this.userService.searchArtists(searchTerm, limit, offset);
            return successResponse(res, { 
                artists, 
                search_term: searchTerm,
                pagination: { limit, offset, count: artists.length } 
            });
        } catch (error) {
            throw new InternalServerErrorException("Failed to search artists", error);
        }
    }

    async getArtistsByGenre(req, res) {
        try {
            const { genreId } = req.params;
            const limit = parseInt(req.query.limit) || 20;
            const offset = parseInt(req.query.offset) || 0;
            
            const artists = await this.userService.getArtistsByGenre(genreId, limit, offset);
            return successResponse(res, { 
                artists, 
                genre_id: genreId,
                pagination: { limit, offset, count: artists.length } 
            });
        } catch (error) {
            throw new InternalServerErrorException("Failed to retrieve artists by genre", error);
        }
    }

    async getArtistsByLocation(req, res) {
        try {
            const { location } = req.query;
            const limit = parseInt(req.query.limit) || 20;
            const offset = parseInt(req.query.offset) || 0;
            
            if (!location) {
                throw new BadRequestException("Location parameter is required");
            }
            
            const artists = await this.userService.getArtistsByLocation(location, limit, offset);
            return successResponse(res, { 
                artists, 
                location,
                pagination: { limit, offset, count: artists.length } 
            });
        } catch (error) {
            throw new InternalServerErrorException("Failed to retrieve artists by location", error);
        }
    }

    async getUserStats(req, res) {
        try {
            const stats = await this.userService.getUserStats();
            return successResponse(res, { stats });
        } catch (error) {
            throw new InternalServerErrorException("Failed to retrieve user statistics", error);
        }
    }

    async getPublicUserProfile(req, res) {
        try {
            const { userId } = req.params;
            
            if (!userId) {
                throw new BadRequestException("User ID is required");
            }
            
            const profile = await this.userService.getPublicUserProfile(parseInt(userId));
            
            if (!profile) {
                return successResponse(res, { message: "User not found" }, 404);
            }
            
            return successResponse(res, { user: profile });
        } catch (error) {
            throw new InternalServerErrorException("Failed to retrieve public user profile", error);
        }
    }
}