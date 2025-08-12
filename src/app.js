import app from "./server/index.js";

import envVars from "./config/env-vars.js";
import constants from "./config/constants.js";
const { HOST, PORT } = envVars;
const { API_BASE } = constants;

const url = `http://${HOST}:${PORT}${API_BASE}`;

async function bootstrap() {
    app.listen(PORT,
        () => { console.log(`server running on: ${url}`) });
}

await bootstrap();