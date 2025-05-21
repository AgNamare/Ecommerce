import jwt from "jsonwebtoken";

export const verifyAdminJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) {
    return res.sendStatus(401);
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ADMIN_ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.sendStatus(403); // Token is not valid or expired
    }
    req.user = decoded.AdminInfo.email; // Ensure you access the correct property
    req.role = decoded.AdminInfo.role; // If you want to store the role
    next();
  });
};
