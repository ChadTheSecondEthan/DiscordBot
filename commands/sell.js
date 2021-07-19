const allItems = require('../items/allItems.json')
const itemInfo = require('../items/itemInfo')
const discord = require('discord.js')

const getEmbed = (item, sellPrice) => {
  return {
    color: 0x0099ff,
    title: 'Sell Item',
    description: `You will receive ${sellPrice} coins`,
    fields: [
      {
        name: 'Name',
        value: item.name,
      },
      {
        name: 'Condition',
        value: itemInfo.getItemRarity(item),
      },
    ],
  }
}

module.exports = {
  name: 's',
  usage: 'Usage: es <item id>',
  description: 'Sells the given item.',
  execute: async (ctx) => {
    if (ctx.args.length != 1) {
      ctx.message.reply('Invalid arguments')
      return
    }

    const item = ctx.profile.items.find((i) => i.id === ctx.args[0])
    if (!item) {
      ctx.message.reply(`Item with id ${ctx.args[0]} not found`)
      return
    }

    const sellPrice = allItems.find((i) => i.name === item.name).minCost
    ctx.message.reply({ embed: getEmbed(item, sellPrice) }).then((message) => {
      message
        .react('❌')
        .then(() => message.react('✅'))
        .then(() => {
          const filter = (reaction, user) =>
            (reaction.emoji.name === '❌' || reaction.emoji.name === '✅') &&
            user.id === ctx.message.author.id
          const collector = message.createReactionCollector(filter, {
            max: 1,
            time: 30000,
          })

          collector.on('collect', async (reaction, user) => {
            const embed = new discord.MessageEmbed(message.embeds[0])
            if (reaction.emoji.name === '❌') {
              embed.color = 0xff0000
              message.edit(embed).then(() => {
                ctx.message.reply(`You cancelled the sell offer`)
              })
            } else {
              embed.color = 0x00ff00
              message
                .edit(embed)
                .then(
                  ctx.message.reply(
                    `You earned ${sellPrice} coins by selling ${item.name}`
                  )
                )

              ctx.profile.coins += sellPrice
              const index = ctx.profile.items.indexOf(item)
              ctx.profile.items.splice(index, 1)
              await ctx.profile.save()
            }
          })
        })
    })
  },
}
