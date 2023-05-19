import { Router } from "express";
const router = Router();
import checkAuth from "../middleware/check-auth.js";
import checkEventOwner from "../middleware/check-event-owner.js";
import {
  event_get_by_filters,
} from "../controllers/events.js";

// (GET) /events/search

router.get("/events", event_get_by_filters );

export default router;