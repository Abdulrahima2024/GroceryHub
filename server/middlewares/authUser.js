import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authUser = async (req, res, next) => {
  //const { token } = req.cookies;

  let token = req.cookies.token;

  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not Authorized - No token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded?.id) {
      //req.user = { id: decoded.id }; // Add user ID to req
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(401).json({ success: false, message: "User not found" });
      }

      req.user = user; // now req.user._id exists
      next();
    } else {
      return res.status(401).json({ success: false, message: 'Not Authorized - Invalid token' });
    }
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token verification failed' });
  }
};

export default authUser;
