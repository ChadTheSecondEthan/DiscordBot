const getStaticData = require("./getStaticData")

module.exports = async () => {
  const staticData = await getStaticData()
  let output = parseInt(staticData.curItemId++, 10).toString(36)
  await staticData.save()
  return output
}
