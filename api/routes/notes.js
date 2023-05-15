import { Router } from "express";
const router = Router();
import checkAuth from "../middleware/check-auth.js";
import {
    get_note_by_noteId,
    get_all_note_by_eventId,
    get_all_notes_by_username,
    get_mean_and_count_all_notes_by_username,
    get_mean_and_count_all_notes_by_eventId,
    get_all_notes_from_username
} from "../controllers/notes.js";

// (GET) /notes/:noteId

router.get("/:noteId", get_note_by_noteId);

// (GET) /notes/event/:eventId

router.get("/event/:eventId", get_all_note_by_eventId);

// (GET) /notes/user/:username

router.get("/user/:username", get_all_notes_by_username);

// (GET) /notes/user/:username/mean
router.get("/user/:username/mean",get_mean_and_count_all_notes_by_username );

// (GET) /notes/event/:eventId/mean
router.get("/event/:eventId/mean", get_mean_and_count_all_notes_by_eventId);

// (GET) /notes/from/:username
router.get("/from/:username", get_all_notes_from_username);

export default router;
