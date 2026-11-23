import railTripsRouter from './trips.js';
import { trainsApi, trainsPage } from './trains.js';
import {
  getSchedulesForTrip,
  getSchedulesForTripAndMonth,
} from '../controllers/schedules.js';
import { Router } from 'express';
import { homePage, aboutPage, testErrorPage } from './index.js';

const router = Router();

// Home page
router.get('/', homePage);

// About page
router.get('/about', aboutPage);

// Trains page
router.get('/trains', trainsPage);

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get('/api/trips/:id/schedules', (req, res, next) => {
  if (req.query.month) {
    return getSchedulesForTripAndMonth(req, res, next);
  }

  return getSchedulesForTrip(req, res, next);
});


// Rail trips
router.use('/trips', railTripsRouter);

// Test 500 error page
router.get('/500', testErrorPage);

export default router;
