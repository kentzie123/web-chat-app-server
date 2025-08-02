import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.chat_token; // get cookie named "chat_token"

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    // Verify the token using your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user info to the request
    req.user = decoded.user;
    
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};