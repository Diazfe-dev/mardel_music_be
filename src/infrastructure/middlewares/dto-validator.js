import {BadRequestException} from "../lib/exceptions/index.js";

export function validateDto(DtoClass) {
    return (req, res, next) => {
        try {
            const dtoInstance = new DtoClass(req.body);
            const errors = dtoInstance.validate();
            if (errors.length > 0) {
                throw new BadRequestException(errors.join(", "));
            }
            req.body.dto = dtoInstance.serialize();
            next();
        } catch (error) {
            next(error);
        }
    }
}

export function validateDtoFromParams(DtoClass, param) {
    return (req, res, next) => {
        try {
            const dtoInstance = new DtoClass(req.params[param]);
            const errors = dtoInstance.validate();
            if (errors.length > 0) {
                throw new BadRequestException(errors.join(", "));
            }

            req.params.dto = dtoInstance.serialize();
            next();
        } catch
            (error) {
            next(error);
        }
    }
}