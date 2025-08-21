import {InternalServerErrorException} from "../../lib/index.js";
import {successResponse} from "../../lib/index.js";

export class AuthController {
    constructor(authService) {
        this.authService = authService;
    }

    async login(req, res) {
        const {user} = await this.authService.validateLoginCredentials(req.body.dto);
        req.session.user = user;
        return successResponse(res, {user}, 200);
    }

    async register(req, res) {
        const {user} = await this.authService.registerUser(req.body.dto);
        req.session.user = user;
        return successResponse(res, {user}, 201);
    }

    async logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                throw new InternalServerErrorException("Failed to log out", err);
            }
            return successResponse(res, {}, 200, null, "Logged out successfully");
        });
    }
}