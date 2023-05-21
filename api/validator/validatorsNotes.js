import Joi from "joi";



const schemaPostNoteFromHost = Joi.object({
    creationDate: Joi.date().required(),
    ownerId: Joi.number().required(),
    eventId: Joi.number().required(),
    targetId: Joi.number().required(),
    value: Joi.number().required(),
    title: Joi.string().required(),
    comment: Joi.string().required(),
});


const schemaPostNoteFromParticipant = Joi.object({
  creationDate: Joi.date().required(),
  ownerId: Joi.number().required(),
  eventId: Joi.number().required(),
  value: Joi.number().required(),
  title: Joi.string().required(),
  comment: Joi.string().required(),
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

export {
  schemaPostNoteFromHost,
  schemaPostNoteFromParticipant,
  validate,
};
