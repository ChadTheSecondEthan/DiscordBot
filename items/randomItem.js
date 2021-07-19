const items = require("./allItems.json")

module.exports = (amt) => {
  const possibleItems = items.filter(
    (item) => item.minCost <= amt && item.maxCost >= amt
  )

  return possibleItems[Math.floor(Math.random() * possibleItems.length)]
}
