import { Router } from 'express';

import user from './routes/userRoutes';
import jobker from './routes/jobkerRoutes'
import employer from './routes/employerRoutes'
/**
 * Contains all API routes for the application.
 */
const router = Router();


/**
 * GET /api
 */
router.get('/', (req, res) => {
    console.log('test')
    res.json({
        app: req.app.locals.title,
        apiVersion: req.app.locals.version
    });
});

router.use('/c/user', user);
router.use('/c/jobker', jobker);
router.use('/c/employer', employer);


export default router;