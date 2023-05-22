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



// (POST) /notes/addnotefromhost
router.post("/addnotefromhost", checkAuth, post_note_from_host);

// (POST) /notes/addnotefromparticipant
router.post("/addnotefromparticipant", checkAuth, post_note_from_participant);


export default router;
