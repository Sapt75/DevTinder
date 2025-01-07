const express = require("express");
const authValidate = require("../middlewares/auth");
const Request = require("../models/request");
const User = require("../models/user");

const userRouter = express.Router();

const queryString = "firstName lastName photoUrl skills";

userRouter.get("/user/requests/received", authValidate, async (req, res) => {
  try {
    const fromUserID = req.user._id;

    const requests = await Request.find({
      toUserID: fromUserID,
      status: "interested",
    }).populate("fromUserID", queryString);

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
      .populate("fromUserID", queryString)
      .populate("toUserID", queryString);

    const data = connections.map((item) => {
      if (item.fromUserID.equals(user._id)) return item.toUserID;
      else return item.fromUserID;
    });

    res.send(data);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

userRouter.get("/user/feed", authValidate, async (req, res) => {
  try {
    const user = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;

    const connections = await Request.find({
      $or: [{ fromUserID: user._id }, { toUserID: user._id }],
    }).select("fromUserID toUserID -_id");

    const userFilter = new Set();

    connections.forEach((connection) => {
      userFilter.add(connection.fromUserID.toString());
      userFilter.add(connection.toUserID.toString());
    });

    const feed = await User.find({
      $and: [
        { _id: { $nin: Array.from(userFilter) } },
        { _id: { $ne: user._id } },
      ],
    })
      .select(queryString)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json(feed);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = userRouter;
