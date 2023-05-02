import { Event } from "../../database/models/Event.js";
import {
  validate,
  schemaCreateEvent,
  schemaId,
  schemaUpdateEvent,
} from "../validator/validatorsEvents.js";
import { myDAO } from "../../app.js";

export async function event_get_all(req, res, next) {
   myDAO.get_all_events()
    .then(function (result) {
      res.status(200).json({
        message: "Handling GET requests to /events : returning all events",
        events: result,
      });
    })
    .catch(function (err) {
      res.status(400).json({
        message: "Bad request",
        error: err,
      });
    });
}


export async function event_create(req, res, next) {
  req.body.organizerId = req.userData.id;
  const validatedEvent = validate(schemaCreateEvent.validate(req.body), res);
  if (validatedEvent == null) {
    return;
  }
  const event = new Event(validatedEvent);
  await myDAO
    .save_event(event)
    .then(function (result) {
      res.status(201).json({
        message: "Handling POST requests to /events/create",
        createdEvent: event,
      });
    })
    .catch(function (err) {
      res.status(400).json({
        message: "Bad request",
        error: err,
      });
    });
}

export async function event_get_by_id(req, res, next) {
  const validId = validate(schemaId.validate(req.params.eventId), res);
  if (validId == null) {
    return;
  }
  await myDAO
    .get_event_by_id(validId)
    .then(function (event) {
      if (event == null) {
        res.status(404).json({
          message: "Event not found",
        });
        return;
      }
      res.status(200).json({
        message: "Handling GET requests to /events/" + req.params.eventId,
        event: event,
      });
    })
    .catch(function (err) {
      res.status(400).json({
        message: "Bad request",
        error: err,
      });
    });
}

export async function event_update(req, res, next) {
  const validId = validate(schemaId.validate(req.params.eventId), res);
  if (validId == null) {
    return;
  }

  if (req.userData.id != (await myDAO).get_event_by_id(validId).organizerId) {
    res.status(401).json({
      message: "Unauthorized access",
    });
    return;
  }

  const validUpdate = validate(schemaUpdateEvent.validate(req.body), res);
  if (validUpdate == null) {
    return;
  }

  await myDAO
    .update_event_by_id(
      validId,
      validUpdate.name,
      validUpdate.category,
      validUpdate.address,
      validUpdate.description,
      validUpdate.image_url
    )
    .then(function (modifiedEvent) {
      res.status(200).json({
        message: "Updated event with id " + validId,
        modifiedEvent: validUpdate,
      });
    })
    .catch(function (err) {
      res.status(400).json({
        message: "Bad request",
        error: err,
      });
    });
}

export async function event_delete(req, res, next) {
  const validId = validate(schemaId.validate(req.params.eventId), res);
  if (validId == null) {
    return;
  }

  if (req.userData.id != await myDAO.get_event_by_id(validId).organizerId) {
    res.status(401).json({
      message: "Unauthorized access",
    });
    return;
  }

  await myDAO
    .remove_event_by_id(validId)
    .then(function (result) {
      if (result == 0) {
        res.status(404).json({
          message: "Event not found",
        });
        return;
      }
      res.status(200).json({
        message: "Deleted event with id : " + validId,
      });
    })
    .catch(function (err) {
      res.status(400).json({
        message: "Bad request",
        error: err,
      });
    });
}
