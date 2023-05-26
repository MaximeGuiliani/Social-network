import {
  validate,
  schemaCreateEvent,
  schemaId,
  schemaUpdateEvent,
  schemaFilters,
  schemaUserIdANDEventId,
  schemaEventRelatedToUser,
} from "../validator/validatorsEvents.js";
import { myDAO } from "../../app.js";

import {
  sendBadRequest,
  sendServerError,
  sendAuthFailed,
  sendNotFound,
} from "../controllers/errors.js";

// get all events or get event related to user
export async function event_get(req, res, next) {
  if (req.query.eventId == null) {
    await myDAO
      .get_all_events()
      .then(function (result) {
        res.status(200).json({
          code: 200,
          message: "Handling GET requests to /events : returning all events",
          events: result,
        });
      })
      .catch(function (err) {
        sendBadRequest(res, err.message);
      });
  } else {
    const validParams = validate(
      schemaEventRelatedToUser.validate(req.query),
      res
    );
    if (validParams == null) {
      return;
    }
    await myDAO
      .get_event_with_related_users(validParams)
      .then(function (result) {
        res.status(200).json({
          code: 200,
          message:
            "Handling GET requests to /events : returning events with related users",
          events: result,
        });
      })
      .catch(function (err) {
        sendBadRequest(res, err.message);
      });
  }
}

// create an event
export async function event_create(req, res, next) {
  const validatedEvent = validate(schemaCreateEvent.validate(req.body), res);
  if (validatedEvent == null) {
    return;
  }
  await myDAO
    .get_main_category_by_id(validatedEvent.mainCategoryId)
    .then(function (mainCategory) {
      if (mainCategory == null) {
        sendBadRequest(res, "Error this main category does not exist");
      } else {
        myDAO
          .save_event({
            MainCategoryId: mainCategory.id,
            participants_number: validatedEvent.participants_number,
            category: validatedEvent.category,
            description: validatedEvent.description,
            name: validatedEvent.name,
            date: validatedEvent.date,
            organizerId: req.userData.id,
            image_url: validatedEvent.image_url,
            address: validatedEvent.address,
          })
          .then(function (createdEvent) {
            res.status(201).json({
              code: 201,
              message: "Handling POST requests to /events/create",
              createdEvent: createdEvent,
            });
          })
          .catch(function (err) {
            sendBadRequest(res, err.message);
          });
      }
    });
}

// update an event
export async function event_update(req, res, next) {
  req.body.eventId = req.params.eventId;
  req.body.organizerId = req.userData.id;
  const validUpdate = validate(schemaUpdateEvent.validate(req.body), res);
  if (validUpdate == null) {
    return;
  }
  await myDAO
    .update_event_by_id(validUpdate)
    .then(function (modifiedEvent) {
      res.status(200).json({
        message: "Updated event with id " + req.body.eventId,
        modifiedEvent: modifiedEvent,
      });
    })
    .catch(function (err) {
      sendBadRequest(res, err.message);
    });
}

// delete an event
export async function event_delete(req, res, next) {
  const validId = validate(schemaId.validate(req.params.eventId), res);
  if (validId == null) {
    return;
  }
  await myDAO
    .remove_event_by_id(validId)
    .then(function (result) {
      if (result == 0) {
        sendNotFound(res, "Event not found");
        return;
      }
      res.status(200).json({
        message: "Deleted event with id : " + validId,
      });
    })
    .catch(function (err) {
      sendBadRequest(res, err.message);
    });
}

// apply to event
export async function event_apply(req, res, next) {
  const validId = validate(schemaId.validate(req.params.eventId), res);
  if (validId == null) {
    return;
  }
  await myDAO
    .apply(req.userData.id, validId)
    .then(function (result) {
      if (result == 0) {
        sendNotFound(res, "Event or User not found");
        return;
      }
      res.status(200).json({
        code: 200,
        eventId: validId,
        UserId: req.userData.id,
        message:
          "Your applications to event with id : " +
          validId +
          " has been taken into account",
      });
    })
    .catch(function (err) {
      sendBadRequest(res, err.message);
    });
}

