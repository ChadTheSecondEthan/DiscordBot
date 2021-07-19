const profileModel = require("../../models/profileSchema")

module.exports = async (client, member) => {
  let profile = await profileModel.create({
    userId: member.id,
    serverId: member.guild.id,
  })
  await profile.save()
}
