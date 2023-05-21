import Joi from "joi";

const schemaSignupUser = Joi.object().keys({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().required(),
  bio: Joi.string(),
  email: Joi.string().email().required(),
  picture: Joi.string().uri(),
});


const schemaUpdateUser = Joi.object().keys({
  id:Joi.number().integer().required(),
  email: Joi.string().email(),
  bio: Joi.string().required(),
  picture: Joi.string().uri(),
  
});

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

const schemaUsername = Joi.string()
  .regex(/^[a-zA-Z0-9_]+$/)
  .required()
  .messages({
    "string.base": "Username should be a string",
    "string.empty": "Username cannot be empty",
    "string.pattern.base":
      "Username can only contain letters, numbers, and underscores",
    "any.required": "Username is required",
  });


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
  schemaUsername,
  schemaUpdateUser,
  schemaLoginUser,
};
