import {InternalServerErrorException} from "../../lib/index.js";
import {successResponse} from "../../lib/index.js";

export class UserController {
    constructor(userService) {
        this.userService = userService;
    }

    async getUserProfile(req, res) {
        try {
            const {user} = await this.userService.getUserProfile(req.session.user.id);
            return successResponse(res, {user}, 200);
        } catch (error) {
            throw new InternalServerErrorException("Failed to retrieve user profile", error);
        }
    }
}