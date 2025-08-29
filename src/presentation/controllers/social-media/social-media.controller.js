import {InternalServerErrorException} from "../../../infrastructure/lib/index.js";
import {successResponse} from "../../../infrastructure/lib/index.js";

export class SocialMediaController {
    constructor(socialMediaService) {
        this.socialMediaService = socialMediaService;
    }

    async getSocialMediasWithTypes(req, res) {
        try {
            const socialMedias = await this.socialMediaService.getSocialMediasWithTypes();
            return successResponse(res, {socialMedias}, 200);
        } catch (error) {
            throw new InternalServerErrorException("Failed to fetch social media types");
        }
    }

    async getAllSocialMediaTypes(req, res) {
        try {
            const socialMedias = await this.socialMediaService.getAllSocialMediaTypes();
            return successResponse(res, {socialMedias}, 200);
        } catch (error) {
            throw new InternalServerErrorException("Failed to fetch social media types");
        }
    }

    async getAllSocialMediaByType(req, res) {
        try {
            const {type} = req.params.dto
            const socialMedias = await this.socialMediaService.getAllSocialMediaByType(type);
            return successResponse(res, {socialMedias}, 200);
        } catch (error) {
            throw new InternalServerErrorException("Failed to fetch social media types");
        }
    }

}