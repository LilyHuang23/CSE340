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
        const classificationExist = await inventoryModel.checkExistingClassification
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
      .escape(0)
      .withMessage("Classification name is required."),
    
    body("inv_make")
      .trim()
      .escape(0)
      .isLength({ min: 3 })
      .withMessage("Make should be at least three characters."),

    body("inv_make")
      .trim()
      .escape(0)
      .isLength({ min: 3 })
      .withMessage("Make should be at least three characters."),

    body("inv_model")
      .trim()
      .escape(0)
      .isLength({ min: 3 })
      .withMessage("Model should be at least three characters."),
      
    body("inv_description")
      .notEmpty()
      .trim()
      .escape(0)
      .isLength({ min: 3 })
      .withMessage("Description is required."),
    
    body("inv_image")
      .custom(async (inv_image) => {
        const filePathRegex = '/^\/?([\w\d\s-]+\/)*(\w\d\s.-]+\.[\w]+$/';
        if (!filePathRegex.test(inv_image)) {
          throw new Error("Please enter a valid image path.")
        }
      }),
      
    body("inv_thumbnail")
      .custom(async (inv_thumbnail) => {
        const filePathRegex = '/^\/?([\w\d\s-]+\/)*(\w\d\s.-]+\.[\w]+$/';
        if (!filePathRegex.test(inv_thumbnail)) {
          throw new Error("Please enter a valid thumbnail path.")
        }
      }),
    body("inv_price")
      .custom(async (inv_price) => {
        if (!'/^\d+(\.\d{1,2})?$/'.test(inv_price)) {
          throw new Error("Please enter a valid price format.")
        }
      }),
    body("inv_year")
      .custom(async (inv_year) => {
        if (!'/^\d{4}$/'.test(inv_year)) {
          throw new Error("Year should be 4 digit.")
        }
      }),
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
      res.render("/inv/add-classification", {
        errors,
        title: "Management",
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
    inv_year,
  } = req.body;
  let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("/inv/addinventory", {
        errors,
        title: "Management",
        nav,
        classification_id,
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
  