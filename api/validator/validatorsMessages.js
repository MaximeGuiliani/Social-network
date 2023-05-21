import Joi from "joi";

const schemaMessage =  Joi.object().keys({
  userId: Joi.number().integer().required(),
  eventId: Joi.number().integer().required(),
  content: Joi.string(),
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
export { validate, schemaMessage };
