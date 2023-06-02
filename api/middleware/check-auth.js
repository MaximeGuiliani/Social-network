import jwt from "jsonwebtoken";

export default (req, res, next) => {
  try {
    let privateKey = "PrivateKeyForTestOnly"

    if ( process.env.JWT_KEY != null) {
      privateKey = process.env.JWT_KEY;
    }
    const decoded = jwt.verify(
      req.headers.authorization.split(" ")[1],
      privateKey
    );
    req.userData = decoded;
    next();
  } catch (error) {
    sendAuthFailed(res, "Auth failed");
  }
};
