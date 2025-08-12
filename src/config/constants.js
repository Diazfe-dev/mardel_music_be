import envVars from "./env-vars.js";

const { API_PREFIX, API_VERSION } = envVars;

const COOKIE_MAX_AGE = 1000 * 60 * 60 * 24;
const API_BASE = `/${API_PREFIX}/${API_VERSION}`;

export default {
    COOKIE_MAX_AGE,
    API_BASE
}