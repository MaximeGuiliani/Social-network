import { Router } from "express";
const router = Router();
import checkAuth from "../middleware/check-auth.js";
import {
  get_main_categories,
} from "../controllers/categories.js";

// (GET) /events/categories
router.get("/", get_main_categories);



export default router;
