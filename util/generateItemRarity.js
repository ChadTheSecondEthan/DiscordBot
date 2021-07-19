const rarities = require("../items/rarities.json")

module.exports = () => Math.floor(Math.random() * rarities.length)
