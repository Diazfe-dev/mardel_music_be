import {BadRequestException, InternalServerErrorException} from "../../lib/index.js";

export class GenresService {
    constructor(genresRepository) {
        this.genresRepository = genresRepository;
    }

    async getAllGenres() {
        return await this.genresRepository.getAllGenres();
    }

    async getGenresByQuery(searchQuery) {
        if (!searchQuery || searchQuery.trim().length === 0) {
            throw new BadRequestException("Search query is required");
        }
        return await this.genresRepository.getGenresByQuery(searchQuery.trim());
    }

    async addGenre(name, description) {
        if (!name || name.trim().length === 0) {
            throw new BadRequestException("Genre name is required");
        }
        return await this.genresRepository.create(name.trim(), description?.trim() || null);
    }

    async deactivateGenre(genreId) {
        if (!genreId) {
            throw new BadRequestException("Genre ID is required");
        }
        return await this.genresRepository.deactivate(genreId);
    }

    async reactivateGenre(genreId) {
        if (!genreId) {
            throw new BadRequestException("Genre ID is required");
        }
        return await this.genresRepository.activate(genreId);
    }

}