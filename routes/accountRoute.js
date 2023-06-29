// Activity 4
// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/index")
const regValidate = require('../utilities/accountValidation')
// deliver login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));
// deliver registration view
router.get("/registration", utilities.handleErrors(accountController.buildRegister));
// activity 5 Account Management View
router.get("/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildManagement))
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
    // activity 5
    utilities.handleErrors(accountController.accountLogin),
    // (req, res) => {
    //   res.status(200).send('login process')
    // }
    
    
  )
module.exports = router;