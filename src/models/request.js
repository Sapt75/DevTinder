const { model, Schema } = require("mongoose");

const requestSchema = new Schema({
  fromUserID: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  toUserID: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["interested", "ignored", "accepted", "rejected"],
  },
});

requestSchema.index({ fromUserID: 1, toUserID: 1 });

requestSchema.pre("save", function (next) {
  if (this.fromUserID.equals(this.toUserID)) {
    throw new Error("Cannot send connection request to yourself!");
  }
  next();
});

const Request = model("request", requestSchema);

module.exports = Request;
