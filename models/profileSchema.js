const mongoose = require('mongoose')

module.exports = mongoose.model(
  'ProfileModels',
  new mongoose.Schema({
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    serverId: {
      type: String,
      required: true,
    },
    coins: {
      type: Number,
      default: 100,
    },
    items: {
      type: Array,
      default: [],
    },
    dailyRewardTime: {
      type: Number,
      default: 0,
    },
  })
)
