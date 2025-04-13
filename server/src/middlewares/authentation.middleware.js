import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Assuming the token contains the user ID
    next();
  } catch (error) {
    return res.status(400).json({ message: 'Invalid token.' });
  }
};
