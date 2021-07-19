const profileModel = require('../models/profileSchema')

module.exports = async (userId, serverId) => {
  let profile
  try {
    profile = await profileModel.findOne({ userId })
    if (!profile) {
      profile = await profileModel.create({
        userId,
        serverId,
      })
    }
    await profile.save()
    return profile
  } catch (err) {
    console.log(err)
  }
}
