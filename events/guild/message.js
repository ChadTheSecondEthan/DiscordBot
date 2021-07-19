const getOrCreateProfile = require('../../util/getOrCreateProfile')
const getUserFromMention = require('../../util/getUserFromMention')
require('dotenv').config()

function getMentions(client, args) {
  const mentions = []
  for (let i = 0; i < args.length; i++) {
    const user = getUserFromMention(client, args[i])
    if (user) {
      mentions.push(user)
      args.splice(i, 1)
      i--
    }
  }
  return mentions
}

module.exports = async (client, message) => {
  message.content = message.content.toLowerCase()

  if (!message.content.startsWith(process.env.PREFIX) || message.author.bot)
    return

  const profile = await getOrCreateProfile(message.author.id, message.guild.id)

  const args = message.content.split(' ')
  const command = args.shift()

  const hasAdmin = message.member.roles.cache.find(
    (role) => role.name === 'admin'
  )

  const ctx = {
    client,
    profile,
    message,
    args,
    hasAdmin,
    mentions: getMentions(client, args),
  }

  const action = client.commands.get(command)
  if (command && action) {
    for (let i = 0; i < args.length; i++)
      if (args[i] === 'help') {
        args.splice(i, 1)
        action.help(ctx)
        return
      }

    const requireAdmin = action.adminOnly
    if (!requireAdmin) await action.execute(ctx)
    else {
      if (hasAdmin) await action.execute(ctx)
      else message.reply('You do not have the admin privelage')
    }
  }
}
