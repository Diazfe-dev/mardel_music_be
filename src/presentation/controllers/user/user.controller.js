import {InternalServerErrorException} from "../../../infrastructure/lib/index.js";
import {successResponse} from "../../../infrastructure/lib/index.js";

export class UserController {
    constructor(userService, fileService) {
        this.fileService = fileService;
        this.userService = userService;
    }

    async getUserProfile(req, res) {
        try {
            const {user} = await this.userService.getUserProfile(req.session.user.id);
            return successResponse(res, {user}, 200);
        } catch (error) {
            throw new InternalServerErrorException("Failed to retrieve user artist", error);
        }
    }

    async saveProfileImage(req, res) {
        try {
            let profileImage = null;
            if (req.headers['content-type']?.includes('multipart/form-data')) profileImage = await this.fileService.saveFile(req, res, 'profile_image');
            if (!profileImage) throw new InternalServerErrorException("Profile image upload failed");
            const result = this.userService.saveProfileImage(req.session.user.id, profileImage.url);
            return successResponse(res, {result}, 201);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }
}