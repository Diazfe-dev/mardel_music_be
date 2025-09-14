import { InternalServerErrorException } from "../../../infrastructure/lib/index.js";
import { successResponse } from "../../../infrastructure/lib/index.js";

export class GenresController {
    constructor(genresService) {
        this.genresService = genresService;
    }

    async getAllGenres(req, res) {
        try {
            const genres = await this.genresService.getAllGenres();
            return successResponse(res, { genres }, 200);
        } catch (error) {
            throw new InternalServerErrorException("Failed to fetch genres", error);
        }
    }

    async searchGenres(req, res) {
        try {
            const searchQuery = req.query.query;
            const genres = await this.genresService.getGenresByQuery(searchQuery);
            return successResponse(res, { genres }, 200);
        } catch (error) {
            throw new InternalServerErrorException("Failed to search genres", error);
        }
    }

    async addGenre(req, res) {
        try {
            const { name, description } = req.body;
            const newGenre = await this.genresService.addGenre(name, description);
            return successResponse(res, { genre: newGenre }, 201);
        } catch (error) {
            throw new InternalServerErrorException("Failed to add genre", error);
        }
    }

    async deactivateGenre(req, res) {
        try {
            const { genreId } = req.params;
            await this.genresService.deactivateGenre(genreId);
            return successResponse(res, { message: "Genre deactivated successfully" }, 200);
        } catch (error) {
            throw new InternalServerErrorException("Failed to deactivate genre", error);
        }
    }

    async reactivateGenre(req, res) {
        try {
            const { genreId } = req.params;
            await this.genresService.reactivateGenre(genreId);
            return successResponse(res, { message: "Genre reactivated successfully" }, 200);
        } catch (error) {
            throw new InternalServerErrorException("Failed to reactivate genre", error);
        }
    }

}