import Router from 'express'
import {sessionGuard} from "../../../infrastructure/middlewares/index.js";
import mysqlClient from "../../../infrastructure/database/mysql/mysql-client.js";
import {SocialMediaRepository} from "../../../infrastructure/repositories/social-media.repository.js";
import {SocialMediaService} from "../../../infrastructure/services/social-media/social-media.service.js";
import {SocialMediaController} from "../../controllers/social-media/social-media.controller.js";

const socialMediaRouter = new Router();
const socialMediaRepository = new SocialMediaRepository(mysqlClient);
const socialMediaService = new SocialMediaService(socialMediaRepository);
const socialMediaController = new SocialMediaController(socialMediaService);

socialMediaRouter.get('/all',
    sessionGuard,
    async (req, res) => await socialMediaController.getSocialMediasWithTypes(req, res)
);

socialMediaRouter.get('/all/types',
    sessionGuard,
    async (req, res) => await socialMediaController.getAllSocialMediaTypes(req, res)
);

socialMediaRouter.get('/types/:type', (req, res) => {
    console.log(req.params.type);

    res.json({message: `Get social media by type: ${req.params.type}`});
})

export default socialMediaRouter;