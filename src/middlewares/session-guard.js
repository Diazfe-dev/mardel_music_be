import {UnauthorizedException} from "../lib/exceptions/index.js";

export async function sessionGuard(req, res, next) {
    try {
        if (!req.session || !req.session.user) {
            throw new UnauthorizedException("Session not found, please log in");
        }
        next();
    } catch (error) {
        console.log(error);
        next(error);
    }
}
