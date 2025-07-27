import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt; // get cookie named "jwt"

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    // Verify the token using your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user info to the request
    req.userId = decoded.userId;

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};