// unapply to event
export async function event_unapply(req, res, next) {
  const validEventId = validate(schemaId.validate(req.params.eventId), res);
  if (validEventId == null) {
    return;
  }

  await myDAO
    .unapply(req.userData.id, validEventId)
    .then(function (result) {
      if (result == 0) {
        sendNotFound(res, "Event or User not found");
        return;
      }
      res.status(200).json({
        code: 200,
        eventId: validEventId,
        UserId: req.userData.id,
        message:
          "Your unapplications to event with id : " +
          validEventId +
          " has been taken into account",
      });
    })
    .catch(function (err) {
      sendBadRequest(res, err.message);
    });
}

// accept candidate for event
export async function event_accept_candidate(req, res, next) {
  const validUserIdANDEventId = validate(
    schemaUserIdANDEventId.validate(req.params),
    res
  );
  if (validUserIdANDEventId == null) {
    return;
  }
  await myDAO
    .participate(validUserIdANDEventId.userId, validUserIdANDEventId.eventId)
    .then(function (result) {
      if (result == 0) {
        sendNotFound(res, "Event not found");
        return;
      }
      res.status(200).json({
        code: 200,
        message:
          "Accepted candidate for event with id : " +
          validUserIdANDEventId.eventId,
        accept_candidate: result,
      });
    })
    .catch(function (err) {
      sendBadRequest(res, err.message);
    });
}

// refuse candidate for event
export async function event_refuse_candidate(req, res, next) {
  const validUserIdANDEventId = validate(
    schemaUserIdANDEventId.validate(req.params),
    res
  );
  if (validUserIdANDEventId == null) {
    return;
  }

  await myDAO
    .unapply(validUserIdANDEventId.userId, validUserIdANDEventId.eventId)
    .then(function (result) {
      if (result == 0) {
        sendNotFound(res, "Event or user not found");
        return;
      }
      res.status(200).json({
        code: 200,
        message:
          "Refused candidate for event with id : " +
          validUserIdANDEventId.userId,
      });
    })
    .catch(function (err) {
      sendBadRequest(res, err.message);
    });
}

// unparticipate to event
export async function event_unparticipate(req, res, next) {
  const validId = validate(schemaId.validate(req.params.eventId), res);
  if (validId == null) {
    return;
  }

  await myDAO
    .unparticipate(req.userData.id, validId)
    .then(function (result) {
      if (result == 0) {
        sendNotFound(res, "Event not found");
        return;
      }
      res.status(200).json({
        code: 200,
        message: "Unparticipated to event with id : " + validId,
        unparticipateInfo: result,
      });
    })
    .catch(function (err) {
      sendBadRequest(res, err.message);
    });
}

// remove participant from event
export async function event_remove_participant(req, res, next) {
  const validUserIdANDEventId = validate(
    schemaUserIdANDEventId.validate(req.params),
    res
  );
  if (validUserIdANDEventId == null) {
    return;
  }
  await myDAO
    .unparticipate(validUserIdANDEventId.userId, validUserIdANDEventId.eventId)
    .then(function (result) {
      if (result == 0) {
        sendNotFound(res, "Event not found");
        return;
      }
      res.status(200).json({
        code: 200,
        message:
          "Removed participant " +
          validUserIdANDEventId.userId +
          " from event with id : " +
          validUserIdANDEventId.eventId,
        removeParticipantInfo: result,
      });
    })
    .catch(function (err) {
      sendBadRequest(res, err.message);
    });
}

// search events by filters
export async function event_get_by_filters(req, res, next) {
  const validFilters = validate(schemaFilters.validate(req.query), res);
  if (validFilters == null) {
    return;
  }
  await myDAO
    .get_events_by_filters(validFilters)
    .then(function (result) {
      res.status(200).json({
        code: 200,
        message: "Handling GET requests to /events : returning all events",
        events: result,
      });
    })
    .catch(function (err) {
      sendBadRequest(res, err.message);
    });
}

export async function event_get_upcoming(req, res, next) {
  await myDAO
    .get_upcoming_events(req.query)
    .then(function (result) {
      res.status(200).json({
        code: 200,
        message:
          "Handling GET requests to /events/upcoming : returning all upcoming events",
        events: result,
      });
    })
    .catch(function (err) {
      sendBadRequest(res, err.message);
    });
}
