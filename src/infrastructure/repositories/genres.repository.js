import { InternalServerErrorException } from "../lib/index.js";
import { GenreDto } from "../../domain/models/dto/genres/genre.dto.js";

export class GenreRepository {
    constructor(db) {
        this.db = db;
    }

    async getAllGenres() {
        try {
            const [rows] = await this.db.execute(
                `SELECT id, name, description 
                FROM musical_genres 
                WHERE is_active = TRUE 
                ORDER BY name ASC`
            );
            if (rows) {
                return rows.map(this.mapToDto)
            }
            return null;

        } catch (error) {
            console.error('Error getting musical genres:', error);
            throw new InternalServerErrorException(
                'Error retrieving musical genres: ' + error.message
            );
        }
    }

    async getGenresByQuery(searchQuery) {
        try {

            const [rows] = await this.db.execute(`
                SELECT id, name, description 
                FROM musical_genres 
                WHERE is_active = TRUE AND name LIKE ? 
                ORDER BY name ASC
            `, [`%${searchQuery}%`]);
            if (rows) {
                return rows.map(this.mapToDto)
            }
            return null;
        } catch (error) {
            console.error('Error searching musical genres:', error);
            throw new InternalServerErrorException(
                'Error searching musical genres: ' + error.message
            );
        }
    }

    async createMusicalGenre(name, description) {
        try {
            const query = `
                INSERT INTO musical_genres (name, description, is_active, created_at, updated_at)
                VALUES (?, ?, TRUE, NOW(), NOW())
            `;

            const result = await this.db.query(query, [name, description]);
            return result.insertId;

        } catch (error) {
            console.error('Error creating musical genre:', error);
            throw new InternalServerErrorException(
                'Error creating musical genre: ' + error.message
            );
        }
    }

    async deactivateMusicalGenre(genreId) {
        try {
            const query = `
                UPDATE musical_genres 
                SET is_active = FALSE, updated_at = NOW() 
                WHERE id = ?
            `;

            const result = await this.db.query(query, [genreId]);
            return result.affectedRows > 0;

        } catch (error) {
            console.error('Error deactivating musical genre:', error);
            throw new InternalServerErrorException(
                'Error deactivating musical genre: ' + error.message
            );
        }
    }

    async reactivateMusicalGenre(genreId) {
        try {
            const query = `
                UPDATE musical_genres 
                SET is_active = TRUE, updated_at = NOW() 
                WHERE id = ?
            `;

            const result = await this.db.query(query, [genreId]);
            return result.affectedRows > 0;

        } catch (error) {
            console.error('Error reactivating musical genre:', error);
            throw new InternalServerErrorException(
                'Error reactivating musical genre: ' + error.message
            );
        }
    }

    mapToDto(row) {
        return new GenreDto(row).serialize();
    }
}