import { Router } from 'express'
import authRouter from "./auth/auth.routes.js";
import userRouter from "./user/user.routes.js";

const appRouter = Router()
appRouter.use("/auth", authRouter);
appRouter.use("/user", userRouter);
export default appRouter;
