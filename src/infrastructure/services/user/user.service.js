import {
    BadRequestException,UnauthorizedException
} from "../../lib/exceptions/index.js";

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
        const profile = await this.profileRepository.findByUserId(userId);
        return {
            user: {
                ...user,
                profile: profile ?? null
            }
        };
    }
}