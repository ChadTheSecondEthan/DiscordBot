// const generateItem = require("../items/generateItem")

// const usage = "Usage: emb <amount of items> <price per item>"

// module.exports = {
//   name: "mb",
//   usage,
//   adminOnly: true,
//   description: "Buy multiple items at a given price.",
//   execute: async (ctx) => {
//     if (ctx.args.length === 2) {
//       let amount
//       let pricePer
//       try {
//         amount = parseInt(ctx.args[0])
//         pricePer = parseInt(ctx.args[1])
//       } catch (err) {
//         ctx.message.reply("The amounts must be an integers")
//       }

//       if (amount > 10) {
//         ctx.message.reply("The maximum amount of items is 10")
//         return
//       }

//       if (amount <= 0 || pricePer <= 0) {
//         ctx.message.reply("The amounts must be positive")
//         return
//       }
//       if (amount * pricePer > ctx.profile.coins) {
//         ctx.message.reply(`You do not have ${amount * pricePer} coins`)
//         return
//       }

//       for (let i = 0; i < amount; i++) await generateItem(ctx, amount)

//       ctx.message.channel.send(
//         `Generated ${amount} items. Spent ${amount * pricePer} coins`
//       )
//     } else ctx.message.reply(usage)
//   },
// }
