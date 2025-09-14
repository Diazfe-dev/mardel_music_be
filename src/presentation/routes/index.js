import { Router } from 'express'
import authRouter from "./auth/auth.routes.js";
import userRouter from "./user/user.routes.js";
import socialMediaRouter from "./social-media/social-media.routes.js";
import artistRouter from "./artist/artist.routes.js";
import genresRouter from "./genres/genres.routes.js";

const appRouter = Router()
appRouter.use("/auth", authRouter);
appRouter.use("/user", userRouter);
appRouter.use("/artist", artistRouter);
appRouter.use("/social-media", socialMediaRouter);
appRouter.use("/genres", genresRouter);
export default appRouter;
