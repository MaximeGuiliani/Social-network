import { Router } from "express";
const router = Router();
import checkAuth from "../middleware/check-auth.js";
import {
    get_note_by_noteId,
    get_mean_and_count_all_notes_by_username,
    get_mean_and_count_all_notes_by_eventId,
    post_note_from_host,
    post_note_from_participant
} from "../controllers/notes.js";

// (GET) /notes/:noteId
router.get("/:noteId", get_note_by_noteId);


// (GET) /notes/user/:username/mean
router.get("/user/:username/mean",get_mean_and_count_all_notes_by_username );

// (GET) /notes/event/:eventId/mean
router.get("/event/:eventId/mean", get_mean_and_count_all_notes_by_eventId);

// (POST) /notes/addnotefromhost
router.post("/", checkAuth, post_note_from_host);

// (POST) /notes/addnotefromparticipant
router.post("/", checkAuth, post_note_from_participant);


export default router;
