import { Router } from 'express';

import jobkerController from '../controllers/jobkerController';
import jobkerValidate from '../validates/jobkerValidate'

const router = Router();

router.get("/", jobkerValidate.authenFilter, jobkerController.get_list) //ok
router.get("/:id", jobkerController.get_one) //ok
router.get("/get/all", jobkerValidate.authenFilter, jobkerController.get_all) //ok

router.post("/create", jobkerValidate.authenCreate, jobkerController.create)
router.put("/", jobkerValidate.authenUpdate, jobkerController.update)
router.delete("/", jobkerValidate.authenDelete, jobkerController.delete)


export default router;