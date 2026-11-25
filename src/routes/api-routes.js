import { Router } from 'express';
import { trainsApi } from './trains.js';
import {
  getSchedulesForTrip,
  getSchedulesForTripAndMonth,
} from '../controllers/schedules.js';
import { getAllBookings } from '../controllers/bookings.js';
import {
  getAllStations,
  getStationById,
} from "../controllers/stations.js";
import {
  getAllTicketClasses,
  getTicketClassByName,
} from "../controllers/ticket-classes.js";

const router = Router();

// Trains API
router.get('/api/trains', trainsApi);
// Stations API
router.get('/api/stations', getAllStations);
router.get('/api/stations/:id', getStationById);
// Ticket Classes API
router.get('/api/ticket-classes', getAllTicketClasses);
router.get('/api/ticket-classes/:className', getTicketClassByName);

/**
 * @openapi
 * /api/stations:
 *   get:
 *     summary: Get all stations
 *     description: Returns all railway stations stored in the database.
 *     tags:
 *       - Stations
 *     responses:
 *       200:
 *         description: List of stations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   prefecture:
 *                     type: string
 *                   region:
 *                     type: string
 *                   facilities:
 *                     type: array
 *                     items:
 *                       type: string
 *                   description:
 *                     type: string
 *       500:
 *         description: Failed to fetch stations
 */
/**
 * @openapi
 * /api/stations/{id}:
 *   get:
 *     summary: Get a station by ID
 *     description: Returns a specific railway station.
 *     tags:
 *       - Stations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique station identifier
 *     responses:
 *       200:
 *         description: Station found
 *       404:
 *         description: Station not found
 *       500:
 *         description: Failed to fetch station
 */
/**
 * @openapi
 * /api/ticket-classes:
 *   get:
 *     summary: Get all ticket classes
 *     description: Returns all available ticket classes.
 *     tags:
 *       - Ticket Classes
 *     responses:
 *       200:
 *         description: List of ticket classes
 *       500:
 *         description: Failed to fetch ticket classes
 */

/**
 * @openapi
 * /api/ticket-classes/{className}:
 *   get:
 *     summary: Get a ticket class by name
 *     description: Returns a ticket class by its class name.
 *     tags:
 *       - Ticket Classes
 *     parameters:
 *       - in: path
 *         name: className
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticket class name (standard, premium, or first)
 *     responses:
 *       200:
 *         description: Ticket class found
 *       404:
 *         description: Ticket class not found
 *       500:
 *         description: Failed to fetch ticket class
 */

/**
 * @openapi
 * /api/trips/{id}/schedules:
 *   get:
 *     summary: Get schedules for a specific trip
 *     description: Returns schedules for a trip. An optional month can be provided to check whether the trip operates during that month.
 *     tags:
 *       - Schedules
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the trip
 *       - in: query
 *         name: month
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: Month number (1-12)
 *     responses:
 *       200:
 *         description: List of schedules for the selected trip
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   tripId:
 *                     type: string
 *                   departureTime:
 *                     type: string
 *                   arrivalTime:
 *                     type: string
 *                   daysOfWeek:
 *                     type: array
 *                     items:
 *                       type: string
 *                   status:
 *                     type: boolean
 *       500:
 *         description: Failed to fetch schedules
 */
router.get('/api/trips/:id/schedules', (req, res, next) => {
  if (req.query.month) {
    return getSchedulesForTripAndMonth(req, res, next);
  }

  return getSchedulesForTrip(req, res, next);
});

/**
 * @openapi
 * /api/bookings:
 *   get:
 *     summary: Get all bookings
 *     description: Returns all bookings stored in the database.
 *     tags:
 *       - Bookings
 *     responses:
 *       200:
 *         description: List of bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   scheduleId:
 *                     type: integer
 *                   tripId:
 *                     type: string
 *                   ticketClass:
 *                     type: string
 *                   selectedDay:
 *                     type: string
 *                   passengers:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         firstName:
 *                           type: string
 *                         lastName:
 *                           type: string
 *                         email:
 *                           type: string
 *                         phone:
 *                           type: string
 *       500:
 *         description: Failed to fetch bookings
 */
router.get('/api/bookings', getAllBookings);

export default router;
