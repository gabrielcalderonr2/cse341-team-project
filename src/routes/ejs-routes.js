import { Router } from 'express';
import {
    listTripsPage,
    tripDetailsPage,
} from '../controllers/trips.js';

import {
    bookingPage,
    processBookingRequest,
    confirmationPage,
} from '../controllers/bookings.js';
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
router.get('/trips', listTripsPage);
router.get('/trips/:tripId', tripDetailsPage);
router.get('/trips/booking/:scheduleId', bookingPage);
router.post('/trips/book', processBookingRequest);
router.get('/trips/confirmation/:confirmationId', confirmationPage);

// Test 500 error page
router.get('/500', testErrorPage);

export default router;
