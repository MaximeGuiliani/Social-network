import { Router } from "express";
const router = Router();

import checkAuth from "../middleware/check-auth.js";
import {
  user_delete,
  user_get,
  user_login,
  user_signup,
  user_update,

} from "../controllers/users.js";

// (POST) /users/signup
router.post("/signup", user_signup);

// (POST) /users/login
router.post("/login", user_login);

// (GET) /users
router.get("/", user_get);

// (PATCH) /users/:userName
router.patch("/:userName", checkAuth, user_update);

// (DELETE) /users/:userName
router.delete("/:userName", checkAuth, user_delete);



export default router;
