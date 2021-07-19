const profileModel = require('../models/profileSchema')

module.exports = async (userId) => {
  let profile
  try {
    profile = await profileModel.findOne({ userId })
    return profile
  } catch (err) {
    console.log(err)
  }
}
