import Router from 'express'
import {
    sessionGuard,
    validateDto,
    validateDtoFromParams,
} from "../../../infrastructure/middlewares/index.js";
import mysqlClient from "../../../infrastructure/database/mysql/mysql-client.js";
import {SocialMediaRepository} from "../../../infrastructure/repositories/social-media.repository.js";
import {SocialMediaService} from "../../../infrastructure/services/social-media/social-media.service.js";
import {SocialMediaController} from "../../controllers/social-media/social-media.controller.js";
import {SocialMediaTypeDto} from "../../../domain/models/dto/index.js";

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

socialMediaRouter.get('/all/types/:type',
    sessionGuard,
    validateDtoFromParams(SocialMediaTypeDto, "type"),
    async (req, res) => await socialMediaController.getAllSocialMediaByType(req, res))

export default socialMediaRouter;