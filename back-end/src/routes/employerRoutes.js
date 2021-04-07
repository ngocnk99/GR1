import { Router } from 'express';

import employerController from '../controllers/employerController';
import employerValidate from '../validates/employerValidate'

const router = Router();

router.get("/", employerValidate.authenFilter, employerController.get_list) //ok
router.get("/:id", employerController.get_one) //ok
router.get("/get/all", employerValidate.authenFilter, employerController.get_all) //ok

router.post("/create", employerValidate.authenCreate, employerController.create)
router.put("/", employerValidate.authenUpdate, employerController.update)
router.delete("/", employerValidate.authenDelete, employerController.delete)


export default router;