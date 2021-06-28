import { Router } from 'express';

import userController from '../controllers/usersController';
import usersValidate from '../validates/usersValidate';
// import { findUser, userValidator } from '../validators/userValidator';

const router = Router();

router.get('/', usersValidate.authenFilter, userController.get_list);
router.get('/:id', userController.get_one);
router.post('/register', usersValidate.authenCreate, userController.register);
router.put('/changePass', userController.changePass);

export default router;
