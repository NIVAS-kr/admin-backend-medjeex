const User = require("../models/user");
const jwt = require("jsonwebtoken");
exports.isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    console.log(token);
    if (!token) {
      return res.status(401).json({
        success:false,
        message: "Please Log in first",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded._id);
    if(!req.user){
        return res.status(401).json({
            success:false,
            message: "Please Log in first",
        });
    }
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({
        success:false,
        message: "Please Log in first",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded._id);
    if(!req.user){
        return res.status(401).json({
            success:false,
            message: "Please Log in first",
        });
    }
    if(req.user.role !== 'admin'){
        return res.status(403).json({
            success:false,
            message: "You are not authorized to access this route",
        });
    }
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
