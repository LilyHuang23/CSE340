const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build detail by classification view
 * ************************** */
invCont.detailByInventoryId = async function (req, res, next) {
  const inv_id = req.params.inv_id
  let data = await invModel.getDetailByInventoryId(inv_id)
  data = data[0]
  const detail = await utilities.displayDetail(data)
  let nav = await utilities.getNav()
  // detail eg. year
  console.log(data)
  
  const year = data.inv_year
  const make = data.inv_make
  const model = data.inv_model

  res.render("./inventory/detail", {
    title: year + make + model,
    nav,
    detail,
  })
}

module.exports = invCont