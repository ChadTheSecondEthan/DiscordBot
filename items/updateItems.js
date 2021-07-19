const allItems = require('./allItems.json')
const fs = require('fs')

const newItems = []

for (let i = 0; i < newItems.length; i += 3) {
  const name = newItems[i]
  const minCost = newItems[i + 1]
  const maxCost = newItems[i + 2]
  allItems.push({
    name,
    minCost,
    maxCost,
  })
}

fs.writeFile('./items/allItems.json', JSON.stringify(allItems), (err) => {
  if (err) throw err

  console.log('Done writing')
})
