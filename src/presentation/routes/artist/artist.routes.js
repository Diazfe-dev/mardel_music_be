import Router from 'express'
import {sessionGuard, upload} from "../../../infrastructure/middlewares/index.js";
import {ArtistController} from "../../controllers/artist/artist.controller.js";
import {ArtistService} from "../../../infrastructure/services/artist/artist.service.js";
import {ArtistRepository} from "../../../infrastructure/repositories/index.js";
import mysqlClient from "../../../infrastructure/database/mysql/mysql-client.js";

import {FileService} from "../../../infrastructure/services/file-uploader/file-uploader.service.js";


const artistController = new ArtistController(new ArtistService(new ArtistRepository(mysqlClient)), new FileService());
const artistRouter = new Router();

artistRouter.post('/profile', sessionGuard, async (req, res) => await artistController.createArtistProfile(req, res))
artistRouter.get('/profile', sessionGuard, async (req, res) => await artistController.getArtistProfile(req, res));


export default artistRouter;