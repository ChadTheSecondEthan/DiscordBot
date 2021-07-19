const mongoose = require("mongoose")

module.exports = mongoose.model(
  "StaticDataModels",
  new mongoose.Schema({
    curItemId: {
      type: Number,
      default: 0,
    },
  })
)
