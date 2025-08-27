import { Router } from 'express'
import authRouter from "./auth/auth.routes.js";
import userRouter from "./user/user.routes.js";
import profileRouter from "./profile/profile.routes.js";
import socialMediaRouter from "./social-media/social-media.routes.js";

const appRouter = Router()
appRouter.use("/auth", authRouter);
appRouter.use("/user", userRouter);
appRouter.use("/artist", profileRouter);
appRouter.use("/social-media", socialMediaRouter);

export default appRouter;
