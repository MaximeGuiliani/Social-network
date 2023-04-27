import { Router } from "express";
import { User } from "./../../database/models/User.js";
const router = Router();
import { schemacreateUser } from "../validator/validatorsUsers.js";
import { myDAO } from "../../app.js";

// TODO validation des données
// TODO Faire des catch pour les erreurs de la base de données

router.post("/create", async (req, res, next) => {
  // TODO verifier que le username n'apparait pas dans la base
  // TODO verifier que l'email est bien un email valide et qu'il n'est pas déjà utilisé

  const validUser = validate(schemacreateUser.validate(req.body));

  if (validUser == null) {
    return;
  }
  const validatedUser = new User(validUser);
  await (
    await myDAO
  )
    .add_user(
      validatedUser.username,
      validatedUser.email,
      validatedUser.password_hash
    )
    .then(function (user) {
      res
        .status(201)
        .json({ status: "User added sucessfully.", AddedUser: user });
    })
    .catch(function (err) {
      res.status(400).json({
        message: "Bad request",
        error: err,
      });
    });
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
  const user = await (await myDAO).update_user(req.params.userName);
  res.status(200).json({ deletedUser: user });
});

router.delete("/:userName", async (req, res, next) => {
  const user = await (await myDAO).remove_user_by_username(req.params.userName);
  res.status(200).json({ deletedUser: user });
});

// Part for validation ______________________

function validate(validation, res) {
  if (validation.error) {
    res.status(400).json({
      message: "Bad request",
      error: validation.error,
    });
    return null;
  }
  return validation.value;
}

export default router;
