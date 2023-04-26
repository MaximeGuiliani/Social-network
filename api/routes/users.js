import { Router } from "express";
import {User} from "./../../database/models/User.js"
const router = Router();

// TODO validation des données
// TODO Faire des catch pour les erreurs de la base de données

router.post("/create", async (req, res, next) => {

  if(req.body.username == null || req.body.email == null || req.body.password_hash == null){
    res.status(400).json({ status: "Missing parameters." });
    return;
  }
    // TODO verifier que le username n'apparait pas dans la base
    // TODO verifier que l'email est bien un email valide et qu'il n'est pas déjà utilisé

  const new_user = User.create({
    username: req.body.username,
    email: req.body.email,
    password_hash: req.body.password_hash,
  });
  res.status(201).json({ status: "User added sucessfully.", AddedUser: new_user });
});

router.get("/", async (req, res, next) => {
  const users = await (await myDAO).get_all_users();
  res.status(200).json(users);
});



router.get("/:userName", async (req, res, next) => {
  const user = await (await myDAO).get_user_by_username(req.params.userName);
  res.status(200).json(user);
});

router.patch("/:userName", async (req, res, next) => {
  const user = await (await myDAO).update_user(
    req.params.userName
  );
  res.status(200).json({deletedUser : user});
});

router.delete("/:userName", async (req, res, next) => {
  const user = await (await myDAO).remove_user_by_username(req.params.userName);
  res.status(200).json({deletedUser : user});
});



export default router;