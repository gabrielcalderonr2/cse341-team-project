import { Router } from 'express';
import ejsRoutes from './ejs-routes.js';
import apiRoutes from './api-routes.js';
import authRoutes from './auth-routes.js';

const router = Router();

// Authentication routes
router.use('/auth', authRoutes);

// EJS page routes
router.use('/', ejsRoutes);

// API routes
router.use('/', apiRoutes);

export default router;