import { UnauthorizedException } from "../lib/index.js";

export function permissionGuard(requiredPermissions = []) {
    return (req, res, next) => {
        try {
            if (!req.session || !req.session.user) {
                throw new UnauthorizedException("Session not found, please log in");
            }

            const user = req.session.user;
            if (!user.role || !Array.isArray(user.permissions)) {
                throw new UnauthorizedException("Unauthorized access, no role or permissions found");
            }

            const missingPermission = requiredPermissions.some(
                perm => !user.permissions.includes(perm)
            );

            if (missingPermission) {
                throw new UnauthorizedException("You do not have the required permissions");
            }

            next();
        } catch (error) {
            next(error);
        }
    };
}
