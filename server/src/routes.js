import { Router } from 'express';

import usersRoutes from './routes/usersRoutes';
import userGroupsRoutes from './routes/userGroupsRoutes';

/**
 * Contains all API routes for the application.
 */
const router = Router();

/**
 * GET /swagger.json
 */
// router.get('/swagger.json', (req, res) => {
//   res.json(swaggerSpec);
// });

/**
 * GET /api
 */
router.get('/', (req, res) => {
  res.json({
    app: req.app.locals.title,
    apiVersion: req.app.locals.version
  });
});

router.use('/c/users', usersRoutes);
router.use('/c/userGroups', userGroupsRoutes);

export default router;
