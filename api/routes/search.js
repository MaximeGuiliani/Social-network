import { Router } from "express";
const router = Router();
import {
  event_get_by_filters,
} from "../controllers/events.js";

// (GET) /events/search

router.get("/events", event_get_by_filters );

export default router;