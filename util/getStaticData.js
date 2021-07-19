const staticDataModel = require("../models/staticDataSchema")

let staticData

module.exports = async () => {
  if (staticData) return staticData
  try {
    const allData = await staticDataModel.find({})
    if (allData.length === 0) {
      staticData = await staticDataModel.create({})
      await staticData.save()
      return staticData
    }
    staticData = allData[0]
    return staticData
  } catch (err) {
    console.log(err)
  }
}
