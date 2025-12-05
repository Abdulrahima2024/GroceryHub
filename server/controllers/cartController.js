import User from "../models/User.js";

// Update User CartData: /api/cart/update
export const updateCart = async (req, res) => {
  try {
    const userId = req.user?.id; // ✅ get user ID from auth middleware
    const { cartItems } = req.body; // frontend sends only cartItems

    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    await User.findByIdAndUpdate(userId, { cartItems });

    res.json({ success: true, message: "Cart Updated" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
