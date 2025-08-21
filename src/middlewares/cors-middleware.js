import cors from 'cors';
import envVars from "../config/env-vars.js";

const {CORS_WHITELIST} = envVars;

const whiteList = new Set(CORS_WHITELIST.split(','));

const corsOptions = {
    optionsSuccessStatus: 200,
    origin: (origin, callback) => {
        if (whiteList.has(origin)) {
            callback(null, true);
        } else {
            throw new Error(`CORS policy does not allow access from origin ${origin}`);
        }
    },
    credentials: true,
}

export default cors(corsOptions);