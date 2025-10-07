import Router from 'express';

import mysqlClient from "../../../infrastructure/database/mysql/mysql-client.js";
import { EventRepository } from "../../../infrastructure/repositories/event.repository.js";
import { GenreRepository } from "../../../infrastructure/repositories/genres.repository.js";
import { EventsService } from "../../../infrastructure/services/events/events.service.js";
import { EventsController } from "../../controllers/events/events.controller.js";
import {
    sessionGuard,
    roleGuard,
    validateDto
} from "../../../infrastructure/middlewares/index.js";
import { CreateEventDto, UpdateEventDto } from "../../../domain/models/dto/index.js";

const eventRepository = new EventRepository(mysqlClient);
const genreRepository = new GenreRepository(mysqlClient);
const eventsService = new EventsService(eventRepository, genreRepository);
const eventsController = new EventsController(eventsService);

const eventsRouter = new Router();

eventsRouter.get('/', async (req, res) => await eventsController.getAllEvents(req, res));
eventsRouter.get('/upcoming', async (req, res) => await eventsController.getUpcomingEvents(req, res));
eventsRouter.get('/search', async (req, res) => await eventsController.searchEvents(req, res));
eventsRouter.get('/:id', async (req, res) => await eventsController.getEventById(req, res));
eventsRouter.get('/:id/likes', async (req, res) => await eventsController.getEventLikesCount(req, res));
eventsRouter.get('/artist/:profile_id', async (req, res) => await eventsController.getEventsByArtist(req, res));

eventsRouter.post('/', sessionGuard, roleGuard(['artist', 'admin']), validateDto(CreateEventDto), async (req, res) => await eventsController.createEvent(req, res));
eventsRouter.put('/:id', sessionGuard, roleGuard(['artist', 'admin']), validateDto(UpdateEventDto), async (req, res) => await eventsController.updateEvent(req, res));
eventsRouter.delete('/:id', sessionGuard, roleGuard(['artist', 'admin']), async (req, res) => await eventsController.deleteEvent(req, res));
eventsRouter.get('/my/events', sessionGuard, roleGuard(['artist', 'admin']), async (req, res) => await eventsController.getMyEvents(req, res));

// Like system routes (authentication required)
eventsRouter.post('/:id/like', sessionGuard, async (req, res) => await eventsController.toggleEventLike(req, res));
eventsRouter.get('/my/liked', sessionGuard, async (req, res) => await eventsController.getUserLikedEvents(req, res));

export default eventsRouter;