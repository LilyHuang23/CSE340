// Activity 4
// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/managementController")
const utilities = require("../utilities/index")
const regValidate = require('../utilities/management-validation')
// deliver login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));
// deliver registration view
router.get("/registration", utilities.handleErrors(accountController.buildRegister));
// submit register form
// Process the registration data
router.post(
    "/registration",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)
  // Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.registerAccount),
    (req, res) => {
      res.status(200).send('login process')
    }
    
  )
module.exports = router;