const discord = require('discord.js')

class MultiPageEmbed extends discord.MessageEmbed {
  constructor(allFields, authorId, displaySize = 5, startPage = 1) {
    super()
    this.authorId = authorId
    this.allFields = allFields
    this.displaySize = displaySize
    this.pageNumber = startPage
    this.fields = this.getFields()
    this.footer = this.getFooter()
  }

  send(channel) {
    channel
      .send({
        embed: this,
      })
      .then((message) => {
        if (this.allFields.length > this.displaySize) {
          const collector = message.createReactionCollector(
            (reaction, user) =>
              (reaction.emoji.name === '⬅️' || reaction.emoji.name === '➡️') &&
              user.id === this.authorId,
            {
              time: 60000,
            }
          )
          collector.on('collect', (reaction) => {
            if (reaction.emoji.name === '➡️')
              this.pageNumber =
                Math.min(
                  this.pageNumber,
                  Math.floor(this.allFields.length / this.displaySize)
                ) + 1
            else this.pageNumber = Math.max(this.pageNumber - 1, 1)
            this.fields = this.getFields()
            const newEmbed = new discord.MessageEmbed(message.embeds[0])
            newEmbed.fields = this.getFields()
            newEmbed.footer = this.getFooter()
            message.edit(newEmbed)
          })
        }
        message.react('⬅️').then(() => message.react('➡️'))
      })
  }

  getFooter() {
    return {
      text: `Showing ${
        (this.pageNumber - 1) * this.displaySize + 1
      } - ${Math.min(
        this.pageNumber * this.displaySize,
        this.allFields.length
      )} of ${this.allFields.length}`,
    }
  }

  getFields() {
    const fields = []
    const minField = (this.pageNumber - 1) * this.displaySize
    const maxField = Math.min(
      this.allFields.length,
      this.pageNumber * this.displaySize
    )
    for (let i = minField; i < maxField; i++) fields.push(this.allFields[i])
    return fields
  }
}

module.exports = MultiPageEmbed
