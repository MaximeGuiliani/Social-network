import Joi from "joi";

const schemaRelationship= Joi.object().keys({
  userId: Joi.number().integer().required(),
  eventId: Joi.number().integer().required(),
});


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
    zip: Joi.string().required(),
  },
  mainCategoryId: Joi.number().required(),
});

const schemaUpdateEvent = Joi.object().keys({
  eventId: Joi.number().integer().required(),
  participants_number: Joi.number().integer(),
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
  organizerId:Joi.number().integer(),
  MainCategoryId: Joi.number().integer(),
});

// verify that an objetc is an id
const schemaId = Joi.number().integer().required();

const schemaUserIdANDEventId = Joi.object().keys({
  userId: Joi.string().required(),
  eventId: Joi.number().integer().required(),
});

const schemaFilters = Joi.object().keys({
  event_name: Joi.string().max(40).optional(),
  description: Joi.string().max(300).optional(),
  category: Joi.string().max(40).optional(),
  MainCategoryId: Joi.number().integer().optional(),
  
    range_date_min: Joi.date().optional(),
    range_date_max: Joi.date().optional(),
  
    range_places_min: Joi.number().integer().optional(),
    range_places_max: Joi.number().integer().optional(),

    street: Joi.string().optional(),
    city: Joi.string().optional(),
    country: Joi.string().optional(),
    zip: Joi.string().optional(),

  username: Joi.string().max(30).optional(),
  nb_places_wanted: Joi.number().integer().optional(),
  score_host_min: Joi.number().integer().optional(),
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
  schemaRelationship,
  validate,
};
