const listOptions = require('./listOptions')

module.exports = (items, args) => {
  const newItems = []
  items.forEach((item) => newItems.push(item))

  listOptions.forEach(({ name, invoke }, index) => {
    if (args.includes(name.toLowerCase()))
      invoke(newItems, args.splice(index, 1))
  })

  return newItems
}
