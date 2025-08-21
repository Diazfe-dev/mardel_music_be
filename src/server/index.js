import express from 'express';
import helmet from "helmet";
import corsMiddleware from "../middlewares/cors-middleware.js";
import {
    sessionMiddleware,
    loggerMiddleware,
    exceptionHandler
} from "../middlewares/index.js";
import appRouter from "../routes/index.js";

import constants from "../config/constants.js";

const {API_BASE} = constants

const app = express();
app.use(helmet())
app.use(corsMiddleware);
app.use(loggerMiddleware)
app.use(sessionMiddleware)
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(API_BASE, appRouter)
app.use(exceptionHandler)


export default app