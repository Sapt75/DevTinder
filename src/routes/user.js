const express = require("express");
const authValidate = require("../middlewares/auth");
const Request = require("../models/request");

const userRouter = express.Router();

userRouter.get("/user/requests/received", authValidate, async (req, res) => {
  try {
    const fromUserID = req.user._id;

    const requests = await Request.find({
      toUserID: fromUserID,
      status: "interested",
    }).populate("fromUserID", "firstName lastName photoUrl skills -_id");

    res.send(requests);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

userRouter.get("/user/connections/accepted", authValidate, async (req, res) => {
  try {
    const user = req.user;

    const connections = await Request.find({
      $or: [{ fromUserID: user._id }, { toUserID: user._id }],
      status: "accepted",
    })
      .populate("fromUserID", "firstName lastName photoUrl skills")
      .populate("toUserID", "firstName lastName photoUrl skills");


    const data = connections.map((item) => {
        if(item.fromUserID.equals(user._id)) return item.toUserID
        else return item.fromUserID
    });

    res.send(data);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = userRouter;
