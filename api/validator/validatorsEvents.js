import Joi from "joi";

const schemaCreateEvent = Joi.object().keys({
  participants_number: Joi.number().integer().required(),
  category: Joi.string().required(),
  description: Joi.string().max(300).required(),
  image_url: Joi.string().uri(),
  name: Joi.string().max(30).required(),
  date: Joi.date().required(),
  address: {
    street: Joi.string().required(),
    city: Joi.string().required(),
    country: Joi.string().required(),
    zip: Joi.number().integer().required(),
  },
  MainCategory: Joi.string().required(),
});

const schemaUpdateEvent = Joi.object().keys({
  participants_number: Joi.number().integer().min(1).max(100).required(),
  category: Joi.string().alphanum().min(3).max(30),
  address: {
    street: Joi.string().required(),
    city: Joi.string().required(),
    country: Joi.string().required(),
    zip: Joi.number().integer().required(),
  },
  description: Joi.string().min(0).max(300),
  image_url: Joi.string().min(3),
  date: Joi.date().required(),
  name: Joi.string().min(3).max(30).required(),
});

// verify that an objetc is an id
const schemaId = Joi.number().integer().required();

const schemaUserIdANDEventId = Joi.object().keys({
  userId: Joi.string().required(),
  eventId: Joi.number().integer().required(),
});

const schemaFilters = Joi.object().keys({
  nb_places_wanted: Joi.number().integer().min(1),
  category: Joi.string().alphanum().min(3).max(30),
  range_places: Joi.object().keys({
    min: Joi.number().integer().required(),
    max: Joi.number().integer().required(),
  }),
  address: Joi.object().keys({
    street: Joi.string(),
    city: Joi.string(),
    country: Joi.string(),
    zip: Joi.number().integer(),
  }),
  description: Joi.string().min(0).max(300),
  event_name: Joi.string().min(3).max(30),
  username: Joi.string().min(3).max(30),
  range_date: Joi.date(),
  date: Joi.date(),
  score_host_min: Joi.number().integer().min(1).max(5),
  MainCategoryId: Joi.string().min(3).max(30),
});

const schemaEventRelatedToUser = Joi.object().keys({
  eventId: Joi.number().integer().required(),
  include_organizer: Joi.boolean(),
  include_candidates: Joi.boolean(),
  include_participants: Joi.boolean(),
  include_notes: Joi.boolean(),
  include_messages: Joi.boolean(),
  // include_Address: Joi.boolean(),
  // include_MainCategory: Joi.boolean(),
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
  schemaCreateEvent,
  schemaUpdateEvent,
  schemaId,
  schemaFilters,
  schemaUserIdANDEventId,
  schemaEventRelatedToUser,
  validate,
};
