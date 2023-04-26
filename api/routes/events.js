import { Router } from "express";
import { Event } from "../../database/models/Event.js";
const router = Router();
import {schemaCreateEvent} from "../validator/validatorsEvents.js"; 


router.get("/", (req, res, next) => {
  // TODO recupérer tous les events de la base de données
  const events = [new Event(), new Event(), new Event()];
  res.status(200).json({
    message: "Handling GET requests to /events : returning all events",
    events: events,
  });
});

router.post("/create", (req, res, next) => {
  // TODO : vérifier que l'utilisateur est connecté
  // TODO : prendre l'id de la personne connecté si possible
  // TODO : validation des données
  // TODO : ajouter l'event a la BD si tout est valide
  
  const result = schemaCreateEvent.validate(req.body)
  if (result.error) {
    res.status(400).json({
      message: "Bad request",
      error: result.error,
    });
    return;
  }

  const validatedEvent = new Event();

  res.status(201).json({
    message: "Handling POST requests to /events/create",
    createdEvent: validatedEvent,
  });
});

router.get("/:eventId", (req, res, next) => {
  const id = req.params.eventId;
  // TODO : vérifier que l'id est bien un nombre
  // TODO : vérifier que l'id existe dans la base de données
  // TODO : récupérer l'event de la base de données
  const event = new Event();
  res.status(200).json({
    message: "Handling GET requests to /events/" + req.params.eventId,
    event: event,
  });
});

router.patch("/:eventId", (req, res, next) => {
  // TODO : validation des données
  // TODO : vérifier que eventID est un ID

  const modifiedEvent = new Event();

  res.status(200).json({
    message: "Updated event with id " + req.params.eventId,
    modifiedEvent: modifiedEvent,
  });
});

router.delete("/:eventId", (req, res, next) => {
  // TODO : vérifier que eventID est un ID
  // TODO : verifier que l'event existe dans la base de données
  // TODO : supprimer l'event de la base de données si tout est valide et que l'utilisateur est l'organisateur de l'event
  res.status(200).json({
    message: "Deleted event with id : " + req.params.eventId,
  });
});

export default router;