import { Router } from "express";
const router = Router();

import checkAuth from "../middleware/check-auth.js";
import {
  user_delete,
  user_get_all,
  user_get_by_username,
  user_login,
  user_signup,
  user_update,
  user_get_notes_by_username,
  user_get_notes_by_noteId,
  user_get_avis_by_avisId,
  user_get_avis_by_username,
  user_get_candidates_by_username,
  user_get_participations_from_user,
} from "../controllers/users.js";

// (POST) /users/signup

router.post("/signup", user_signup);

// (POST) /users/login

router.post("/login", user_login);

// (GET) /users

router.get("/", user_get_all);

// (GET) /users/:userName

router.get("/:userName", user_get_by_username);

// (PATCH) /users/:userName

router.patch("/:userName", checkAuth, user_update);

// (DELETE) /users/:userName

router.delete("/:userName", checkAuth, user_delete);

// (GET) /users/:username/candidates

router.get("/:username/candidates", user_get_candidates_by_username);

// (GET) /users/:username/participations

router.get("/:username/participations", user_get_participations_from_user);

// TODO ________________ SECTION TODO _________________________________

// (GET) /users/:username/notes

router.get("/:username/notes", user_get_notes_by_username);

// (GET) /users/:username/notes/:noteId

router.get("/:username/notes/:noteId", user_get_notes_by_noteId);

// (GET) /users/:username/avis

router.get("/:username/avis", user_get_avis_by_username);

// (GET) /users/:username/avis/:avisId

router.get("/:username/avis/:avisId", user_get_avis_by_avisId);


export default router;
