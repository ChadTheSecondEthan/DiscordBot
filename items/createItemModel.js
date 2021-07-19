const itemModel = require('../models/itemSchema')
const generateItemId = require('../util/generateItemId')
const generateItemRarity = require('../util/generateItemRarity')

module.exports = async (ctx, item, amt) => {
  item = await itemModel.create({
    name: item.name,
    ownerId: ctx.message.author.id,
    buyerId: ctx.message.author.id,
    amtPaid: amt,
    id: await generateItemId(),
    rarity: generateItemRarity(),
  })
  ctx.profile.coins -= amt
  ctx.profile.items.push(item)
  await ctx.profile.save()
  return item
}
