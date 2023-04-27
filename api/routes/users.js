import { Router } from "express";
const router = Router();


import checkAuth from "../middleware/check-auth.js";
import { user_delete, user_get_all, user_get_by_username, user_login, user_signup, user_update } from "../controllers/users.js";

// (POST) /users/signup

router.post("/signup",user_signup );

// (POST) /users/login

router.post("/login", user_login );

// (GET) /users

router.get("/",user_get_all);

// (GET) /users/:userName

router.get("/:userName",user_get_by_username );

// (PATCH) /users/:userName

router.patch("/:userName", checkAuth,user_update );

// (DELETE) /users/:userName

router.delete("/:userName", checkAuth, user_delete);

export default router;
