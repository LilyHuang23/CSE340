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
    utilities.handleErrors(accountController.accountLogin)  
  )
// deliver logout view
router.get("/logout", utilities.handleErrors(accountController.accountLogout));

// Process the logout attempt
// router.post(
//   "/logout",
//   utilities.handleErrors(accountController.accountLogout))
// Route to build account view
router.get("/", utilities.checkLogin,
  utilities.handleErrors(accountController.buildManagement))

// Link for the update information view
router.get("/updateView/:account_id",
utilities.handleErrors(accountController.accountUpdateView))

// Process the update information attempt
router.post("/updateView",
regValidate.updateInfoRules(),
  regValidate.checkUpdateInfo,
  utilities.checkLogin,
utilities.handleErrors(accountController.updateInfo))

// Process the update password attempt
router.post("/updateViewPassword", 
regValidate.updatePasswordRules(),
regValidate.checkPassword,
utilities.handleErrors(accountController.updatePassword))

// Final message
// route to build the inbox view
router.get("/inbox/:account_id", utilities.handleErrors(accountController.buildInbox))

// route to build the message view
router.get("/messages/:message_id", utilities.handleErrors(accountController.buildMessage))

// Route for create new message view
router.get("/createMessage", utilities.handleErrors(accountController.buildCreateMessage))
// Route for archived message view
router.get("/archive", utilities.handleErrors(accountController.buildArchiveMessage))
// Route for reply message view
router.get("/reply/:message_id", utilities.handleErrors(accountController.buildReplyMessage))

// Route to send a new message
router.post("/createMessage",
// regValidate.createMessageRules(), 
// regValidate.checkCreateMessage,
utilities.handleErrors(accountController.sendNewMessage))


// Route for send reply message
router.post("/reply", utilities.handleErrors(accountController.replyMessage))

// Route to mark as read
router.post("/read/:message_id", utilities.handleErrors(accountController.markAsRead))


// Route to archive message
router.post("/archive/:message_id", utilities.handleErrors(accountController.archiveMessage))

// Route to delete message
router.post("/delete/:message_id", utilities.handleErrors(accountController.deleteMessage))

module.exports = router;