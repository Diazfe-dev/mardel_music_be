import {InternalServerErrorException, BadRequestException} from "../../../infrastructure/lib/index.js";
import {successResponse} from "../../../infrastructure/lib/index.js";

export class ArtistController {
    constructor(artistService, fileService) {
        this.artistService = artistService;
        this.fileService = fileService;
    }

    async createArtistProfile(req, res) {
        try {
            
            let profileImageUrl = null;
            if (req.file) {
                profileImageUrl = `http://localhost:8080/uploads/${req.file.filename}`;
            }
            const profileData = {
                userId: req.session.user.id,
                name: req.body.name,
                bio: req.body.bio,
                location: req.body.location,
                genres: req.body.genres,
                social_media: req.body.social_media,
                profileImageUrl: profileImageUrl || req.body.profileImageUrl
            };
            
            const result = await this.artistService.createProfile(profileData);

            return successResponse(res, result, 201);
        } catch (error) {
            console.error('Error in createArtistProfile controller:', error);
            throw error;
        }
    }

    async getArtistProfile(req, res) {
        try {
            const userId = req.params.userId || req.session.user.id;
            const profile = await this.artistService.getProfile(userId);
            
            if (!profile) {
                return successResponse(res, { message: 'Artist profile not found' }, 404);
            }

            return successResponse(res, profile);
        } catch (error) {
            console.error('Error in getArtistProfile controller:', error);
            throw error;
        }
    }

    async updateArtistProfile(req, res) {
        try {
            console.log('Update request body:', req.body);
            console.log('Update request file:', req.file);
            
            let profileImageUrl = null;
            
            // Si se subió un archivo a través de multer, está en req.file
            if (req.file) {
                profileImageUrl = `http://localhost:8080/uploads/${req.file.filename}`;
            }

            // Preparar datos para actualización
            const profileData = {
                name: req.body.name,
                bio: req.body.bio,
                location: req.body.location,
                genres: req.body.genres,
                social_media: req.body.social_media,
                profileImageUrl: profileImageUrl || req.body.profileImageUrl
            };

            console.log('Profile data to update:', profileData);

            // Filtrar campos undefined/null
            Object.keys(profileData).forEach(key => {
                if (profileData[key] === undefined || profileData[key] === null) {
                    delete profileData[key];
                }
            });

            const result = await this.artistService.updateProfile(req.session.user.id, profileData);

            return successResponse(res, result);
        } catch (error) {
            console.error('Error in updateArtistProfile controller:', error);
            throw error;
        }
    }

    async deleteArtistProfile(req, res) {
        try {
            const result = await this.artistService.deleteProfile(req.session.user.id);
            return successResponse(res, result);
        } catch (error) {
            console.error('Error in deleteArtistProfile controller:', error);
            throw error;
        }
    }

    async getMusicalGenres(req, res) {
        try {
            const genres = await this.artistService.getMusicalGenres();
            return successResponse(res, { genres });
        } catch (error) {
            console.error('Error in getMusicalGenres controller:', error);
            throw error;
        }
    }

    async getProfileByUserId(req, res) {
        try {
            const { userId } = req.params;
            
            if (!userId) {
                throw new BadRequestException('User ID is required');
            }

            const profile = await this.artistService.getProfile(parseInt(userId));
            
            if (!profile) {
                return successResponse(res, { message: 'Artist profile not found' }, 404);
            }

            return successResponse(res, profile);
        } catch (error) {
            console.error('Error in getProfileByUserId controller:', error);
            throw error;
        }
    }
}