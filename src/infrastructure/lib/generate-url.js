import envVars from "../../config/env-vars.js";

export function generateImageUrl(filename) {
    return `${envVars.BASE_URL}/uploads/${filename}`;
}
