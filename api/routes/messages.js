import { Router } from "express";
const router = Router();
import checkAuth from "../middleware/check-auth.js";
import {
    add_messages_to_event,
    get_all_messages_from_event
} from "../controllers/messages.js";


// (GET) /messages
router.get("/", get_all_messages_from_event);

// (POST) /messages
router.post("/", add_messages_to_event);


export default router;
