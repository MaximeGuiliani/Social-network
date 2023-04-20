import { Router } from "express";
import { createUser, getAllUsers, updateUser, deleteUser } from "./../../db/users.js";

const router = Router();

router.post("/", async (req, res, next) => {
  const results = await createUser(req.body);
  res.status(201).json({ id: results[0] });
});

router.get("/", async (req, res, next) => {
  const users = await getAllUsers();
  res.status(200).json(users);
});

router.patch("/:userId", async (req, res, next) => {
  const user = await updateUser(req.params.userId, req.body);
  res.status(200).json({ user });
});

router.delete("/:userId", async (req, res, next) => {
  await deleteUser(req.params.userId);
  res.status(200).json({ sucess: true });
});

export default router;
