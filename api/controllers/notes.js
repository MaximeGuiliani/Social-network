import {
  validate,
  schemaPostNoteFromHost,
  schemaPostNoteFromParticipant
} from "../validator/validatorsNotes.js";
import { myDAO } from "../../app.js";

import {
  sendBadRequest,
} from "../controllers/errors.js";

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
      sendBadRequest(res, err);
    });
}


// add note from host
export async function post_note_from_host(req, res, next) {
  const validNote = validate(schemaPostNoteFromHost.validate(req.body), res);
  if (validNote == null) {
    return;
  }
  await myDAO
    .add_note_from_host(
      validNote
    )
    .then(function (note) {
      res.status(201).json({
        message: "Note posted",
        note: note,
      });
    })
    .catch(function (err) {
      sendBadRequest(res, err.message);
    });
}

// add note from participant
export async function post_note_from_participant(req, res, next) {
  const validNote = validate(schemaPostNoteFromParticipant.validate(req.body), res);
  if (validNote == null) {
    return;
  }
  await myDAO
    .add_note_from_participant(
      validNote
    )
    .then(function (note) {
      res.status(201).json({
        message: "Note posted",
        note: note,
      });
    })
    .catch(function (err) {
      sendBadRequest(res, err.message);
    });
}