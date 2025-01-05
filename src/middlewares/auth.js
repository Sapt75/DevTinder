const jwt = require("jsonwebtoken");
const User = require("../models/user");

async function authValidate(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "You are not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, "devTinder");

    const user = await User.findById(decoded._id);

    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = authValidate;
