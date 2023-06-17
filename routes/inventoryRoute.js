// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities");
const validation = require("../utilities/inventoryValidation");
// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
// Route to build add new classification
router.get("/add/addClassification", utilities.handleErrors(invController.buildNewClassification));
// Route to build add new vehicle
router.get("/add/addInventory", utilities.handleErrors(invController.buildNewVehicle));
// Route to build inventory detail
router.get("/detail/:inv_id", utilities.handleErrors(invController.detailByInventoryId));
// Route to build vehicle management
router.get("/", utilities.handleErrors(invController.buildVehicleManagement));
// post new classification
router.post("/add/addClassification",
    // validation.classificationRules(),
    // validation.checkClassificationData,
    utilities.handleErrors(invController.addClassification));
// post new vehicle
router.post("/add/addInventory",
    validation.vehicleRules(),
    validation.checkVehicleData,
    utilities.handleErrors(invController.addVehicle));

module.exports = router;