import { 
    BadRequestException,
    InternalServerErrorException,
    NotFoundException 
} from "../../../infrastructure/lib/index.js";
import { successResponse } from "../../../infrastructure/lib/index.js";

export class EventsController {
    constructor(eventsService) {
        this.eventsService = eventsService;
    }

    async createEvent(req, res) {
        try {
            const { profile_id } = req.user;
            
            if (!profile_id) {
                return BadRequestException(res, 'Artist profile required to create events');
            }
            
            const result = await this.eventsService.createEvent(profile_id, req.body);
            return successResponse(res, result, 'Event created successfully', 201);
            
        } catch (error) {
            console.error('Error in createEvent controller:', error);
            
            if (error instanceof BadRequestException) {
                return BadRequestException(res, error.message);
            }
            
            return InternalServerErrorException(res, 'Error creating event');
        }
    }

    async getEventById(req, res) {
        try {
            const { id } = req.params;
            const event = await this.eventsService.getEventById(id);
            return successResponse(res, event);
            
        } catch (error) {
            console.error('Error in getEventById controller:', error);
            
            if (error instanceof BadRequestException) {
                return BadRequestException(res, error.message);
            }
            
            if (error instanceof NotFoundException) {
                return NotFoundException(res, error.message);
            }
            
            return InternalServerErrorException(res, 'Error retrieving event');
        }
    }

    async getAllEvents(req, res) {
        try {
            const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;
            const limit = req.query.limit ? parseInt(req.query.limit, 10) : 20;
            
            const events = await this.eventsService.getAllEvents(offset, limit);
            return successResponse(res, events);
            
        } catch (error) {
            console.error('Error in getAllEvents controller:', error);
            
            if (error instanceof BadRequestException) {
                return BadRequestException(res, error.message);
            }
            
            return InternalServerErrorException(res, 'Error retrieving events');
        }
    }

    async getUpcomingEvents(req, res) {
        try {
            const days = req.query.days ? parseInt(req.query.days, 10) : 30;
            const events = await this.eventsService.getUpcomingEvents(days);
            return successResponse(res, events);
            
        } catch (error) {
            console.error('Error in getUpcomingEvents controller:', error);
            
            if (error instanceof BadRequestException) {
                return BadRequestException(res, error.message);
            }
            
            return InternalServerErrorException(res, 'Error retrieving upcoming events');
        }
    }

    async getEventsByArtist(req, res) {
        try {
            const { profile_id } = req.params;
            const events = await this.eventsService.getEventsByArtist(profile_id);
            return successResponse(res, events);
            
        } catch (error) {
            console.error('Error in getEventsByArtist controller:', error);
            
            if (error instanceof BadRequestException) {
                return BadRequestException(res, error.message);
            }
            
            return InternalServerErrorException(res, 'Error retrieving artist events');
        }
    }

    async getMyEvents(req, res) {
        try {
            const { profile_id } = req.user;
            
            if (!profile_id) {
                return BadRequestException(res, 'Artist profile required');
            }
            
            const events = await this.eventsService.getEventsByArtist(profile_id);
            return successResponse(res, events);
            
        } catch (error) {
            console.error('Error in getMyEvents controller:', error);
            
            if (error instanceof BadRequestException) {
                return BadRequestException(res, error.message);
            }
            
            return InternalServerErrorException(res, 'Error retrieving your events');
        }
    }

    async searchEvents(req, res) {
        try {
            const { q } = req.query;
            const events = await this.eventsService.searchEvents(q);
            return successResponse(res, events);
            
        } catch (error) {
            console.error('Error in searchEvents controller:', error);
            
            if (error instanceof BadRequestException) {
                return BadRequestException(res, error.message);
            }
            
            return InternalServerErrorException(res, 'Error searching events');
        }
    }

    async updateEvent(req, res) {
        try {
            const { id } = req.params;
            const { profile_id } = req.user;
            
            if (!profile_id) {
                return BadRequestException(res, 'Artist profile required');
            }
            
            const result = await this.eventsService.updateEvent(id, profile_id, req.body);
            return successResponse(res, result, 'Event updated successfully');
            
        } catch (error) {
            console.error('Error in updateEvent controller:', error);
            
            if (error instanceof BadRequestException) {
                return BadRequestException(res, error.message);
            }
            
            if (error instanceof NotFoundException) {
                return NotFoundException(res, error.message);
            }
            
            return InternalServerErrorException(res, 'Error updating event');
        }
    }

    async deleteEvent(req, res) {
        try {
            const { id } = req.params;
            const { profile_id } = req.user;
            
            if (!profile_id) {
                return BadRequestException(res, 'Artist profile required');
            }
            
            const result = await this.eventsService.deleteEvent(id, profile_id);
            return successResponse(res, result, 'Event deleted successfully');
            
        } catch (error) {
            console.error('Error in deleteEvent controller:', error);
            
            if (error instanceof BadRequestException) {
                return BadRequestException(res, error.message);
            }
            
            if (error instanceof NotFoundException) {
                return NotFoundException(res, error.message);
            }
            
            return InternalServerErrorException(res, 'Error deleting event');
        }
    }

    async toggleEventLike(req, res) {
        try {
            const { id } = req.params;
            const { user_id } = req.user;
            
            const result = await this.eventsService.toggleEventLike(id, user_id);
            
            const message = result.action === 'liked' ? 'Event liked successfully' : 'Event unliked successfully';
            return successResponse(res, result, message);
            
        } catch (error) {
            console.error('Error in toggleEventLike controller:', error);
            
            if (error instanceof BadRequestException) {
                return BadRequestException(res, error.message);
            }
            
            if (error instanceof NotFoundException) {
                return NotFoundException(res, error.message);
            }
            
            return InternalServerErrorException(res, 'Error toggling event like');
        }
    }

    async getUserLikedEvents(req, res) {
        try {
            const { user_id } = req.user;
            const events = await this.eventsService.getUserLikedEvents(user_id);
            return successResponse(res, events);
            
        } catch (error) {
            console.error('Error in getUserLikedEvents controller:', error);
            
            if (error instanceof BadRequestException) {
                return BadRequestException(res, error.message);
            }
            
            return InternalServerErrorException(res, 'Error retrieving liked events');
        }
    }

    async getEventLikesCount(req, res) {
        try {
            const { id } = req.params;
            const result = await this.eventsService.getEventLikesCount(id);
            return successResponse(res, result);
            
        } catch (error) {
            console.error('Error in getEventLikesCount controller:', error);
            
            if (error instanceof BadRequestException) {
                return BadRequestException(res, error.message);
            }
            
            if (error instanceof NotFoundException) {
                return NotFoundException(res, error.message);
            }
            
            return InternalServerErrorException(res, 'Error retrieving event likes count');
        }
    }
}