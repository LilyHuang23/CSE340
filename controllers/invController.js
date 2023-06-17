const invModel = require("../models/inventoryModel")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build vehicle management
 * ************************** */
invCont.buildVehicleManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("/inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null
  })
}
/* ***************************
 *  Build new classification form
 * ************************** */
invCont.buildNewClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("/inventory/addClassification", {
    title: "Add a New Classification",
    nav,
    errors: null
  })
}
/* ***************************
 *  Build new vehicle form
 * ************************** */
invCont.buildNewVehicle = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.getClassificationOptions()
  res.render("./inv/addInventory", {
    title: "Add a New Vehicle",
    nav,
    classificationList,
    errors: null
  })
}

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
    title: year + " " + make + " " + model,
    nav,
    detail,
  })
}
/* ***************************
 *  Process adding classification
 * ************************** */
invCont.addClassification = async function (req, res) { 
  let nav = await utilities.getNav()
  const {classification_name} = req.body
  const classificationResult = await invModel.addNewClassification(
    classification_name
  )
  if (classificationResult) {
    nav = await utilities.getNav()
    req.flash(
      "Success",
      `The ${classification_name} was added successfully.`
    )
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,

    })
  } else {
    req.flash("notice", "Sorry, we couldn't add your classification.")
    res.status(501).render("inventory/addClassification", {
      title: "Add a New Classification",
      nav,
      errors: null,

    })
  }
}
/* ***************************
 *  Process adding vehicle
 * ************************** */
invCont.addVehicle = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    classification_id, inv_make, inv_model, inv_description, inv_image,
    inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
  const vehicleResult = await invModel.addVehicle(classification_id, inv_make,
    inv_model, inv_description, inv_image, inv_thumbnail, inv_price,
    inv_year, inv_miles, inv_color)
  if (vehicleResult) {
    req.flash(
      "Success",
      `This ${inv_year} ${inv_model} ${inv_make} was added successfully.`
    )
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, we couldn't add this vehicle.")
    res.status(501).render("inventory/addInventory", {
      title: "Add a New Vehicle",
      nav,
      errors: null,
    })
    }
  
}

module.exports = invCont