const getProfile = require('../util/getProfile')
const discord = require('discord.js')

function tryGetNextInput(ctx, message, thisResponse) {
  ctx.responses.push(thisResponse)
  if (ctx.responses.length === 1) {
    message.channel.send(
      `<@!${ctx.message.author.id}>, Please input your request for the trade`
    )
    ctx.curProfile = ctx.partnerProfile
  } else if (ctx.responses.length === 2) createTradeOffer(ctx)
}

function validateCoins(ctx, coinsString, message, collector) {
  let coins
  try {
    coins = parseInt(coinsString)
  } catch (err) {
    message.reply('Amount must be an integer')
    collector.stop()
    return
  }
  if (coins <= 0) {
    message.reply('Amount cannot be negative')
    collector.stop()
    return
  }
  if (coins > ctx.curProfile.coins) {
    message.reply('You do not have that many coins')
    collector.stop()
    return
  }
  return coins
}

function getTradeInputs(ctx) {
  ctx.responses = []
  ctx.curProfile = ctx.profile

  ctx.message.reply('Please input your offer for the trade').then((message) => {
    const filter = (m) => m.author.id === ctx.message.author.id
    const collector = message.channel.createMessageCollector(filter, {
      max: 2,
      time: 30000,
    })

    collector.on('collect', (m) => {
      m.content = m.content.toLowerCase()
      const args = m.content.split(' ')
      if (args.length === 1) {
        const item = ctx.curProfile.items.find((item) => item.id === args[0])
        if (!item) {
          message.reply('Invalid item. Trade offer canceled')
          collector.stop()
          return
        }
        tryGetNextInput(ctx, message, { item })
      } else if (
        args.length === 2 &&
        (args[1] === 'coins' || args[1] === 'coin')
      ) {
        const coins = validateCoins(ctx, args[0], message, collector)
        if (coins) tryGetNextInput(ctx, message, { coins })
      } else {
        message.reply('Invalid offer')
        collector.stop()
      }
    })
  })
}

function getTradeEmbed(
  offer,
  request,
  userId,
  partnerId,
  userAccepted = false,
  partnerAccepted = false
) {
  return {
    color: 0x0099ff,
    title: '⚠️TRADE OFFER⚠️',
    description: `from <@!${userId}> to <@!${partnerId}>`,
    fields: [
      {
        name: `Offer\t\t\t`,
        value: offer,
        inline: true,
      },
      {
        name: `Request`,
        value: request,
        inline: true,
      },
      {
        name: '\u200b',
        value: `<@!${userId}> accepted: ${userAccepted ? '✅' : '❌'}`,
      },
      {
        name: '\u200b',
        value: `<@!${partnerId}> accepted: ${partnerAccepted ? '✅' : '❌'}`,
      },
    ],
  }
}

function createTradeOffer(ctx) {
  const offer = ctx.responses[0].coins || ctx.responses[0].item.name
  const request = ctx.responses[1].coins || ctx.responses[1].item.name
  ctx.message.channel
    .send({
      embed: getTradeEmbed(
        offer,
        request,
        ctx.message.author.id,
        ctx.tradePartner.id
      ),
    })
    .then((message) => {
      message.react('❌').then(() => {
        message.react('✅').then(() => {
          const filter = (reaction, user) =>
            (reaction.emoji.name === '❌' || reaction.emoji.name === '✅') &&
            (user.id === ctx.message.author.id ||
              user.id === ctx.tradePartner.id)
          const collector = message.createReactionCollector(filter, {
            time: 30000,
          })
          collector.on('collect', async (reaction, user) => {
            const embed = new discord.MessageEmbed(message.embeds[0])

            if (reaction.emoji.name === '❌') {
              collector.stop()
              embed.footer = {
                text: 'This trade offer has been canceled',
              }
              message.edit(embed)
              return
            }

            ctx.userAccepted =
              ctx.userAccepted || user.id === ctx.message.author.id
            ctx.partnerAccepted =
              ctx.partnerAccepted || user.id === ctx.tradePartner.id

            if (ctx.userAccepted && ctx.partnerAccepted) {
              await completeTrade(ctx)
              collector.stop()
              embed.color = 0x00ff00
              embed.footer = {
                text: 'This trade offer has been completed',
              }
            }
            embed.fields = getTradeEmbed(
              offer,
              request,
              ctx.message.author.id,
              ctx.tradePartner.id,
              ctx.userAccepted,
              ctx.partnerAccepted
            ).fields
            message.edit(embed)
          })

          collector.on('end', () => {
            const embed = new discord.MessageEmbed(message.embeds[0])
            embed.footer = {
              text: 'This trade offer has expired',
            }
            embed.color = 0xff0000
            message.edit(embed)
          })
        })
      })
    })
}

async function completeTrade(ctx) {
  let received
  if (ctx.responses[1].coins) received = `${ctx.responses[1].coins} coins`
  else received = ctx.responses[1].item.name

  let taken
  if (ctx.responses[0].coins) taken = `${ctx.responses[0].coins} coins`
  else taken = ctx.responses[0].item.name

  ctx.message.channel.send(
    `Trade offer completed
    <@!${ctx.message.author.id}>, you received ${received}
    <@!${ctx.tradePartner.id}>, you received ${taken}`
  )

  await updateProfiles(ctx)
}

async function updateProfiles(ctx) {
  let received = ctx.responses[1]
  if (received.coins) {
    ctx.profile.coins += received.coins
    ctx.partnerProfile.coins -= received.coins
  } else {
    received = received.item
    received.ownerId = ctx.profile.userId
    ctx.profile.items.push(received)
    const index = ctx.partnerProfile.items.indexOf(received)
    ctx.partnerProfile.items.splice(index, 1)
  }

  let taken = ctx.responses[0]
  if (taken.coins) {
    ctx.profile.coins -= taken.coins
    ctx.partnerProfile.coins += taken.coins
  } else {
    taken = taken.item
    taken.ownerId = ctx.partnerProfile.userId
    ctx.partnerProfile.items.push(taken)
    const index = ctx.profile.items.indexOf(taken)
    ctx.profile.items.splice(index, 1)
  }

  await ctx.profile.save()
  await ctx.partnerProfile.save()
}

module.exports = {
  name: 't',
  usage: 'Usage: et <user>',
  description: 'Initiate a trade with another user. ',
  execute: async (ctx) => {
    if (ctx.mentions.length !== 1) {
      ctx.message.reply(usage)
      return
    }
    ctx.partnerProfile = await getProfile(ctx.mentions[0])
    if (!ctx.partnerProfile) return

    getTradeInputs(ctx)
  },
}
