import { Router } from 'express';

import userController from '../controllers/userController';
import userValidate from '../validates/userValidate';
// import { findUser, userValidator } from '../validators/userValidator';

const router = Router();

router.get("/", userValidate.authenFilter, userController.get_list)
router.get("/:id", userController.get_one)
router.get("/get/all", userValidate.authenFilter, userController.get_all)
router.put("/", userValidate.authenUpdate, userController.update)
router.delete("/:id", userController.delete)

//authen
router.post("/jobker/signup", userValidate.authenCreate, userController.create_jobker)
router.post("/employer/signup", userValidate.authenCreate, userController.create_employer)
router.post("/signin", userValidate.authenCreate, userController.signin)



// router.post("/current/changepass", userValidate.authenChangePass, userController.changePass)
// router.post("/resetpass/:id", userController.resetPass)

export default router;