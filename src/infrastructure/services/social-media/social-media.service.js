import {BadRequestException, InternalServerErrorException} from "../../lib/index.js";

export class SocialMediaService {
    BcryptService

    constructor(socialMediaRepository) {
        this.socialMediaRepository = socialMediaRepository;
    }

    async getSocialMediasWithTypes() {
        return await this.socialMediaRepository.findAll();
    }

    async getAllSocialMediaTypes() {
        return await this.socialMediaRepository.findAllTypes();
    }

    async getAllSocialMediaByType(type) {
        if(!type) throw new BadRequestException("Social media type does not exist");
        const typeExists = await this.socialMediaRepository.findType(type);
        if(!typeExists) throw new BadRequestException("Social media type does not exist");
        return await this.socialMediaRepository.findAllByType(type);
    }

}