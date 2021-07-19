const itemInfo = require('../items/itemInfo')
const sortItems = require('../items/sortItems')
const MultiPageEmbed = require('../util/multipageEmbed')
const listOptions = require('../items/listOptions')
const sortOptions = require('../items/sortOptions')
const getProfile = require('../util/getProfile')

const listOptionFields = [
  {
    name: '<user>',
    description:
      'Select the user whose items you want to be displayed. It is defaulted to your user',
  },
]
listOptions.forEach((option) => {
  listOptionFields.push({
    name: option.name,
    value: option.description,
  })
})

const sortOptionFields = []
sortOptions.forEach((option) => {
  sortOptionFields.push({
    name: option.name,
    value: `Sorts items by their ${option.name}`,
  })
})

const getItemDescription = (item) =>
  `**Condition:** ${itemInfo.getItemRarity(item)}, 
  **ID:** ${item.id}`

function getFields(items) {
  const fields = []
  items.forEach((item) => {
    fields.push({
      name: `\`${item.name}\`:`,
      value: getItemDescription(item),
    })
  })
  return fields
}

const sortEmbed = {
  color: 0x0099ff,
  title: 'Item List',
  description: 'Sort Options',
  fields: sortOptionFields,
}

const helpEmbed = {
  color: 0x0099ff,
  title: 'Item List',
  description: 'Options',
  fields: listOptionFields,
}

module.exports = {
  name: 'il',
  usage: 'Usage: eli [user] [params]',
  description: 'Lists items with optional parameters.',
  execute: async (ctx) => {
    let displayProfile = ctx.profile
    let mention = `<@!${ctx.message.author.id}>`

    if (ctx.mentions[0]) {
      const profile = await getProfile(ctx.mentions[0].id)
      if (profile) {
        displayProfile = profile
        mention = ctx.mentions[0]
      }
    }

    if (displayProfile.items.length === 0) {
      ctx.message.reply('No items found')
      return
    }

    const sortedItems = sortItems(displayProfile.items, ctx.args)
    if (!sortedItems) {
      ctx.message.reply('Invalid parameters')
      return
    }

    const fields = getFields(sortedItems)
    const embed = new MultiPageEmbed(fields, ctx.message.author.id)
      .setTitle('Item List')
      .setDescription(`Owned by ${mention}`)
    embed.send(ctx.message.channel)
  },
  help: (ctx) =>
    ctx.message.reply({
      embed:
        ctx.args[0] === 'sort' || ctx.args[0] === 'rsort'
          ? sortEmbed
          : helpEmbed,
    }),
}
