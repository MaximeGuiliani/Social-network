import {
  validate,
  schemaCreateEvent,
  schemaId,
  schemaUpdateEvent,
  schemaFilters,
} from "../validator/validatorsEvents.js";
import { myDAO } from "../../app.js";

import {
  sendBadRequest,
  sendServerError,
  sendAuthFailed,
  sendNotFound,
} from "../controllers/errors.js";

export async function event_get_all(req, res, next) {
  myDAO
    .get_all_events()
    .then(function (result) {
      res.status(200).json({
        code: 200,
        message: "Handling GET requests to /events : returning all events",
        events: result,
      });
    })
    .catch(function (err) {
      sendBadRequest(res, err);
    });
}

export async function event_create(req, res, next) {
  // req.body.organizerId = req.userData.id;
  const validatedEvent = validate(schemaCreateEvent.validate(req.body), res);
  if (validatedEvent == null) {
    return;
  }
  await myDAO
    .get_main_category_by_name(validatedEvent.MainCategory)
    .then(function (mainCategoryId) {
      if (mainCategoryId == null) {
        sendBadRequest(res, "Error this main category does not exist");
      } else {
        myDAO
          .save_event({
            MainCategoryId: mainCategoryId.id,
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
            sendBadRequest(res, err);
          });
      }
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
        sendNotFound(res, "Event not found");
        return;
      }
      res.status(200).json({
        message: "Handling GET requests to /events/" + req.params.eventId,
        event: event,
      });
    })
    .catch(function (err) {
     sendBadRequest(res, err);
    });
}

export async function event_update(req, res, next) {
  const validId = validate(schemaId.validate(req.params.eventId), res);
  if (validId == null) {
    return;
  }

  if (req.userData.id != (myDAO).get_event_by_id(validId).organizerId) {
    sendAuthFailed(res, "Unauthorized access");
    return;
  }

  const validUpdate = validate(schemaUpdateEvent.validate(req.body), res);
  if (validUpdate == null) {
    return;
  }
  validUpdate.validId = validId;

  await myDAO
    .update_event_by_id(
      validUpdate
    )
    .then(function (modifiedEvent) {
      res.status(200).json({
        message: "Updated event with id " + validId,
        modifiedEvent: validUpdate,
      });
    })
    .catch(function (err) {
      sendBadRequest(res, err);
    });
}

export async function event_delete(req, res, next) {
  const validId = validate(schemaId.validate(req.params.eventId), res);
  if (validId == null) {
    return;
  }

  if (req.userData.id != (await myDAO.get_event_by_id(validId).organizerId)) {
    sendAuthFailed(res, "Unauthorized access");
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
      sendBadRequest(res, err);
    });
}


// ___________________      C A N D I D A T E S      _________________________
//#region 
export async function event_apply(req, res, next) {
  const validId = validate(schemaId.validate(req.params.eventId), res);
  if (validId == null) {
    return;
  }
  await myDAO
  .apply( req.userData.id,validId)
  .then(function (result) {
    if (result == 0) {
      sendNotFound(res, "Event or User not found");
      return;
    }
    res.status(200).json({
      code: 200,
      eventId: validId,
      UserId: req.userData.id,
      message: "Your applications to event with id : " + validId+ " has been taken into account",
    });
  })
  .catch(function (err) {
    sendBadRequest(res, err);
  });
}


export async function event_unapply(req, res, next) {
  const validId = validate(schemaId.validate(req.params.eventId), res);
  if (validId == null) {
    return;
  }
  
  await myDAO
  .unapply(validId, req.userData.id)
  .then(function (result) {
    if (result == 0) {
      sendNotFound(res, "Event or User not found");
      return;
    }
    res.status(200).json({
      code: 200,
      eventId: validId,
      UserId: req.userData.id,
      message: "Your unapplications to event with id : " + validId+ " has been taken into account",
    });
  })
  .catch(function (err) {
    sendBadRequest(res, err);
  });
}

export async function event_get_candidates(req ,res,next ){
  const validId = validate(schemaId.validate(req.params.eventId), res);
  if (validId == null) {
    return;
  }
  
  await myDAO
  .get_all_candidates_from_event(req.params.eventId)
  .then(function (event) {
    if (event == 0) {
      sendNotFound(res, "Event not found");
      return;
    }
    console.log("event : ");
    console.log(event);
    res.status(200).json({
      code: 200,
      message: "Candidates for event with id : " + validId,
      candidates: event[0].candidates,
      });
    })
    .catch(function (err) {
      sendBadRequest(res, err);
    });
  }
  
  export async function event_accept_candidate(req, res, next) {
    const validId = validate(schemaId.validate(req.params.eventId), res);
    if (validId == null) {
      return;
    }
    const validUserId = validate(schemaId.validate(req.params.userId), res);
    if (validUserId == null) {
      return;
    }
    
    await myDAO
    .participate(req.params.userId,req.params.eventId)
    .then(function (result) {
      if (result == 0) {
        sendNotFound(res, "Event not found");
        return;
      }
      res.status(200).json({
        code: 200,
        message: "Accepted candidate for event with id : " + validId,
        accept_candidate: result,
      });
    })
    .catch(function (err) {
      sendBadRequest(res, err);
    });
  }
  
  //#endregion

  export async function event_refuse_candidate(req, res, next) {
  const validId = validate(schemaId.validate(req.params.eventId), res);
  if (validId == null) {
    return;
  }

  const validUserId = validate(schemaId.validate(req.params.userId), res);
  if (validUserId == null) {
    return;
  }

  await myDAO
    .unapply(req.params.userId , req.params.eventId )
    .then(function (result) {
      if (result == 0) {
        sendNotFound(res, "Event or user not found");
        return;
      }
      res.status(200).json({
        code: 200,
        message: "Refused candidate for event with id : " + validId,
      });
    })
    .catch(function (err) {
      sendBadRequest(res, err);
    });
}

export async function event_get_participants(req ,res,next ){
  const validId = validate(schemaId.validate(req.params.eventId), res);
  if (validId == null) {
    return;
  }

  await myDAO
    .get_all_participants_from_event(validId)
    .then(function (result) {
      if (result == 0) {
        sendNotFound(res, "Event not found");
        return;
      }
      res.status(200).json({
        code: 200,
        message: "Participants for event with id : " + validId,
        participants: result[0].participants,
      });
    })
    .catch(function (err) {
      sendBadRequest(res, err);
    });
}

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
      sendBadRequest(res, err);
    });
}


export async function event_remove_participant(req, res, next) {
  const validId = validate(schemaId.validate(req.params.eventId), res);
  if (validId == null) {
    return;
  }

  const validUsername = validate(schemaId.validate(req.params.username), res);
  if (validUsername == null) {
    return;
  }

  await myDAO
    .remove_participant(req.params.username, validId)
    .then(function (result) {
      if (result == 0) {
        sendNotFound(res, "Event not found");
        return;
      }
      res.status(200).json({
        code: 200,
        message: "Removed participant " + req.params.username + " from event with id : " + validId,
        removeParticipantInfo: result,
      });
    })
    .catch(function (err) {
      sendBadRequest(res, err);
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
      sendBadRequest(res, err);
    });
}


// _________________  Section des fonctions utilitaires  ______________________

function eventPublicData(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    bio: user.bio,
  };
}




