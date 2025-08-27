import {UnauthorizedException} from "../lib/exceptions/index.js";

export function roleGuard(requiredRoles = []) {
    return (req, res, next) => {
        try {
            if (!req.session || !req.session.user) throw new UnauthorizedException("Session not found, please log in")

            const userRole = req.session.user.role;
            if (!userRole) throw new UnauthorizedException("Unauthorized access, no role found");

            const hasRole = requiredRoles.includes(userRole);

            if (!hasRole) throw new UnauthorizedException("You do not have the required role");

            next();
        } catch (error) {
            next(error);
        }
    };
}
