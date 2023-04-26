import Joi from "joi";

const schemaCreateEvent = Joi.object().keys({
  nb_participants: Joi.number().integer().min(1).max(100).required(),
  categories: Joi.array().items(Joi.string().alphanum().min(3).max(30)),
  location : Joi.string().alphanum().min(3).max(30).required(),
  description: Joi.string().alphanum().min(0).max(300),
  image_url: Joi.string().alphanum().min(3),
  date: Joi.date().required(),
  name: Joi.string().alphanum().min(3).max(30).required(),
  organizerId: Joi.number().integer().required(),
});

const schemaUpdateEvent = Joi.object().keys({
    nb_participants: Joi.number().integer().min(1).max(100).required(),
    categories: Joi.array().items(Joi.string().alphanum().min(3).max(30)),
    location : Joi.string().alphanum().min(3).max(30).required(),
    description: Joi.string().alphanum().min(0).max(300),
    image_url: Joi.string().alphanum().min(3),
    date: Joi.date().required(),
    name: Joi.string().alphanum().min(3).max(30).required(),
});

export { schemaCreateEvent, schemaUpdateEvent };