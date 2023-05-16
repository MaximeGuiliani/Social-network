import { myDAO } from "../../app.js";

import { sendAuthFailed, sendBadRequest } from "../controllers/errors.js";

export default async (req, res, next) => {
  const userId = req.userData.id;
  const eventId = req.params.eventId;

  console.log("userId : " + userId);
  await myDAO
    .get_event_by_id(eventId)
    .then(function (event) {
      if (userId != event.organizerId) {
        sendAuthFailed(res, "Unauthorized access");
        return;
      }
      next();
    })
    .catch(function (err) {
      sendBadRequest(res, err);
    });
};
