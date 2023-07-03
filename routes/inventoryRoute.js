// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities");
const validation = require("../utilities/inventoryValidation");
// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
// Route to build add new classification
router.get("/addClassification", utilities.handleErrors(invController.buildNewClassification));
// Route to build add new vehicle
router.get("/addinventory", utilities.handleErrors(invController.buildNewVehicle));
// Route to build inventory detail
router.get("/detail/:inv_id", utilities.handleErrors(invController.detailByInventoryId));
// AJAX - activity 5
router.get("/getInventory/:classification_id",
    // utilities.checkAccountType,
    utilities.handleErrors(invController.getInventoryJSON));
// Update the Inventory Item Routes - activity 5
// router.get("/inv/edit/:inventory_id", utilities.handleErrors(invController.editInventoryView, invController.newInventoryRules(), invController.checkUpdateData));
// Data Checking Middleware

// Route to build vehicle management
router.get("/", utilities.handleErrors(invController.buildVehicleManagement));
// delete the Inventory Item Routes - activity 5
router.get("/inv/edit/:inv_id", utilities.handleErrors(invController.deleteInventory));

// post new classification
router.post("/addClassification",
    validation.classificationRules(),
    validation.checkClassificationData,
    utilities.handleErrors(invController.addClassification));
// post new vehicle
router.post("/addinventory",
    validation.vehicleRules(),
    validation.checkVehicleData,
    utilities.handleErrors(invController.addVehicle));

router.post("/update/", invController.updateInventory)
// delete
router.post("/delete/", utilities.handleErrors(invController.deleteInventory));

module.exports = router;