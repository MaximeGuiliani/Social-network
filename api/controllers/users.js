import { myDAO } from "../../app.js";
import {
  schemaUpdateUser,
  schemaSignupUser,
  validate,
  schemaLoginUser,
  schemaUserWithRelatedEvents,
  schemaId,
} from "../validator/validatorsUsers.js";

import {
  sendBadRequest,
  sendServerError,
  sendAuthFailed,
} from "../controllers/errors.js";

import { hash, compare } from "bcrypt";
import pkg from "jsonwebtoken";
const { sign } = pkg;

// user_signup crée l'utilisateur en utilisant le hash du mot de passe
export async function user_signup(req, res, next) {
  const validUser = validate(schemaSignupUser.validate(req.body), res);
  if (validUser == null) {
    return;
  }
  return createUser(req, res, validUser);
}

function createUser(req, res, validUser) {
  hash(req.body.password, 10, async (err, hash) => {
    if (err) {
      return res.status(500).json({
        code: 500,
        error: err.message,
      });
    } else {
      validUser.password_hash = hash;
      await myDAO
        .add_user(validUser)
        .then((user) => {
          return res.status(201).json({
            code: 201,
            message: "User created",
            User:user,
          });
        })
        .catch((err) => {
          return sendServerError(res, err.message);
        });
    }
  });
}

// user_login verifie que l'utilisateur existe et que le mot de passe est correct avant de créer un token
export async function user_login(req, res, next) {
  const validLoginUser = validate(schemaLoginUser.validate(req.body), res);
  if (validLoginUser == null) {
    return;
  }
  await myDAO.get_user_by_email(validLoginUser.email).then((user) => {
    if (user == null) {
      return sendAuthFailed(res, "Auth failed");
    }
    compare(validLoginUser.password, user.password_hash, (err, result) => {
      if (err) {
        return sendAuthFailed(res, "Auth failed");
      }
      if (result) {
        let privateKey = "PrivateKeyForTestOnly";

        if (process.env.JWT_KEY != null) {
          privateKey = process.env.JWT_KEY;
        }

        const token = sign(
          {
            id: user.id,
            username: user.username,
            email: user.email,
          },
          privateKey,
          {
            expiresIn: "10h",
          }
        );
        return res.status(200).json({
          code: 200,
          message: "Auth successful",
          user: user,
          token: token,
        });
      }
      return sendAuthFailed(res, "Auth failed");
    });
  });
}

export async function user_get(req, res, next) {
  if (req.query.id == null) {
    await myDAO
      .get_all_users()
      .then(function (users) {
        res.status(200).json({
          code: 200,
          message: "Handling GET requests to /users : returning all users",
          users: users,
        });
      })
      .catch(function (err) {
        sendBadRequest(res, err.message);
      });
  } else {
    const validParams = validate(
      schemaUserWithRelatedEvents.validate(req.query),
      res
    );
    if (validParams == null) {
      return;
    }
    await myDAO
      .get_user_with_related_events(validParams)
      .then(function (user) {
        if (user == null) {
          res.status(404).json({
            code: 404,
            message: "User not found",
          });
          return;
        }
        res.status(200).json({
          code: 200,
          message: "Handling GET requests to /users/:id : returning user",
          user: user,
        });
      })
      .catch(function (err) {
        sendBadRequest(res, err.message);
      });
  }
}

// user_get_all retourne tous les utilisateurs

export async function user_get_all(req, res, next) {
  await myDAO
    .get_all_users()
    .then(function (users) {
      res.status(200).json({
        code: 200,
        message: "Handling GET requests to /users : returning all users",
        users: users,
      });
    })
    .catch(function (err) {
      sendBadRequest(res, err.message);
    });
}

// user_update met à jour l'utilisateur correspondant à l'id passé en paramètre si il est valid et qu'il existe On mets à jour que la bio pour le moment

export async function user_update(req, res, next) {
  const validUserId = validate(schemaId.validate(req.params.id), res);
  if (validUserId == null) {
    return;
  }

  if (req.userData.id != req.params.id) {
    res.status(401).json({
      code: 401,
      message: "Unauthorized access, You can only update your own profile",
      error: "You can only update your own profile",
    });
    return;
  } else {
    req.body.id = req.userData.id;
    const validUser = validate(schemaUpdateUser.validate(req.body), res);
    if (validUser == null) {
      return;
    }
    if (validUser.password != null) {
      hash(req.body.password.password, 10, async (err, hash) => {
        if (err) {
          return res.status(500).json({
            code: 500,
            error: err.message,
          });
        } else {
          validUser.password_hash = hash;
          await myDAO
            .update_user_by_id(validUser)
            .then((user) => {
              return res.status(201).json({
                code: 201,
                message: "User Updated",
                User: user,
              });
            })
            .catch((err) => {
              return sendServerError(res, err.message);
            });
        }
      });
    } else {
      myDAO
        .update_user_by_id(validUser)
        .then(function (updatedUser) {
          res.status(200).json({
            code: 200,
            updatedUser: updatedUser,
          });
        })
        .catch(function (err) {
          sendBadRequest(res, err.message);
        });
    }
  }
}

// user_delete supprime l'utilisateur correspondant à l'id passé en paramètre si il est valid et qu'il existe
export async function user_delete(req, res, next) {
  const validId = validate(schemaId.validate(req.params.id), res);

  if (validId == null) {
    return;
  }

  if (req.params.id != req.userData.id) {
    res.status(401).json({
      code: 401,
      message: "Unauthorized access",
    });
    return;
  } else {
    myDAO
      .remove_user_by_username(req.params.id)
      .then(function (deletedUser) {
        if (deletedUser == 0) {
          res.status(404).json({
            message: "User not found",
          });
          return;
        }
        res.status(200).json({
          code: 200,
          deletedUser: user,
        });
      })
      .catch(function (err) {
        sendBadRequest(res, err.message);
      });
  }
}

export async function user_get_scores(req, res, next) {
  const validId = validate(schemaId.validate(req.params.id), res);

  if (validId == null) {
    return;
  }

  await myDAO
    .get_user_scores(req.params.id)
    .then(function (scores) {
      res.status(200).json({
        code: 200,
        message: "Handling GET requests to /users/scores/:id : returning scores",
        scores: scores,
      });
    })
    .catch(function (err) {
      sendBadRequest(res, err.message);
    });
}
