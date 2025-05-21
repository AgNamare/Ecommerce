export const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.role) {
      return res.sendStatus(401);
    }

    const rolesArray = [...allowedRoles];

    if (!rolesArray.includes(req.role)) {
      return res.sendStatus(403); // Use 403 Forbidden
    }

    next();
  };
};
