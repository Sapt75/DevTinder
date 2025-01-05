const express = require("express");
const authValidate = require("../middlewares/auth");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();

profileRouter.get("/profile", authValidate, (req, res) => {
  res.send(req.user);
});

profileRouter.get("/profile/all", authValidate, async (req, res) => {
  const users = await User.find();
  res.send(users);
});

profileRouter.patch("/profile/edit", authValidate , async (req, res) => {
  const data = req.body;


  const { firstName, lastName, photoUrl, about, skills } = data;

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
    await User.findByIdAndUpdate(req.user._id, {
      firstName,
      lastName,
      photoUrl,
      about,
      skills,
    });
    res.send("User data updated successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

profileRouter.patch("/profile/password", authValidate, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user._id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      throw new Error("Incorrect current password");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.send("Password updated successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
})

module.exports = profileRouter;
