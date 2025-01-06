const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");
const authValidate = require("../middlewares/auth");

authRouter.post("/signup", async (req, res) => {
  let data = req.body;

  try {
    const fields = [
      "firstName",
      "lastName",
      "email",
      "password",
      "photoUrl",
      "about",
      "skills",
      "age",
      "gender",
    ];

    const isAllowed = Object.keys(data).every((key) => fields.includes(key));

    if (!isAllowed) {
      throw new Error("Invalid fields present in the document.");
    }

    const user = await User.find({ email: data.email });

    if (user.length > 0) {
      throw new Error("User already exists.");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;
    const newUser = new User(data);
    await newUser.save();
    res.send("User saved successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found.");
    }

    await user.validatePassword(password)

    const token = await user.createJWT()

    res.cookie("token", token);

    res.send("Logged in successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

authRouter.get("/logout", authValidate, (req, res) => {
  res.clearCookie("token");
  res.send("Logged out successfully");
});

module.exports = authRouter;
