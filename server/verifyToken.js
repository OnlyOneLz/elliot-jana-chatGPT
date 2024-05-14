const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "No token provided." });
  }
  jwt.verify(
    token.replace("Bearer ", ""),
    process.env.JWT_SECRET_KEY,
    (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token." });
      }
      req.userId = decoded.userId;
      next();
    }
  );
}

module.exports = verifyToken
