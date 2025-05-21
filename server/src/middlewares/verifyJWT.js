import jwt, { decode } from "jsonwebtoken";

export const verifyJWT = async (req, res, next) => {
  console.log("Verifying JWT middleware");
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) {
    console.log("No Authorization header found");
    return res.sendStatus(401);
  }
  const token = authHeader.split(" ")[1];
  console.log(`Token: ${token}`);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log("JWT verification failed:", err);
      return res.sendStatus(403); // Token is not valid or expired
    }
    console.log("JWT verification successful");
    req.user = decoded.email;
    next();
  });
};
