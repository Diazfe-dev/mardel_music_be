import cors from 'cors';
import envVars from "../../config/env-vars.js";

const {CORS_WHITELIST, NODE_ENV} = envVars;

const whiteList = new Set(CORS_WHITELIST.split(','));

const corsOptions = {
    optionsSuccessStatus: 200,
    origin: (origin, callback) => {
        // Permitir requests sin origin (como herramientas de testing)
        if (!origin) return callback(null, true);
        
        // En desarrollo, permitir todos los origins de la whitelist
        if (NODE_ENV === 'development' && whiteList.has(origin)) {
            callback(null, true);
        } else if (NODE_ENV === 'development') {
            // En desarrollo, mostrar warning pero permitir
            console.warn(`CORS: Origin ${origin} not in whitelist, but allowing in development mode`);
            callback(null, true);
        } else {
            // En producción, ser más estricto
            if (whiteList.has(origin)) {
                callback(null, true);
            } else {
                callback(new Error(`CORS policy does not allow access from origin ${origin}`));
            }
        }
    },
    credentials: true,
}

export default cors(corsOptions);