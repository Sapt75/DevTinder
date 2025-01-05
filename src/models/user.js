const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 30,
  },
  lastName: {
    type: String,
    required: true,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 100,
  },
  photoUrl: {
    type: String,
    default:
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngarts.com%2Fexplore%2Ftag%2Fdefault-profile-picture&psig=AOvVaw3HByMXzjADlcaUl8dVfQ3h&ust=1736157283705000&source=images&cd=vfe&opi=89978449&ved=2ahUKEwj-gtCCqN6KAxV-bmwGHeP_AnEQjRx6BAgAEBk",
  },
  about: {
    type: String,
    default: "This is the default about!!",
    maxlength: 500,
  },
  skills: {
    type: [String],
    length: 10,
  },
  age: {
    type: Number,
    required: true,
    min: 18,
    max: 100,
  },
  gender: {
    type: String,
    required: true,
    lowercase: true,
    enum: ["male", "female", "other"],
  },
});

const User = model("user", userSchema);

module.exports = User;
