import session from "express-session";
import { RedisStore } from "connect-redis";

import redisClient from "../database/redis/redis-client.js";

import envVars from "../../config/env-vars.js";
import constants  from "../../config/constants.js";

const { SESSION_SECRET, NODE_ENV } = envVars;
const { COOKIE_MAX_AGE } = constants;

export const sessionMiddleware = session({
    store: new RedisStore({client: redisClient}),
    secret: SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    name: "session",
    cookie: {
        secure: NODE_ENV === "production",
        httpOnly: true,
        maxAge: COOKIE_MAX_AGE // 1 day
    }
})