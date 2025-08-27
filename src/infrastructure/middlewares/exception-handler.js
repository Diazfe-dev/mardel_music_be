import { BaseException } from "../lib/exceptions/index.js";

import envVars from "../../config/env-vars.js";
const { NODE_ENV } = envVars;

export function exceptionHandler(err,req,res,next){
    if(err instanceof BaseException){
        return res.status(err.statusCode).json({
            name: err.name,
            status: err.statusCode,
            message: err.message,
            success: false,
            stack: NODE_ENV === 'development' ? err.stack : undefined
        });
    }

    return res.status(500).json({
        name: "Unhandled server error",
        status: 500,
        message: 'An unexpected error occurred',
        success: false,
        stack: NODE_ENV === 'development' ? err.stack : undefined
    });
}