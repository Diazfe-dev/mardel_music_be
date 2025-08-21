import app from "./server/index.js";
import envVars from "./config/env-vars.js";
import constants from "./config/constants.js";
import mysqlClient from "./database/mysql/mysql-client.js";
import redisClient from "./database/redis/redis-client.js";

const {HOST, PORT} = envVars;
const {API_BASE} = constants;

async function bootstrap() {

    await mysqlClient.connect();
    await redisClient.connect();

    app.listen(PORT, () => {
        console.log(`server running on: http://${HOST}:${PORT}${API_BASE}`)
    });
}

await bootstrap();