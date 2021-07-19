const sortOptions = require('./sortOptions')

const sort = (items, params) => {
  sortOptions.forEach((option) => {
    if (params.includes(option.name.toLowerCase())) {
      items.sort(option.compare)
      return
    }
  })
}

module.exports = [
  {
    name: 'Rsort',
    description: 'Sorts your items in reverse',
    invoke: (items, params) => {
      sort(items, params)
      items.reverse()
    },
  },
  {
    name: 'Sort',
    description:
      'Sorts your items by some parameter. For different parameters, type `eil sort help`',
    invoke: (items, params) => sort(items, params),
  },
]
