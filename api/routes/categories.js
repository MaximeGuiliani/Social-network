import { Router } from "express";
const router = Router();
import checkAuth from "../middleware/check-auth.js";
import {
  get_all_main_categories,
  create_main_category,
} from "../controllers/categories.js";

// (POST) /events/createcategory
// NOTE : route non utile pour le moment 
// router.post("/create/:categoryname", checkAuth, create_main_category);

// (GET) /events/categories

router.get("/", get_all_main_categories);

export default router;
