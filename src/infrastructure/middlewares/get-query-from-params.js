
import { BadRequestException } from "../lib/index.js";

export function getQueryFromParams(queryParam) {
    return (req, res, next) => {
        try {
            const queryParams = req.params[queryParam];
            if (!queryParams) {
                throw new BadRequestException(`Missing required parameter: ${queryParam}`);
            }
            req.query = req.query || {};
            req.query.search = queryParams;
            next();
        } catch (error) {
            next(error);
        }
    }
}