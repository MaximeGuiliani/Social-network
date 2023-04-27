import { Router } from "express";
import { User } from "./../../database/models/User.js";
import { hash } from "bcrypt";
const router = Router();
import {
  schemaUpdateUser,
  schemaUsername,
  schemaSignupUser,
  validate,
} from "../validator/validatorsUsers.js";
import { myDAO } from "../../app.js";

router.post("/signup", async (req, res, next) => {
  const validUser = validate(schemaSignupUser.validate(req.body), res);
  if (validUser == null) {
    return;
  }
  // TODO : verifier que l'email n'est pas déjà utilisé pareil que pour le username

  (await myDAO)
    .get_user_by_username(validUser.username)
    .then((result) => {
      if (result != null) {
        return res.status(409).json({
          message: "Username already exists",
        });
      } else {
        hash(req.body.password, 10, async (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            (await myDAO)
              .add_user(validUser.username, validUser.email, hash)
              .then((result) => {
                console.log(result);
                return res.status(201).json({
                  message: "User created",
                });
              })
              .catch((err) => {
                console.log(err);
                return res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        error: err,
      });
    });
});

router.get("/", async (req, res, next) => {
  await (
    await myDAO
  )
    .get_all_users()
    .then(function (users) {
      res.status(200).json({
        message: "Handling GET requests to /users : returning all users",
        users: users,
      });
    })
    .catch(function (err) {
      res.status(400).json({
        message: "Bad request",
        error: err,
      });
    });
});

router.get("/:userName", async (req, res, next) => {
  const validUsername = validate(
    schemaUsername.validate(req.params.userName),
    res
  );
  if (validUsername == null) {
    return;
  }

  await (
    await myDAO
  )
    .get_user_by_username(validUsername)
    .then(function (user) {
      if (user == null) {
        res.status(404).json({
          message: "User not found",
        });
        return;
      }
      res.status(200).json({
        message: "Handling GET requests to /users/:userName : returning user",
        user: user,
      });
    })
    .catch(function (err) {
      res.status(400).json({
        message: "Bad request",
        error: err,
      });
    });
});

router.patch("/:userName", async (req, res, next) => {
  const validUsername = validate(
    schemaUsername.validate(req.params.userName),
    res
  );
  if (validUsername == null) {
    return;
  }
  const validUser = validate(schemaUpdateUser.validate(req.body), res);
  if (validUser == null) {
    return;
  }
  // TODO : vérifier que l'utilisateur est connecté et que c'est bien lui qui modifie son profil
  (await myDAO)
    .update_user_by_username(
      validUsername,
      validUser.username,
      validUser.email,
      validUser.password_hash
    )
    .then(function (user) {
      res.status(200).json({ updatedUser: user });
    })
    .catch(function (err) {
      res.status(400).json({
        message: "Bad request",
        error: err,
      });
    });
});

router.delete("/:userName", async (req, res, next) => {
  // TODO : vérifier que l'utilisateur est connecté et que c'est bien lui qui suprime son profil
  const validUsername = validate(
    schemaUsername.validate(req.params.userName),
    res
  );
  if (validUsername == null) {
    return;
  }
  await (
    await myDAO
  )
    .remove_user_by_username(validUsername)
    .then(function (user) {
      if (user == 0) {
        res.status(404).json({
          message: "User not found",
        });
        return;
      }
      res.status(200).json({ deletedUser: validUsername });
    })
    .catch(function (err) {
      res.status(400).json({
        message: "Bad request",
        error: err,
      });
    });
});

// TODO login

router.post("/signup", async (req, res, next) => {
  const user = new User(req.body);
});

export default router;
