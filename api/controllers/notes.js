import {
  validate,
  schemaCreateEvent,
  schemaId,
  schemaUpdateEvent,
} from "../validator/validatorsEvents.js";
import { myDAO } from "../../app.js";

export async function get_note_by_noteId(req, res, next) {
  const validId = validate(schemaId.validate(req.params.noteId), res);
  if (validId == null) {
    return;
  }
  await myDAO
    .get_note_by_noteId(validId)
    .then(function (note) {
      if (note == null) {
        res.status(404).json({
          message: "Note not found",
        });
        return;
      }
      res.status(200).json({
        message: "Handling GET requests to /notes/" + req.params.noteId,
        note: note,
      });
    })
    .catch(function (err) {
      res.status(400).json({
        message: "Bad request",
        error: err,
      });
    });
}

export async function get_all_note_by_eventId(req, res, next) {
  const validId = validate(schemaId.validate(req.params.eventId), res);
  if (validId == null) {
    return;
  }
  await myDAO
    .get_all_note_by_eventId(validId)
    .then(function (note) {
      if (note == null) {
        res.status(404).json({
          message: "Note not found",
        });
        return;
      }
      res.status(200).json({
        code: 200,
        message: "Handling GET requests to /notes/" + req.params.eventId,
        note: note,
      });
    })
    .catch(function (err) {
      res.status(400).json({
        message: "Bad request",
        error: err,
      });
    });
}

export async function get_all_notes_by_username(req, res, next) {
  const validUsername = validate(
    schemaUsername.validate(req.params.username),
    res
  );
  if (validUsername == null) {
    return;
  }
  await myDAO
    .get_all_notes_by_username(validUsername)
    .then(function (notes) {
      if (notes == null) {
        res.status(404).json({
          message: "Notes not found",
        });
        return;
      }
      res.status(200).json({
        message: "Handling GET requests to /notes/" + req.params.username,
        notes: notes,
      });
    })
    .catch(function (err) {
      res.status(400).json({
        message: "Bad request",
        error: err,
      });
    });
}

export async function get_mean_and_count_all_notes_by_username(req, res, next) {
  const validId = validate(schemaId.validate(req.params.noteId), res);
  if (validId == null) {
    return;
  }
  await myDAO
    .get_mean_and_count_all_notes_by_username(validId)
    .then(function (note) {
      if (note == null) {
        res.status(404).json({
          message: "Note not found",
        });
        return;
      }
      res.status(200).json({
        message: "Handling GET requests to /notes/" + req.params.noteId,
        note: note,
      });
    })
    .catch(function (err) {
      res.status(400).json({
        message: "Bad request",
        error: err,
      });
    });
}

export async function get_mean_and_count_all_notes_by_eventId(req, res, next) {
  const validId = validate(schemaId.validate(req.params.eventId), res);
  if (validId == null) {
    return;
  }
  await myDAO
    .get_mean_and_count_all_notes_by_eventId(validId)
    .then(function (note) {
      if (note == null) {
        res.status(404).json({
          message: "Note not found",
        });
        return;
      }
      res.status(200).json({
        code: 200,
        message: "Handling GET requests to /notes/" + req.params.eventId,
        note: note,
      });
    })
    .catch(function (err) {
      res.status(400).json({
        message: "Bad request",
        error: err,
      });
    });
}

export async function get_all_notes_from_username(req, res, next) {
    const validUsername = validate(
        schemaUsername.validate(req.params.username),
        res
    );
    if (validUsername == null) {
        return;
    }
    await myDAO
        .get_all_notes_from_username(validUsername)
        .then(function (notes) {
        if (notes == null) {
            res.status(404).json({
            message: "Notes not found",
            });
            return;
        }
        res.status(200).json({
            message: "Handling GET requests to /notes/" + req.params.username,
            notes: notes,
        });
        })
        .catch(function (err) {
        res.status(400).json({
            message: "Bad request",
            error: err,
        });
        });
    }

