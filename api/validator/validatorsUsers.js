import Joi from "joi";

const schemacreateUser = Joi.object().keys({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password_hash: Joi.string().pattern(new RegExp("^[0-9a-f]{64,}$")).required(),
  email: Joi.string().email().required(),
});

const schemaUpdatePassword = Joi.object().keys({
  oldpassword: Joi.string().alphanum().min(3).max(30).required(),
  newpassword: Joi.string().pattern(new RegExp("^[0-9a-f]{64,}$")),
  confirmpassword:Joi.string().valid(Joi.ref('newpassword')).required()
});


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

export { schemaUpdatePassword, schemacreateUser, validate };