import Joi from "joi";
import { sendBadRequest } from "../controllers/errors.js";

const schemaCreateCategory = Joi.string().min(3).max(30).required();

function validate(validation, res) {
  if (validation.error) {
    sendBadRequest(res, validation.error);
    return null;
  }
  return validation.value;
}
export { validate, schemaCreateCategory };
