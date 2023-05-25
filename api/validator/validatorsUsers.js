import Joi from "joi";

const schemaSignupUser = Joi.object().keys({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().required(),
  bio: Joi.string(),
  email: Joi.string().email().required(),
  picture: Joi.string().uri(),
});

const schemaUpdateUser = Joi.object().keys({
  id: Joi.number().integer().required(),
  username: Joi.string(),
  email: Joi.string().email(),
  password: Joi.object().keys({
    password: Joi.string().required(),
    confirmpassword: Joi.string().valid(Joi.ref("password")).required(),
  }),
  bio: Joi.string().required(),
  picture: Joi.string().uri(),
});

const schemaId = Joi.number().integer().required();

const schemaLoginUser = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const schemaUpdatePassword = Joi.object().keys({
  oldpassword: Joi.string().alphanum().min(3).max(30).required(),
  newpassword: Joi.string().pattern(new RegExp("^[0-9a-f]{64,}$")),
  confirmpassword: Joi.string().valid(Joi.ref("newpassword")).required(),
});

function validate(validation, res) {
  if (validation.error) {
    res.status(400).json({
      code: 400,
      message: "Bad request",
      error: validation.error,
    });
    return null;
  }
  return validation.value;
}


const schemaUserWithRelatedEvents = Joi.object().keys({
  id: Joi.number().integer().required(),
  include_organizedEvents: Joi.boolean(),
  include_candidateEvents: Joi.boolean(),
  include_participantEvents: Joi.boolean(),
  include_givenNotes: Joi.boolean(),
  include_receivedNotes: Joi.boolean(),
  include_messages: Joi.boolean(),
});

export {
  schemaUserWithRelatedEvents,
  schemaUpdatePassword,
  schemaSignupUser,
  validate,
  schemaId,
  schemaUpdateUser,
  schemaLoginUser,
};
