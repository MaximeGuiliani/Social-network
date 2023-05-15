import { myDAO } from "../../app.js";
import {
  schemaUpdateUser,
  schemaUsername,
  schemaSignupUser,
  validate,
  schemaLoginUser,
} from "../validator/validatorsUsers.js";

import { hash, compare } from "bcrypt";
import pkg from "jsonwebtoken";
const { sign } = pkg;

// NOTE : user_signup verifie que l'email et le username ne sont pas déjà utilisés avant de créer l'utilisateur
export async function user_signup(req, res, next) {
  const validUser = validate(schemaSignupUser.validate(req.body), res);
  if (validUser == null) {
    return;
  }
  // TODO : verifier que l'email n'est pas déjà utilisé en même temps que le username pour ne pas avoir a faire les deux 1 apres l'autre
  await myDAO
    .get_user_by_username(validUser.username)
    .then((result) => {
      if (result != null) {
        return res.status(409).json({
          code: 409,
          message: "Username already exists",
        });
      } else {
        myDAO
          .get_user_by_email(validUser.email)
          .then((result) => {
            if (result != null) {
              return res.status(409).json({
                code: 409,
                message: "Email already taken",
              });
            } else {
              return createUser(req, res, validUser);
            }
          })
          .catch((err) => {
            return sendServerError(res, err);
          });
      }
    })
    .catch((err) => {
      return sendServerError(res, err);
    });
}

// NOTE : createUser crée l'utilisateur en utilisant le hash du mot de passe
function createUser(req, res, validUser) {
  hash(req.body.password, 10, async (err, hash) => {
    if (err) {
      return res.status(500).json({
        code: 500,
        error: err,
      });
    } else {
      await myDAO
        .add_user({
          username: validUser.username,
          email: validUser.email,
          bio: validUser.bio,
          password_hash: hash,
        })
        .then((user) => {
          return res.status(201).json({
            code: 201,
            message: "User created",
            User: userPublicData(user),
          });
        })
        .catch((err) => {
          return sendServerError(res, err);
        });
    }
  });
}

// NOTE : user_login verifie que l'utilisateur existe et que le mot de passe est correct avant de créer un token
export async function user_login(req, res, next) {
  const validLoginUser = validate(schemaLoginUser.validate(req.body), res);
  if (validLoginUser == null) {
    return;
  }
  await myDAO.get_user_by_email(validLoginUser.email).then((user) => {
    if (user == null) {
      return sendAuthFailed(res);
    }
    compare(validLoginUser.password, user.password_hash, (err, result) => {
      if (err) {
        return sendAuthFailed(res);
      }
      if (result) {
        const token = sign(
          {
            id: user.id,
            username: user.username,
            email: user.email,
          },
          process.env.JWT_KEY,
          {
            expiresIn: "1h",
          }
        );
        return res.status(200).json({
          code: 200,
          message: "Auth successful",
          user: userPublicData(user),
          token: token,
        });
      }
      return sendAuthFailed(res);
    });
  });
}



export async function user_get_all(req, res, next) {
  await myDAO
    .get_all_users()
    .then(function (users) {
      res.status(200).json({
        message: "Handling GET requests to /users : returning all users",
        users: users,
      });
    })
    .catch(function (err) {
      sendBadRequest(res, err);
    });
}

export async function user_get_by_username(req, res, next) {
  const validUsername = validate(
    schemaUsername.validate(req.params.userName),
    res
  );
  if (validUsername == null) {
    return;
  }

  await myDAO
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
      sendBadRequest(res, err);
    });
}

export async function user_update(req, res, next) {
  const validUsername = validate(
    schemaUsername.validate(req.params.userName),
    res
  );
  if (validUsername == null) {
    return;
  }
  if (validUsername != (await myDAO.get_user_by_id(req.userData.id).userName)) {
    res.status(401).json({
      message: "Unauthorized access",
    });
    return;
  }

  const validUser = validate(schemaUpdateUser.validate(req.body), res);
  if (validUser == null) {
    return;
  }
  await myDAO
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
      sendBadRequest(res, err);
    });
}

export async function user_delete(req, res, next) {
  const validUsername = validate(
    schemaUsername.validate(req.params.userName),
    res
  );

  if (validUsername == null) {
    return;
  }
  if (validUsername != (await myDAO.get_user_by_id(req.userData.id).userName)) {
    res.status(401).json({
      message: "Unauthorized access",
    });
    return;
  }

  await myDAO
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
      sendBadRequest(res, err);
    });
}

// _________________  Section des fonctions utilitaires  ______________________

function userPublicData(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    bio: user.bio,
  };
}



function sendServerError(res, err) {
  return res.status(500).json({
    code: 500,
    error: err,
  });
}

function sendBadRequest(res, err) {
  return res.status(400).json({
    code: 400,
    error: err,
  });
}


function sendAuthFailed(res) {
  return res.status(401).json({
    code: 401,
    message: "Auth failed",
  });
}

