const getProfile = require('../util/getProfile')

module.exports = {
  name: 'r',
  adminOnly: true,
  execute: async (ctx) => {
    let profileChange = false
    if (ctx.mentions[0]) {
      if (!ctx.hasAdmin) {
        ctx.message.reply('Reseting another user requires admin')
        return
      }

      const profile = await getProfile(ctx.mentions[0].id)
      if (profile) {
        ctx.profile = profile
        profileChange = true
      }
    }

    ctx.profile.coins = 1000
    ctx.profile.items = []
    ctx.profile.dailyRewardTime = 0
    await ctx.profile.save()
    ctx.message.reply(
      'Stats reset' + (profileChange ? ' for ' + ctx.args[0] : '')
    )
  },
}
