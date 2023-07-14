const utilities = require(".")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")

const validate = {}
/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registrationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the database
        body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required.")
        .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists){
            throw new Error("Email exists. Please log in or use different email")
        }
        }),

      // password is required and must be strong password
      body("account_password")
        .trim()
        .isStrongPassword({
          minLength: 12,
          minUppercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
}
  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/registration", {
        errors,
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
}

/* ******************************
* Login Validation Rules
* ***************************** */

validate.loginRules = () => {
   return [
     // valid email is required and cannot already exist in the database
       body("account_email")
       .trim()
       .isEmail()
       .normalizeEmail() // refer to validator.js docs
       .withMessage("A valid email is required.")
      ,

     // password is required and must be strong password
     body("account_password")
       .trim()
       .isStrongPassword({
        minLength: 12,
        minUppercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
       .withMessage("Password does not meet requirements."),
   ]
}
 /* ******************************
* Check data and return errors or continue to Login
* ***************************** */
validate.checkLoginData = async (req, res, next) => {
   const { account_email, account_password  } = req.body
   let errors = []
   errors = validationResult(req)
   if (!errors.isEmpty()) {
     let nav = await utilities.getNav()
     res.render("account/login", {
       errors,
       title: "Login",
       nav,
       account_email,
       account_password,
     })
     return
   }
   next()
 }
/* ******************************
 * Update Information Validation Rules
 * ***************************** */
validate.updateInfoRules = () => {
  return [
    body("account_firstname")
    .trim()
    .isLength({ min: 1 })
    ,

    body("account_lastname")
    .trim()
    .isLength({ min: 2 }),

    body("account_email")
    .trim()
    .isEmail()
    .normalizeEmail() // refer to validator.js docs
    .withMessage("A valid email is required.")
    .custom(async (account_email, {req}) => {
      const accountId = req.body.account_id; 
      const accountData = await accountModel.getAccountByAccountId(accountId)
      const emailExists = await accountModel.checkExistingEmail(account_email)
      if (emailExists && account_email !== accountData.account_email) {
        throw new Error("Email exists. Please update email")
      }
    }),
  ]
}


  /* *********************************************
 * Update Information Validation Rules for password
 * *********************************************/
validate.updatePasswordRules = () => {
  return [
    body("account_password")
    .trim()
    .isStrongPassword({
      minLength: 12,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      })
    .withMessage("Password does not meet requirements."),
  ]
}

/*********************************************************************************
 * Check password and put stickiness back if there is no input for password
 * *******************************************************************************/
validate.checkPassword = async (req, res, next) => {
  const {account_password, account_firstname, account_lastname, account_email, account_id} = req.body
  const accountIds = parseInt(req.body.account_id);
  const accountData = await accountModel.getAccountByAccountId(accountIds)
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()){
    let nav = await utilities.getNav()
    res.render("./account/updateView", {
      errors,
      title: "Edit Account",
      nav,
      account_id: accountData.accountId,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
    })
    return
  }
  next()
}


  /**************************************************************************
 * Check update information and return errors or continue management view
 ****************************************************************************/
validate.checkUpdateInfo = async (req, res, next) => {
  const {account_firstname, account_lastname, account_email} = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/updateView", {
      errors,
      title: "Edit Account",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}
/* *******************************************
*                    Final
* ******************************************** */
/* ******************************
* Message Validation Rules
* ***************************** */
validate.MessageRules = () => {
  return [
    body("message_to")
    .trim()
    .isAlpha()
    .withMessage("Select a recipient"),

    body("message_subject")
      .trim()
      .isLength({min:1})
      .withMessage("Please provide a valid subject"),

    body("message_body")
      .trim()
      .isLength({min:1})
      .withMessage("Please provide a message to send")
  ]
}


/* ******************************
 * Check message validation rules
 * ***************************** */
validate.checkCreateMessage = async (req, res, next) => {
  const {message_to, message_subject, message_body} = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const names = await accountModel.getAccountNames()
    let select = await utilities.getName(names)
    res.render("account/createMessage", {
      errors,
      title: "New Message",
      nav,
      select,
      message_to,
      message_subject,
      message_body,
    })
    return
  }
  next()
}
  module.exports = validate
  