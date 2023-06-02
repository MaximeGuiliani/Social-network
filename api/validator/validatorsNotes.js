import Joi from "joi";
import { sendBadRequest } from "../controllers/errors.js";

const schemaPostNoteFromHost = Joi.object({
  ownerId: Joi.number().required(),
  eventId: Joi.number().required(),
  targetId: Joi.number().required(),
  value: Joi.number().required(),
  title: Joi.string().min(0),
  comment: Joi.string().min(0),
});

const schemaPostNoteFromParticipant = Joi.object({
  ownerId: Joi.number().required(),
  eventId: Joi.number().required(),
  value: Joi.number().required(),
  title: Joi.string().min(0),
  comment: Joi.string().min(0),
});

function validate(validation, res) {
  if (validation.error) {
    sendBadRequest(res, validation.error);

    return null;
  }
  return validation.value;
}

export { schemaPostNoteFromHost, schemaPostNoteFromParticipant, validate };
