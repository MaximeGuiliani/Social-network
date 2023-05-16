import { Router } from "express";
const router = Router();
import checkAuth from "../middleware/check-auth.js";
import checkEventOwner from "../middleware/check-event-owner.js";
import {
  event_create,
  event_delete,
  event_get_all,
  event_get_by_id,
  event_update,
  event_apply,
  event_unapply,
  event_get_candidates,
  // event_uncandidate,
  // event_get_candidates,
  // event_accept_participant,
  // event_refuse_participant,
  // event_unparticipate,
  // event_remove_participant,
  // event_get_participants,
} from "../controllers/events.js";

// (GET) /events

router.get("/", event_get_all);

// (POST) /events/create

router.post("/create", checkAuth, event_create);

// (GET) /events/:eventId

router.get("/:eventId", event_get_by_id);

// (PATCH)  /events/:eventId

router.patch("/:eventId", checkAuth, event_update);

// (DELETE) /events/:eventId

router.delete("/:eventId", checkAuth, event_delete);

// (POST) /events/:eventId/candidate
router.post("/:eventId/apply", checkAuth, event_apply);

// (POST) /events/:eventId/unapply
router.post("/:eventId/uncandidate", checkAuth, event_unapply);

// (GET) /events/:eventId/candidates
router.get(
  "/:eventId/candidates",
  checkAuth,
  checkEventOwner,
  event_get_candidates
);

// // (POST) /events/:eventId/accept/:username
// router.post(
//   "/:eventId/accept/:username",
//   checkAuth,
//   checkOwner,
//   event_accept_participant
// );

// // (POST) /events/:eventId/refuse/:username
// router.post(
//   "/:eventId/refuse/:username",
//   checkAuth,
//   checkOwner,
//   event_refuse_participant
// );

// // (POST) /events/:eventId/unparticipate
// router.post("/:eventId/unparticipate", checkAuth, event_unparticipate);

// // (POST) /events/:eventId/remove/:username
// router.post(
//   "/:eventId/remove/:username",
//   checkAuth,
//   checkOwner,
//   event_remove_participant
// );

// // (GET) /events/:eventId/participants
// router.get("/:eventId/participants", event_get_participants);

export default router;
