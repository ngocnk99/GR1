import { Router } from 'express';
import usersRoutes from './web/routes/usersRoutes';

/**
/**
 * Contains all API routes for the application.
 */
const router = Router();

router.use('/c/users', usersRoutes);

export default router;
