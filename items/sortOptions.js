module.exports = [
  {
    name: 'ID',
    compare: (a, b) => b.id - a.id,
  },
  {
    name: 'Rarity',
    compare: (a, b) => b.rarity - a.rarity,
  },
  {
    name: 'Sell Price',
    compare: (a, b) => b.minCost - a.minCost,
  },
  {
    name: 'Buy Price',
    compare: (a, b) => b.maxCost - a.maxCost,
  },
]
