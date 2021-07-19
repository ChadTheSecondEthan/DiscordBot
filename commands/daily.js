function timeString(millis) {
  const seconds = millis / 1000
  const minutes = Math.ceil(seconds / 60)
  const hours = Math.ceil(minutes / 60)
  return hours ? `${hours} hours` : `${minutes} minutes`
}

module.exports = {
  name: 'daily',
  description: 'Redeem each day for some coins',
  execute: async (ctx) => {
    const now = Date.now()
    if (now - ctx.profile.dailyRewardTime > 86400000) {
      ctx.profile.dailyRewardTime = now
      const coins = Math.floor(Math.random() * 10) + 10
      ctx.profile.coins += coins
      ctx.message.reply(`You earned ${coins} coins!`)
      await ctx.profile.save()
    } else
      ctx.message.reply(
        `You must wait \`${timeString(
          86400000 + ctx.profile.dailyRewardTime - now
        )}\` before collecting your daily reward`
      )
  },
}
