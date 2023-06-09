import { Router } from "express";
const router = Router();
import checkAuth from "../middleware/check-auth.js";
import checkEventOwner from "../middleware/check-event-owner.js";
import {
  event_create,
  event_delete,
  event_get,
  event_update,
  event_apply,
  event_unapply,
  event_accept_candidate,
  event_refuse_candidate,
  event_unparticipate,
  event_remove_participant,
  event_get_by_filters,
  event_get_upcoming,
  event_relationship,
  event_get_filling_event,
} from "../controllers/events.js";

// (GET) /events
router.get("/", event_get);

// (POST) /events/create
router.post("/create", checkAuth, event_create);

// (PATCH)  /events/:eventId
router.patch("/:eventId", checkAuth, checkEventOwner, event_update);

// (DELETE) /events/:eventId

router.delete("/:eventId", checkAuth, checkEventOwner, event_delete);

// (POST) /events/:eventId/apply
router.post("/:eventId/apply", checkAuth, event_apply);

// (POST) /events/:eventId/unapply
router.post("/:eventId/unapply", checkAuth, event_unapply);

// (POST) /events/:eventId/accept/:userId
router.post(
  "/:eventId/accept/:userId",
  checkAuth,
  checkEventOwner,
  event_accept_candidate
);

// (POST) /events/:eventId/refuse/:userId
router.post(
  "/:eventId/refuse/:userId",
  checkAuth,
  checkEventOwner,
  event_refuse_candidate
);

// (POST) /events/:eventId/unparticipate
router.post("/:eventId/unparticipate", checkAuth, event_unparticipate);

// (POST) /events/:eventId/remove/:userId
router.post(
  "/:eventId/remove/:userId",
  checkAuth,
  checkEventOwner,
  event_remove_participant
);

// (GET) /events/search

router.get("/search", event_get_by_filters);

// (GET) /events/upcoming

router.get("/upcoming", event_get_upcoming);

// (GET) /events/event_relationship
router.get("/event_relationship", event_relationship);

// (GET) /events/get_filling_event/:eventId
router.get("/get_filling_event", event_get_filling_event);

export default router;
