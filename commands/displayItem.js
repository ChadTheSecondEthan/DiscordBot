const itemInfo = require("../items/itemInfo")

const usage = "Usage: edi <item_id> [params]"

const getEmbed = (item) => {
  return {
    color: 0x0099ff,
    title: "Item Lookup",
    description: `Item #${item.id}`,
    fields: [
      {
        name: item.name,
        value: itemInfo.getItemId(item),
      },
      {
        name: "Owner",
        value: itemInfo.getItemOwner(item),
      },
      {
        name: "Buyer",
        value: itemInfo.getItemBuyer(item),
      },
      {
        name: "Condition",
        value: itemInfo.getItemRarity(item),
      },
    ],
  }
}

module.exports = {
  name: "di",
  usage,
  description: "Displays an item when given its id.",
  execute: (ctx) => {
    if (ctx.args.length !== 0) {
      const id = ctx.args[0]
      const item = ctx.profile.items.find((i) => i.id === id)
      if (!item) {
        ctx.message.reply(`Item with id ${id} not found`)
        return
      }
      ctx.message.channel.send({ embed: getEmbed(item) })
    } else ctx.message.reply(usage)
  },
}
