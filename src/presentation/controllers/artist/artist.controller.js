import {InternalServerErrorException} from "../../../infrastructure/lib/index.js";
import {successResponse} from "../../../infrastructure/lib/index.js";

export class ArtistController {
    constructor(artistService, fileService) {
        this.artistService = artistService;
        this.fileService = fileService;
    }

    async createArtistProfile(req, res) {
        try {
            let profileImage = null;
            if (req.headers['content-type']?.includes('multipart/form-data')) {
                profileImage = await this.fileService.saveFile(req, res, 'profile_image');
            }

            const profileData = {
                ...req.body,
                profileImage: profileImage ? profileImage.filename : null,
                profileImageUrl: profileImage ? profileImage.url : null
            };

            const result = await this.artistService.createProfile(profileData);

            return successResponse(res, result, 201);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async getArtistProfile(req, res) {
        try {
            const profile = await this.artistService.getProfile(req.user.id);

            // Generar URL si existe imagen
            if (profile.profileImage) {
                profile.profileImageUrl = this.fileService.generateImageUrl(profile.profileImage);
            }

            return successResponse(res, profile);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }
}