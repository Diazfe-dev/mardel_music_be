export class SocialMediaService {BcryptService
    constructor(socialMediaRepository) {
        this.socialMediaRepository = socialMediaRepository;
    }

    async getSocialMediasWithTypes() {
        return await this.socialMediaRepository.findAll();
    }

    async getAllSocialMediaTypes() {
        return await this.socialMediaRepository.findAllTypes();
    }

}