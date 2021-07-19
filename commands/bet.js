const usage = "Usage: eb <amount>"

module.exports = {
  name: "b",
  usage,
  description: "Bet a certain amount of coins to win or lose.",
  execute: async (ctx) => {
    if (ctx.args.length === 1) {
      let amt
      try {
        amt = parseInt(ctx.args[0])
      } catch (err) {
        ctx.message.reply("The bet must be an integer")
      }

      if (amt <= 0) {
        ctx.message.reply("The bet must be positive")
        return
      }
      if (amt > ctx.profile.coins) {
        ctx.message.reply("You cannot bet more coins than you have")
        return
      }

      const earned = Math.random() < 0.5 ? -amt : amt
      ctx.profile.coins += earned
      await ctx.profile.save()

      ctx.message.reply(
        `You ${earned > 0 ? "earned" : "lost"} ${Math.abs(earned)} coins`
      )
    } else {
      ctx.message.reply(usage)
    }
  },
}
