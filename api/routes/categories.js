import { Router } from "express";
const router = Router();
import {
  get_main_categories,
} from "../controllers/categories.js";

// (GET) /categories
router.get("/", get_main_categories);

export default router;
