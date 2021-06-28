import { Router } from 'express';

import userController from '../../controllers/usersController';
import usersValidate from '../../validates/usersValidate';
const router = Router();

router.get('/:id', userController.get_one);
router.get('/', usersValidate.authenFilter, userController.get_list);
router.post('/register', usersValidate.authenCreate, userController.register);

export default router;
