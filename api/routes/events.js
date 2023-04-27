import { Router } from "express";
const router = Router();
import checkAuth from "../middleware/check-auth.js";
import { event_create, event_delete, event_get_all, event_get_by_id, event_update } from "../controllers/events.js";


// (GET) /events

router.get("/",event_get_all );

// (POST) /events/create

router.post("/create", checkAuth, event_create);

// (GET) /events/:eventId

router.get("/:eventId", event_get_by_id);

// (PATCH)  /events/:eventId

router.patch("/:eventId",checkAuth, event_update);

// (DELETE) /events/:eventId

router.delete("/:eventId",checkAuth ,event_delete);

export default router;
