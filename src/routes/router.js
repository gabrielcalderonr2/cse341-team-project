import { Router } from 'express';
import ejsRoutes from './ejs-routes.js';
import apiRoutes from './api-routes.js';

const router = Router();

// EJS page routes
router.use('/', ejsRoutes);

// API routes
router.use('/', apiRoutes);

export default router;
