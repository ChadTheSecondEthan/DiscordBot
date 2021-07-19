const allItems = require('../items/allItems.json')
const itemModel = require('../models/itemSchema')
const createItemModel = require('../items/createItemModel')

const giveCoins = (ctx, amt) => {
  ctx.profile.coins += amt
  ctx.message.reply(`${amt} coins received`)
}

const giveItem = async (ctx, itemName) => {
  await createItemModel(ctx, item, 0)
  ctx.message.reply(`Item ${itemName} received`)
}

module.exports = {
  name: 'g',
  adminOnly: true,
  execute: async (ctx) => {
    if (ctx.args.length > 0) {
      const amount = parseInt(ctx.args[0])
      if (amount) {
        giveCoins(ctx, amount)
        await ctx.profile.save()
        return
      }
      let itemName = ctx.args.join(' ')
      itemName = allItems.filter(
        (item) => item.name.toLowerCase() === itemName.toLowerCase()
      )[0].name
      if (itemName) {
        await giveItem(ctx, itemName)
        await ctx.profile.save()
      }
    }
  },
}
