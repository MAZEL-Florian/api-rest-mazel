const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["ADMIN", "USER", "RESTAURANT"],
      required: true,
      default: "USER",
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: false,
    },
  },
  { timestamps: true }
);
Schema.methods.toJSON = function () {
  return {
    _id: this._id,
    email: this.email,
    role: this.role,
    restaurant: this.restaurant,
  };
};

module.exports = mongoose.model("User", Schema);
