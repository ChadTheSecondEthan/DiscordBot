const rarities = require("./rarities.json")

module.exports = {
  getItemRarity: (item) => `${rarities[item.rarity]}`,
  getItemId: (item) => `ID: ${item.id}`,
  getItemPrice: (item) => `Paid: ${item.amtPaid}`,
  getItemOwner: (item) => `<@!${item.ownerId}>`,
  getItemBuyer: (item) => `<@!${item.buyerId}>`,
}
