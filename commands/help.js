require('dotenv').config()

const fields = []

function populateFields(ctx) {
  ctx.client.commands.forEach((command) => {
    if (command.name !== 'help' && !command.adminOnly)
      fields.push({
        name: `${process.env.PREFIX}${command.name}`,
        value: `${command.description} ${
          command.usage ? '`' + command.usage + '`' : ''
        }`,
      })
  })
}

module.exports = {
  name: 'help',
  execute(ctx) {
    if (fields.length === 0) populateFields(ctx)

    ctx.message.channel.send({
      embed: {
        color: 0x0099ff,
        title: 'Help',
        description: 'List of bot commands',
        fields,
      },
    })
  },
}
