import jwt from "jsonwebtoken";

const authSeller = (req, res, next) => {
  try {
    const token = req.cookies?.sellerToken; // safe access

    if (!token) {
      return res.status(401).json({ success: false, message: "Not Authorized - No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.email) {
      return res.status(401).json({ success: false, message: "Not Authorized - Invalid token" });
    }

    req.seller = { email: decoded.email }; // attach seller info to req
    next();
  } catch (error) {
    console.error("Seller auth error:", error.message);

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ success: false, message: "Token expired" });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    } else {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }
};

export default authSeller;
