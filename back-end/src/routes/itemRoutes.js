import { Router } from 'express';

import item from '../controllers/itemController';
import itemValidate from '../validates/itemValidate'

const router = Router();

router.get("/", itemValidate.authenFilter, item.get_list) //ok
router.get("/:id", item.get_one) //ok
router.post("/create", itemValidate.authenCreate, item.create) //ok
router.get("/get/all", itemValidate.authenFilter, item.get_all) //ok
router.put("/:id", itemValidate.authenUpdate, item.update) //ok
router.delete("/:id", item.delete) //ok


export default router;