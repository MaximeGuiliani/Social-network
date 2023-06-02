export function sendServerError(res, err) {
  return res.status(500).json({
    code: 500,
    message: err.message,
    errorSrc: err,
  });
}

export function sendBadRequest(res, err) {
  return res.status(400).json({
    code: 400,
    message: err.message,
    errorSrc: err,
  });
}

export function sendAuthFailed(res, err) {
  return res.status(401).json({
    code: 401,
    message: err.message,
    errorSrc: err,
  });
}

export function sendNotFound(res, err) {
  return res.status(404).json({
    code: 404,
    message: err.message,
    errorSrc: err,
  });
}

export function sendForbidden(res, err) {
  return res.status(403).json({
    code: 403,
    message: err.message,
    errorSrc: err,
  });
}
