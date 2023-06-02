import Joi from "joi";
import { sendBadRequest } from "../controllers/errors.js";


const schemaMessage =  Joi.object().keys({
  userId: Joi.number().integer().required(),
  eventId: Joi.number().integer().required(),
  content: Joi.string().required(),
});

function validate(validation, res) {
  if (validation.error) {
    sendBadRequest(res, validation.error);

    return null;
  }
  return validation.value;
}
export { validate, schemaMessage };
