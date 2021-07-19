const getProfile = require('../util/getProfile')
const getUserFromMention = require('../util/getUserFromMention')

module.exports = async (ctx, mention, replyWithErrors = true) => {
  if (!mention) return

  const user = getUserFromMention(ctx.client, mention)
  if (!user || user.bot) {
    if (replyWithErrors) ctx.message.reply('No player is found with that id')
    return
  }

  const profile = await getProfile(user.id)
  if (!profile) {
    if (replyWithErrors) ctx.message.reply('Invalid user id')
    return
  }

  return profile
}
