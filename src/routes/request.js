const express = require("express");
const authValidate = require("../middlewares/auth");
const Request = require("../models/request");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserID",
  authValidate,
  async (req, res) => {
    try {
      const { status, toUserID } = req.params;
      const fromUserID = req.user._id;
      const allowedValues = ["interested", "ignored"];

      if (!allowedValues.includes(status)) {
        return res.status(400).send("Invalid connection Request.");
      }

      const user = await User.findById(toUserID);

      if (!user) {
        return res.status(400).send("User not found.");
      }

      const request = await Request.findOne({
        $or: [
          { fromUserID, toUserID },
          { fromUserID: toUserID, toUserID: fromUserID },
        ],
      });

      if (request) {
        return res.status(400).send("Connection request already present.");
      }

      const newRequest = new Request({ fromUserID, toUserID, status });
      await newRequest.save();

      res.json({
        message: "Request sent successfully",
        request: newRequest,
      });
    } catch (err) {
      res.status(400).send(err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestID",
  authValidate,
  async (req, res) => {
    try {
      const { status, requestID } = req.params;
      const fromUserID = req.user._id;
      const allowedValues = ["accepted", "rejected"];

      if (!allowedValues.includes(status)) {
        return res.status(400).send("Invalid connection Request.");
      }

      const request = await Request.findOne({
        _id: requestID,
        toUserID: fromUserID,
        status: "interested",
      }).populate("fromUserID", "firstName lastName -_id");

      if (!request) {
        return res.status(400).send("Request not found.");
      }

      request.status = status
      const data = await request.save()
      res.json({
        message: `You have accepted ${data.fromUserID.firstName} ${data.fromUserID.lastName}'s request!!!`,
        request: data,
      });
    } catch (err) {
      res.status(400).send(err.message);
    }
  }
);

module.exports = requestRouter;
