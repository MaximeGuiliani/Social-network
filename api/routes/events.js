import { Router } from "express";
import { Event } from "../../database/models/Event.js";
const router = Router();
import {
  validate,
  schemaCreateEvent,
  schemaId,
  schemaUpdateEvent,
} from "../validator/validatorsEvents.js";
import { myDAO } from "../../app.js";

router.get("/", async (req, res, next) => {
  (await myDAO)
    .get_all_events()
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
});

router.post("/create", async (req, res, next) => {
  // TODO : vérifier que l'utilisateur est connecté & prendre l'id de la personne connecté si possible
  const validatedEvent = validate(schemaCreateEvent.validate(req.body), res);
  if (validatedEvent == null) {
    return;
  }
  const event = new Event(validatedEvent);
  await (
    await myDAO
  )
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
});

router.get("/:eventId", async (req, res, next) => {
  const validId = validate(schemaId.validate(req.params.eventId), res);
  if (validId == null) {
    return;
  }
  (await myDAO)
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
});

router.patch("/:eventId", async (req, res, next) => {
  // TODO : regarder si l'utilisateur est l'organisateur de l'event

  const validId = validate(schemaId.validate(req.params.eventId), res);
  if (validId == null) {
    return;
  }
  const validUpdate = validate(schemaUpdateEvent.validate(req.body), res);
  if (validUpdate == null) {
    return;
  }

  (await myDAO)
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
});

router.delete("/:eventId", async (req, res, next) => {
  const validId = validate(schemaId.validate(req.params.eventId), res);
  if (validId == null) {
    return;
  }
  // TODO : vérifier que l'id de l'event appartiens bien à l'utilisateur connecté
  (await myDAO)
    .remove_event_by_id(validId)
    .then(function (result) {
      res.status(200).json({
        message: "Deleted event with id : " + validId,
        result: result,
      });
    })
    .catch(function (err) {
      res.status(400).json({
        message: "Bad request",
        error: err,
      });
    });
});

export default router;
