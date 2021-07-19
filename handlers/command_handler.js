const fs = require("fs")
require("dotenv").config()

module.exports = (client) => {
  const commandFiles = fs
    .readdirSync("./commands/")
    .filter((file) => file.endsWith(".js"))

  commandFiles.forEach((file) => {
    const command = require(`../commands/${file}`)
    if (command.name)
      client.commands.set(process.env.PREFIX + command.name, command)
  })
}
