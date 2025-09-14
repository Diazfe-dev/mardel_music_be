import { BaseDto } from "../base-dto/index.js";
export class CreateArtistProfileDto extends BaseDto {
    constructor(data) {
        super();
        this.name = data.name;
        this.bio = data.bio;
        this.location = data.location;
        this.genres = data.genres;
        this.social_media = data.social_media;
        this.profileImageUrl = data.profileImageUrl;
    }

    validate() {
        const errors = [];
        if (!this.name || typeof this.name !== 'string' || this.name.trim().length === 0) {
            errors.push('Name is required and must be a non-empty string');
        }

        // Validar longitud del nombre
        if (this.name && this.name.length > 255) {
            errors.push('Name must be less than 255 characters');
        }

        // Validar bio requerida
        if (!this.bio || typeof this.bio !== 'string' || this.bio.trim().length === 0) {
            errors.push('Bio is required and must be a non-empty string');
        }

        // Validar longitud de bio
        if (this.bio && this.bio.length > 1000) {
            errors.push('Bio must be less than 1000 characters');
        }

        // Validar location (opcional)
        if (this.location && typeof this.location !== 'string') {
            errors.push('Location must be a string');
        }

        if (this.location && this.location.length > 255) {
            errors.push('Location must be less than 255 characters');
        }

        // Validar géneros (opcional)
        if (this.genres) {
            console.log("Validating genres:", this.genres.split(','));
            if (typeof this.genres === 'string') {
                try {
                    JSON.parse(this.genres);
                } catch (e) {
                    // Si no es JSON, verificar que sea CSV válido
                    if (!this.genres.match(/^[a-zA-Z\s,]+$/)) {
                        errors.push('Genres must be a valid JSON array or comma-separated string');
                    }
                }
            } else if (!Array.isArray(this.genres)) {
                errors.push('Genres must be an array or string');
            }
        }

        // Validar redes sociales (opcional)
        if (this.social_media) {
            if (typeof this.social_media === 'string') {
                try {
                    const parsed = JSON.parse(this.social_media);
                    if (!Array.isArray(parsed)) {
                        errors.push('Social media must be an array');
                    }
                } catch (e) {
                    errors.push('Social media must be valid JSON');
                }
            } else if (!Array.isArray(this.social_media)) {
                errors.push('Social media must be an array');
            }
        }

        // Validar URL de imagen de perfil (opcional)
        if (this.profileImageUrl && typeof this.profileImageUrl !== 'string') {
            errors.push('Profile image URL must be a string');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    serialize() {
        return {
            name: this.name,
            bio: this.bio,
            location: this.location,
            genres: this.genres,
            social_media: this.social_media,
            profileImageUrl: this.profileImageUrl
        };
    }
}

export class UpdateArtistProfileDto extends BaseDto {
    constructor(data) {
        if (data.name !== undefined) this.name = data.name;
        if (data.bio !== undefined) this.bio = data.bio;
        if (data.location !== undefined) this.location = data.location;
        if (data.genres !== undefined) this.genres = data.genres;
        if (data.social_media !== undefined) this.social_media = data.social_media;
        if (data.profileImageUrl !== undefined) this.profileImageUrl = data.profileImageUrl;
    }

    validate() {
        const errors = [];
        if (this.name !== undefined) {
            if (typeof this.name !== 'string' || this.name.trim().length === 0) {
                errors.push('Name must be a non-empty string');
            }
            if (this.name && this.name.length > 255) {
                errors.push('Name must be less than 255 characters');
            }
        }

        // Validar bio
        if (this.bio !== undefined) {
            if (typeof this.bio !== 'string' || this.bio.trim().length === 0) {
                errors.push('Bio must be a non-empty string');
            }
            if (this.bio && this.bio.length > 1000) {
                errors.push('Bio must be less than 1000 characters');
            }
        }

        // Validar location
        if (this.location !== undefined) {
            if (typeof this.location !== 'string') {
                errors.push('Location must be a string');
            }
            if (this.location && this.location.length > 255) {
                errors.push('Location must be less than 255 characters');
            }
        }

        // Validar géneros
        if (this.genres !== undefined) {
            if (typeof this.genres === 'string') {
                try {
                    JSON.parse(this.genres);
                } catch (e) {
                    if (!this.genres.match(/^[a-zA-Z\s,]+$/)) {
                        errors.push('Genres must be a valid JSON array or comma-separated string');
                    }
                }
            } else if (!Array.isArray(this.genres)) {
                errors.push('Genres must be an array or string');
            }
        }

        // Validar redes sociales
        if (this.social_media !== undefined) {
            if (typeof this.social_media === 'string') {
                try {
                    const parsed = JSON.parse(this.social_media);
                    if (!Array.isArray(parsed)) {
                        errors.push('Social media must be an array');
                    }
                } catch (e) {
                    errors.push('Social media must be valid JSON');
                }
            } else if (!Array.isArray(this.social_media)) {
                errors.push('Social media must be an array');
            }
        }

        // Validar URL de imagen de perfil
        if (this.profileImageUrl !== undefined && typeof this.profileImageUrl !== 'string') {
            errors.push('Profile image URL must be a string');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    serialize() {
        const serialized = {};
        if (this.name !== undefined) serialized.name = this.name;
        if (this.bio !== undefined) serialized.bio = this.bio;
        if (this.location !== undefined) serialized.location = this.location;
        if (this.genres !== undefined) serialized.genres = this.genres;
        if (this.social_media !== undefined) serialized.social_media = this.social_media;
        if (this.profileImageUrl !== undefined) serialized.profileImageUrl = this.profileImageUrl;
        return serialized;
    }
}
