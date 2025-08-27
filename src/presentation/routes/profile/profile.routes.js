import Router from 'express'
import {sessionGuard} from "../../../infrastructure/middlewares/index.js";

const profileRouter = new Router();

profileRouter.post('/profile',
    sessionGuard,
    async (req, res) => {
    console.log(req.body);
})

export default profileRouter;