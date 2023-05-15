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

// TODO ________________ SECTION TODO _________________________________

// (GET) /users/:userName/notes

router.get("/:userName/notes", user_get_notes_by_username);

// (GET) /users/:userName/notes/:noteId

router.get("/:userName/notes/:noteId", user_get_notes_by_noteId);

// (GET) /users/:userName/avis

router.get("/:userName/avis", user_get_avis_by_username);

// (GET) /users/:userName/avis/:avisId

router.get("/:userName/avis/:avisId", user_get_avis_by_avisId);

export default router;
