import express from 'express';
import cors from "cors";
import helmet from "helmet";

import {sessionMiddleware, loggerMiddleware, exceptionHandler} from "../middlewares/index.js";
import appRouter from "../routes/index.js";

import envVars from "../config/env-vars.js";
import constants from "../config/constants.js";

const {PORT} = envVars;
const {API_BASE} = constants

const app = express();

app.set("port", PORT);

app
    .use(express.urlencoded({extended: true}))
    .use(express.json())
    .use(cors())
    .use(helmet())
    .use(API_BASE, appRouter)
    .use(loggerMiddleware)
    .use(sessionMiddleware)
    .use(exceptionHandler)

export default app