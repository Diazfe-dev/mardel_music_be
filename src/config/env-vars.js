import dotenv from 'dotenv';
dotenv.config();

const envVars = {
    HOST: process.env.HOST || 'localhost',
    PORT: process.env.PORT || 3000,
    CORS_WHITELIST: process.env.CORS_WHITELIST || 'http://localhost:5173',
    API_PREFIX: process.env.API_PREFIX || 'api',
    API_VERSION: process.env.API_VERSION || 'v1',
    NODE_ENV: process.env.NODE_ENV || 'development',
    SESSION_SECRET: process.env.SESSION_SECRET || 'defaultsessionsecret',
    JWT_SECRET: process.env.JWT_SECRET || 'supersecretkey',
    REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
    MYSQL_HOST: process.env.MYSQL_HOST || 'localhost',
    MYSQL_PORT: process.env.MYSQL_PORT || 3306,
    MYSQL_DATABASE: process.env.MYSQL_DATABASE || 'exampledb',
    MYSQL_ROOT_USER: process.env.MYSQL_USER || 'root',
    MYSQL_ROOT_PASSWORD: process.env.MYSQL_ROOT_PASSWORD || 'root',
    MYSQL_USER: process.env.MYSQL_USER || 'user',
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD || 'password',
}

export default envVars