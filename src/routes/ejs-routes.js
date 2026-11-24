import { Router } from 'express';
import railTripsRouter from './trips.js';
import { trainsPage } from './trains.js';
import { bookingsAdminPage } from '../controllers/bookings.js';
import { homePage, aboutPage, testErrorPage } from './index.js';

const router = Router();

// Home page
router.get('/', homePage);

// About page
router.get('/about', aboutPage);

// Trains page
router.get('/trains', trainsPage);

// Bookings administration page
router.get('/bookings-admin', bookingsAdminPage);

// Rail trips pages
router.use('/trips', railTripsRouter);

// Test 500 error page
router.get('/500', testErrorPage);

export default router;
