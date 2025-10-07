import {
    BadRequestException,
    InternalServerErrorException,
    NotFoundException
} from "../../lib/exceptions/index.js";

export class EventsService {
    constructor(eventsRepository, genreRepository) {
        this.eventsRepository = eventsRepository;
        this.genreRepository = genreRepository;
    }

    async createEvent(profileId, eventData) {
        try {
            // Validate required fields
            const { name, description, date, location, genres } = eventData;
            
            if (!name || name.trim() === '') {
                throw new BadRequestException('Event name is required');
            }
            
            if (!description || description.trim() === '') {
                throw new BadRequestException('Event description is required');
            }
            
            if (!date) {
                throw new BadRequestException('Event date is required');
            }
            
            // Validate date is in the future
            const eventDate = new Date(date);
            if (eventDate <= new Date()) {
                throw new BadRequestException('Event date must be in the future');
            }
            
            if (!location || location.trim() === '') {
                throw new BadRequestException('Event location is required');
            }
            
            // Validate genres if provided
            if (genres && genres.length > 0) {
                for (const genreId of genres) {
                    const genre = await this.genreRepository.findById(genreId);
                    if (!genre) {
                        throw new BadRequestException(`Genre with ID ${genreId} not found`);
                    }
                }
            }
            
            // Create event with profile_id
            const newEventData = {
                ...eventData,
                profile_id: profileId
            };
            
            const result = await this.eventsRepository.createEvent(newEventData);
            return result;
            
        } catch (error) {
            console.error('Error in createEvent:', error);
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException('Error creating event');
        }
    }

    async getEventById(eventId) {
        try {
            if (!eventId || isNaN(eventId)) {
                throw new BadRequestException('Valid event ID is required');
            }
            
            const event = await this.eventsRepository.findById(eventId);
            
            if (!event) {
                throw new NotFoundException(`Event with ID ${eventId} not found`);
            }
            
            return event;
            
        } catch (error) {
            console.error('Error in getEventById:', error);
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Error retrieving event');
        }
    }

    async getAllEvents(offset = 0, limit = 20) {
        try {
            if (isNaN(offset) || offset < 0) {
                throw new BadRequestException('Offset must be a non-negative number');
            }
            
            if (isNaN(limit) || limit <= 0 || limit > 100) {
                throw new BadRequestException('Limit must be between 1 and 100');
            }
            
            const events = await this.eventsRepository.findAll(offset, limit);
            return events;
            
        } catch (error) {
            console.error('Error in getAllEvents:', error);
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException('Error retrieving events');
        }
    }

    async getUpcomingEvents(days = 30) {
        try {
            if (isNaN(days) || days <= 0) {
                throw new BadRequestException('Days must be a positive number');
            }
            
            const events = await this.eventsRepository.getUpcomingEvents(days);
            return events;
            
        } catch (error) {
            console.error('Error in getUpcomingEvents:', error);
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException('Error retrieving upcoming events');
        }
    }

    async getEventsByArtist(profileId) {
        try {
            if (!profileId || isNaN(profileId)) {
                throw new BadRequestException('Valid profile ID is required');
            }
            
            const events = await this.eventsRepository.findByProfileId(profileId);
            return events;
            
        } catch (error) {
            console.error('Error in getEventsByArtist:', error);
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException('Error retrieving artist events');
        }
    }

    async searchEvents(query) {
        try {
            if (!query || query.trim() === '') {
                throw new BadRequestException('Search query cannot be empty');
            }
            
            const events = await this.eventsRepository.searchEvents(query.trim());
            return events;
            
        } catch (error) {
            console.error('Error in searchEvents:', error);
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException('Error searching events');
        }
    }

    async updateEvent(eventId, profileId, eventData) {
        try {
            if (!eventId || isNaN(eventId)) {
                throw new BadRequestException('Valid event ID is required');
            }
            
            // Check if event exists and belongs to the profile
            const existingEvent = await this.eventsRepository.findById(eventId);
            
            if (!existingEvent) {
                throw new NotFoundException(`Event with ID ${eventId} not found`);
            }
            
            if (existingEvent.profile_id !== profileId) {
                throw new BadRequestException('You can only update your own events');
            }
            
            // Validate date if provided
            if (eventData.date) {
                const eventDate = new Date(eventData.date);
                if (eventDate <= new Date()) {
                    throw new BadRequestException('Event date must be in the future');
                }
            }
            
            // Validate genres if provided
            if (eventData.genres && eventData.genres.length > 0) {
                for (const genreId of eventData.genres) {
                    const genre = await this.genreRepository.findById(genreId);
                    if (!genre) {
                        throw new BadRequestException(`Genre with ID ${genreId} not found`);
                    }
                }
            }
            
            const result = await this.eventsRepository.updateEvent(eventId, eventData);
            return result;
            
        } catch (error) {
            console.error('Error in updateEvent:', error);
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Error updating event');
        }
    }

    async deleteEvent(eventId, profileId) {
        try {
            if (!eventId || isNaN(eventId)) {
                throw new BadRequestException('Valid event ID is required');
            }
            
            // Check if event exists and belongs to the profile
            const existingEvent = await this.eventsRepository.findById(eventId);
            
            if (!existingEvent) {
                throw new NotFoundException(`Event with ID ${eventId} not found`);
            }
            
            if (existingEvent.profile_id !== profileId) {
                throw new BadRequestException('You can only delete your own events');
            }
            
            const result = await this.eventsRepository.deleteEvent(eventId);
            return result;
            
        } catch (error) {
            console.error('Error in deleteEvent:', error);
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Error deleting event');
        }
    }

    async toggleEventLike(eventId, userId) {
        try {
            if (!eventId || isNaN(eventId)) {
                throw new BadRequestException('Valid event ID is required');
            }
            
            if (!userId || isNaN(userId)) {
                throw new BadRequestException('Valid user ID is required');
            }
            
            // Check if event exists
            const event = await this.eventsRepository.findById(eventId);
            if (!event) {
                throw new NotFoundException(`Event with ID ${eventId} not found`);
            }
            
            const result = await this.eventsRepository.toggleLike(eventId, userId);
            return result;
            
        } catch (error) {
            console.error('Error in toggleEventLike:', error);
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Error toggling event like');
        }
    }

    async getUserLikedEvents(userId) {
        try {
            if (!userId || isNaN(userId)) {
                throw new BadRequestException('Valid user ID is required');
            }
            
            const events = await this.eventsRepository.getUserLikedEvents(userId);
            return events;
            
        } catch (error) {
            console.error('Error in getUserLikedEvents:', error);
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException('Error retrieving user liked events');
        }
    }

    async getEventLikesCount(eventId) {
        try {
            if (!eventId || isNaN(eventId)) {
                throw new BadRequestException('Valid event ID is required');
            }
            
            const event = await this.eventsRepository.findById(eventId);
            if (!event) {
                throw new NotFoundException(`Event with ID ${eventId} not found`);
            }
            
            return { likes_count: event.likes_count || 0 };
            
        } catch (error) {
            console.error('Error in getEventLikesCount:', error);
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Error retrieving event likes count');
        }
    }
}   