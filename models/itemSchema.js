const mongoose = require("mongoose")

module.exports = mongoose.model(
  "ItemModels",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    ownerId: {
      type: String,
      required: true,
    },
    buyerId: {
      type: String,
      required: true,
    },
    amtPaid: {
      type: Number,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    rarity: {
      type: Number,
      default: 0,
    },
  })
)
