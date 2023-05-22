import { validate, schemaMessage } from "../validator/validatorsMessages.js";
import { myDAO } from "../../app.js";
import { schemaId } from "../validator/validatorsEvents.js";

export async function add_messages_to_event(req, res, next) {
  const validMessage = validate(schemaMessage.validate(req.body), res);
  if (validMessage == null) {
    return;
  }

  myDAO
    .add_message(validMessage)
    .then(function (result) {
      res.status(201).json({
        code: 201,
        message: "Message posted",
        result: result,
      });
    })
    .catch(function (err) {
      sendBadRequest(res, err.message);
    });
}

export async function get_all_messages_from_event(req, res, next) {
  const validId = validate(schemaId.validate(req.params.eventId), res);
  if (validId == null) {
    return;
  }
  myDAO
    .get_all_messages_from_event(validId)
    .then(function (result) {
      res.status(200).json({
        code: 200,
        messages: result,
      });
    })
    .catch(function (err) {
      sendBadRequest(res, err.message);
    });
}
