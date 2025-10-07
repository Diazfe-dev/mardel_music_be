import { 
    BadRequestException,
    InternalServerErrorException,
    NotFoundException
} from "../lib/exceptions/index.js";

export class EventRepository {
    constructor(db) {
        this.db = db;
    }

    async createEvent(eventData) {
        try {
            const { profileId, name, description, pictureUrl, location, ticketUrl, eventDate, genres } = eventData;
            
            const [result] = await this.db.execute(
                'CALL sp_create_event(?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    profileId,
                    name,
                    description,
                    pictureUrl,
                    location,
                    ticketUrl,
                    eventDate,
                    JSON.stringify(genres || [])
                ]
            );

            return result[0];
        } catch (error) {
            console.error('Error creating event:', error);
            throw new InternalServerErrorException('Error creating event: ' + error.message);
        }
    }

    async findById(eventId) {
        try {
            const [rows] = await this.db.execute(
                'SELECT * FROM view_events_details WHERE event_id = ? AND event_is_active = TRUE',
                [eventId]
            );

            if (rows.length === 0) {
                throw new NotFoundException('Event not found');
            }

            return this.__mapEventData(rows[0]);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            console.error('Error finding event by ID:', error);
            throw new InternalServerErrorException('Error retrieving event: ' + error.message);
        }
    }

    async findAll(filters = {}) {
        try {
            let query = 'SELECT * FROM view_events_details WHERE event_is_active = TRUE';
            const params = [];

            // Add filters
            if (filters.artistProfileId) {
                query += ' AND artist_profile_id = ?';
                params.push(filters.artistProfileId);
            }

            if (filters.location) {
                query += ' AND event_location LIKE ?';
                params.push(`%${filters.location}%`);
            }

            if (filters.fromDate) {
                query += ' AND event_date >= ?';
                params.push(filters.fromDate);
            }

            if (filters.toDate) {
                query += ' AND event_date <= ?';
                params.push(filters.toDate);
            }

            // Order by event date
            query += ' ORDER BY event_date DESC';

            // Add pagination if provided
            if (filters.limit) {
                query += ' LIMIT ?';
                params.push(parseInt(filters.limit));
                
                if (filters.offset) {
                    query += ' OFFSET ?';
                    params.push(parseInt(filters.offset));
                }
            }

            const [rows] = await this.db.execute(query, params);
            return rows.map(row => this.__mapEventData(row));
        } catch (error) {
            console.error('Error finding events:', error);
            throw new InternalServerErrorException('Error retrieving events: ' + error.message);
        }
    }

    async findByArtist(profileId) {
        try {
            const [rows] = await this.db.execute(
                'SELECT * FROM view_events_details WHERE artist_profile_id = ? AND event_is_active = TRUE ORDER BY event_date DESC',
                [profileId]
            );

            return rows.map(row => this.__mapEventData(row));
        } catch (error) {
            console.error('Error finding events by artist:', error);
            throw new InternalServerErrorException('Error retrieving artist events: ' + error.message);
        }
    }

    async toggleLike(eventId, userId) {
        try {
            const [result] = await this.db.execute(
                'CALL sp_toggle_event_like(?, ?)',
                [eventId, userId]
            );

            return result[0];
        } catch (error) {
            console.error('Error toggling event like:', error);
            throw new InternalServerErrorException('Error updating event like: ' + error.message);
        }
    }

    async getUserLikedEvents(userId) {
        try {
            const [rows] = await this.db.execute(
                `SELECT ved.* FROM view_events_details ved 
                 INNER JOIN event_likes el ON ved.event_id = el.event_id 
                 WHERE el.user_id = ? AND ved.event_is_active = TRUE 
                 ORDER BY el.created_at DESC`,
                [userId]
            );

            return rows.map(row => this.__mapEventData(row));
        } catch (error) {
            console.error('Error finding user liked events:', error);
            throw new InternalServerErrorException('Error retrieving liked events: ' + error.message);
        }
    }

    async updateEvent(eventId, updateData) {
        try {
            const { name, description, pictureUrl, location, ticketUrl, eventDate } = updateData;
            
            const [result] = await this.db.execute(
                `UPDATE events 
                 SET name = COALESCE(?, name),
                     description = COALESCE(?, description),
                     picture_url = COALESCE(?, picture_url),
                     location = COALESCE(?, location),
                     ticket_url = COALESCE(?, ticket_url),
                     event_date = COALESCE(?, event_date),
                     updated_at = NOW()
                 WHERE id = ? AND is_active = TRUE`,
                [name, description, pictureUrl, location, ticketUrl, eventDate, eventId]
            );

            if (result.affectedRows === 0) {
                throw new NotFoundException('Event not found or cannot be updated');
            }

            return await this.findById(eventId);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            console.error('Error updating event:', error);
            throw new InternalServerErrorException('Error updating event: ' + error.message);
        }
    }

    async deleteEvent(eventId) {
        try {
            const [result] = await this.db.execute(
                'UPDATE events SET is_active = FALSE, updated_at = NOW() WHERE id = ? AND is_active = TRUE',
                [eventId]
            );

            if (result.affectedRows === 0) {
                throw new NotFoundException('Event not found or already deleted');
            }

            return { message: 'Event deleted successfully' };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            console.error('Error deleting event:', error);
            throw new InternalServerErrorException('Error deleting event: ' + error.message);
        }
    }

    __mapEventData(row) {
        try {
            let eventGenres = [];
            
            try {
                eventGenres = JSON.parse(row.event_genres || '[]');
            } catch (e) {
                console.warn('Error parsing event_genres JSON:', e);
                eventGenres = [];
            }

            return {
                id: row.event_id,
                name: row.event_name,
                description: row.event_description,
                picture_url: row.event_picture_url,
                location: row.event_location,
                ticket_url: row.event_ticket_url,
                event_date: row.event_date,
                created_at: row.event_created_at,
                updated_at: row.event_updated_at,
                is_active: row.event_is_active,
                artist: {
                    profile_id: row.artist_profile_id,
                    name: row.artist_name,
                    profile_image_url: row.artist_profile_image_url,
                    verified: row.artist_verified,
                    creator: {
                        user_id: row.creator_user_id,
                        name: row.creator_user_name,
                        last_name: row.creator_user_last_name
                    }
                },
                genres: eventGenres,
                total_likes: row.total_likes || 0
            };
        } catch (error) {
            console.error('Error mapping event data:', error);
            throw new InternalServerErrorException('Error processing event data: ' + error.message);
        }
    }
}