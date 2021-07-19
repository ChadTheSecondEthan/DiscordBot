module.exports = (args) => {
  const obj = {}
  args.forEach((arg) => {
    if (arg.includes("=")) {
      vals = arg.split("=")
      obj[vals[0]] = vals[1]
    }
  })
  return obj
}
