import { Router } from 'express'
import authRouter from "./auth/index.js";

const appRouter = Router()

appRouter.use("/auth", authRouter)

export default appRouter;
