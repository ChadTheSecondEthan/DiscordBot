module.exports = {
  name: "c",
  description: "Displays your coins",
  execute(ctx) {
    ctx.message.reply(`You have ${ctx.profile.coins} coins`)
  },
}
