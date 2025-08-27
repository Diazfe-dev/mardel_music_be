import envVars from "../../../config/env-vars.js";
import redis from 'redis';

const { REDIS_URL } = envVars;
const redisClient = redis.createClient({
  url: REDIS_URL,
})

export default redisClient