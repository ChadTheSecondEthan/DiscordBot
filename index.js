const discord = require('discord.js')
const mongoose = require('mongoose')
require('dotenv').config()

const client = new discord.Client({
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
})

client.commands = new discord.Collection()
client.events = new discord.Collection()
require('./handlers/command_handler')(client)
require('./handlers/event_handler')(client)

mongoose
  .connect(process.env.MONGODB_SRV, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log('connected to database'))
  .catch((err) => console.log(err))

client.login('ODQxNTAzNzc5MDgxNDIwODMw.YJntdw.V2rIXygT3cF9clvvQqKJWCvzNxk')
