import User from "../models/user.model.js";
export const requireFeature = (featureKey) => {
  return async (req, res, next) => {
    const user = await User.findById(req.user.id);
// Debugging line
    const hasAccess = user.access.includes(featureKey);
   

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    next();
  };
};