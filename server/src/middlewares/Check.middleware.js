import User from "../models/user.model.js";
import Role from "../models/role.model.js";

export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate("role");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const allowedRoles = ["admin", "masterAdmin"];

    if (!allowedRoles.includes(user.role.name)) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};