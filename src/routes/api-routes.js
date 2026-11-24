import { Router } from 'express';
import { trainsApi } from './trains.js';
import {
  getSchedulesForTrip,
  getSchedulesForTripAndMonth,
} from '../controllers/schedules.js';
import { getAllBookings } from '../controllers/bookings.js';

const router = Router();

// Trains API
router.get('/api/trains', trainsApi);

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
