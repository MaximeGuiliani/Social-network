import Joi from "joi";

const schemaCreateCategory = Joi.string().min(3).max(30).required();

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
export { validate, schemaCreateCategory };
