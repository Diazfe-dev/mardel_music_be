import Router from 'express'
import mysqlClient from "../../../infrastructure/database/mysql/mysql-client.js";
import { getQueryFromParams, sessionGuard } from "../../../infrastructure/middlewares/index.js";

import { GenreRepository } from "../../../infrastructure/repositories/index.js";
import { GenresService } from "../../../infrastructure/services/genres/genres.service.js";
import { GenresController } from "../../controllers/genres/genres.controller.js";

const genresRouter = new Router();
const genresRepository = new GenreRepository(mysqlClient);
const genresService = new GenresService(genresRepository);
const genresController = new GenresController(genresService);

genresRouter.get('/all',
    sessionGuard,
    async (req, res) => await genresController.getAllGenres(req, res)
);

genresRouter.get('/search',
    sessionGuard,
    async (req, res) => await genresController.searchGenres(req, res)
);

export default genresRouter;