const utilities = require(".")
const { body, validationResult } = require("express-validator")
const inventoryModel = require("../models/inventoryModel")

const validate = {}
/*  **********************************
 *  Classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
  return [
    // classification name is required and must be string
    body("classification_name")
      .trim()
      .isAlpha()
      .withMessage("Please provide a valid classification name.") // on error this message is sent.
      .custom(async (classification_name) => {
        const classificationExist = await inventoryModel.checkExistingClassification(classification_name)
        if (classificationExist) {
            throw new Error("This classification already exists")
        }
      })
    ,
  ]
}
  
/*  **********************************
 *  Classification Data Validation Rules
 * ********************************* */
validate.vehicleRules = () => {
  return [
    body("classification_id")
      .notEmpty()
      .withMessage("Classification name is required."),
    
    body("inv_make")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Make should be at least three characters."), 

    body("inv_model")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Model should be at least three characters."),
      
    body("inv_description")
      .notEmpty()
      .trim()
      .isLength({ min: 3 })
      .withMessage("Description is required."),
    
    body("inv_image")
      .notEmpty()
      .withMessage("Image is required."),
      
    body("inv_thumbnail")
      .notEmpty()
      .withMessage("Image is required."),
    
    body("inv_price")
      .isNumeric()
      .isLength({ min: 3, max: 7 })
      .withMessage("Price should be digit."),

    body("inv_year")
      .isNumeric()
      .isLength({ min: 4, max: 4 })
      .withMessage("Year should be 4 digit."),
  
    body("inv_miles")
      .isNumeric()
      .withMessage("Miles should be 4 digit."),
       
    body("inv_color")
      .trim()
      .escape()
      .isAlpha()
      .withMessage("Please enter a color name.")
  ]
}
/*  **********************************
 *  Check data and return errors or continue the vehicle processing
 * ********************************* */   
validate.checkClassificationData = async (req, res, next) => {
  const {
    classification_name,
  } = req.body;
  let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("../views/inventory/addClassification", {
        errors,
        title: "Add a New Classification",
        nav,
        classification_name,
      })
      return
    }
    next()
}
      
/*  **********************************
 *  Check data and return errors or continue the vehicle processing
 * ********************************* */   
validate.checkVehicleData = async (req, res, next) => {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_year,
    inv_color,
  } = req.body;
  let options = await utilities.getClassificationOptions(classification_id)
  let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("../views/inventory/addInventory", {
        errors,
        title: "Add a new Vehicle",
        options,
        nav,
        classification_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_year,
        inv_color,
      })
      return
    }
    next()
}/*  **********************************
 *  Check data and return errors or continue the vehicle processing
 * ********************************* */   
validate.checkUpdateData = async (req, res, next) => {
  const {
    classification_id,
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
  } = req.body;
  let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("../view/inventory/edit-inventory", {
        errors,
        title: "Edit " + itemName,
        nav,
        classification_id,
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
      })
      return
    }
    next()
}
module.exports = validate
  