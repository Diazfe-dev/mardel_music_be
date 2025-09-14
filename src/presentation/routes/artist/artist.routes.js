import Router from 'express'

import { GenreRepository, ArtistRepository } from "../../../infrastructure/repositories/index.js";
import { ArtistController } from "../../controllers/artist/artist.controller.js";
import { ArtistService } from "../../../infrastructure/services/artist/artist.service.js";
import { FileService } from "../../../infrastructure/services/file-uploader/file-uploader.service.js";

import mysqlClient from "../../../infrastructure/database/mysql/mysql-client.js";

import { sessionGuard, upload, validateDtoFromFormData } from "../../../infrastructure/middlewares/index.js";
import { CreateArtistProfileDto, UpdateArtistProfileDto } from "../../../domain/models/dto/artist/artist-profile.dto.js";

const genreRepository = new GenreRepository(mysqlClient);
const artistRepository = new ArtistRepository(mysqlClient);
const artistService = new ArtistService(artistRepository, genreRepository);
const fileService = new FileService();
const artistController = new ArtistController(artistService, fileService);

const artistRouter = new Router();

artistRouter.get('/profile', sessionGuard, async (req, res) =>
    await artistController.getArtistProfile(req, res)
);

artistRouter.post('/profile',
    sessionGuard, upload.single('profile_image'), validateDtoFromFormData(CreateArtistProfileDto),
    async (req, res) => await artistController.createArtistProfile(req, res)
);
artistRouter.put('/profile', sessionGuard, upload.single('profile_image'), validateDtoFromFormData(UpdateArtistProfileDto),
    async (req, res) => await artistController.updateArtistProfile(req, res)
);

artistRouter.delete('/profile', sessionGuard, async (req, res) =>
    await artistController.deleteArtistProfile(req, res)
);

artistRouter.get('/profile/:userId', async (req, res) =>
    await artistController.getProfileByUserId(req, res)
);

artistRouter.get('/genres', async (req, res) =>
    await artistController.getMusicalGenres(req, res)
);

export default artistRouter;