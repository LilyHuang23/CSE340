const invModel = require("../models/inventoryModel")
const utilities = require("../utilities/")
const { classificationRules } = require("../utilities/inventoryValidation")

const invCont = {}

/* ***************************
 *  Build vehicle management assignment 4
 * ************************** */
invCont.buildVehicleManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  let options = await utilities.getClassificationOptions()

  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    options,
    errors: null,
  })
}
/* ***************************
 *  Build new classification form
 * ************************** */
invCont.buildNewClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/addClassification", {
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
  let options = await utilities.getClassificationOptions()
  res.render("./inventory/addinventory", {
    title: "Add a New Vehicle",
    nav,
    options,
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
  console.log("test")
  const vehicleResult = await invModel.addVehicle(classification_id, inv_make,
    inv_model, inv_description, inv_image, inv_thumbnail, inv_price,
    inv_year, inv_miles, inv_color)
  if (vehicleResult) {
    req.flash(
      "Success",
      `This ${inv_year} ${inv_make} ${inv_model} was added successfully.`
    )
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, we couldn't add this vehicle.")
    res.status(501).render("./inventory/addinventory", {
      title: "Add a New Vehicle",
      nav,
      errors: null,
    })
    }
  
}
/* ***************************
 *  Return Inventory by Classification As JSON - activity 5
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}
/* ***************************
 *  Build edit inventory view -activity 5
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  // let data = await invModel.getDetailByInventoryId(inv_id)
  // data = data[0]
  // const make = data.inv_make
  // const model = data.inv_model
  const itemData = await invModel.getInventoryById(inv_id)
  let options = await utilities.getClassificationOptions(itemData[0].classification_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    options: options,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_description: itemData[0].inv_description,
    inv_image: itemData[0].inv_image,
    inv_thumbnail: itemData[0].inv_thumbnail,
    inv_price: itemData[0].inv_price,
    inv_miles: itemData[0].inv_miles,
    inv_color: itemData[0].inv_color,
    classification_id: itemData[0].classification_id
  })
}
/* ***************************
 *  Update Inventory Data 
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const options = await utilities.getClassificationOptions()
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("/inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    options: options,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}
/* ***************************
 *  Build delete inventory view - activity 5
 * ************************** */
invCont.deleteInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  let options = await utilities.getClassificationOptions(itemData[0].classification_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    options: options,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_price: itemData[0].inv_price,
  })
}

/* ***************************
 *  Delete Inventory Data Process 
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.deleteInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully deleted.`)
    res.redirect("/inv/")
  } else {
    let options = await utilities.getClassificationOptions()
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the delete failed.")
    res.status(501).render("../views/inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    options: options,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price
    })
  }
}

module.exports = invCont