const createItemModel = require('../items/createItemModel')
const allItems = require('../items/allItems.json')
const randomItem = require('../items/randomItem.js')

const usage = 'Usage: ebi <amount | item_name>'

module.exports = {
  name: 'bi',
  usage,
  description: 'Buy an item',
  execute: async (ctx) => {
    if (!ctx.args.length) {
      ctx.message.reply(usage)
      return
    }

    try {
      const amount = parseInt(ctx.args[0])

      if (amount <= 0) {
        ctx.message.reply('The amount must be positive')
        return
      }
      if (amount > ctx.profile.coins) {
        ctx.message.reply(`You do not have ${amount} coins`)
        return
      }

      const item = await createItemModel(ctx, randomItem(amount), amount)

      ctx.message.reply(`Generated ${item.name} for ${amount} coins`)
    } catch (err) {
      const name = ctx.args.join(' ').toLowerCase()
      const item = allItems.find((i) => i.name.toLowerCase() === name)

      if (!item) {
        ctx.message.reply('Item not found')
        return
      }

      if (item.maxCost > ctx.profile.coins) {
        ctx.message.reply(
          `A ${item.name} costs ${item.maxCost} coins and you only have ${ctx.profile.coins}`
        )
        return
      }

      await createItemModel(ctx, item, item.maxCost)
      ctx.message.reply(`Generated ${item.name} for ${item.maxCost} coins`)
    }
  },
}
