const bcrypt = require("bcryptjs")
const utilities = require('../utilities/index')
const accountModel = require('../models/account-model')
// activity 5
const jwt = require("jsonwebtoken")
require("dotenv").config()


/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("./account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}
/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/registration", {
      title: "Registration",
      nav,
      errors:null,
    })
}
  /* ****************************************
*  Deliver management view
* *************************************** */
async function buildManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors:null,
  })
}
/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body
  // console.log(account_firstname, account_lastname, account_email, account_password)
  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/registration", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )
  
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/registration", {
        title: "Registration",
        nav,
      })
    }
}
/* ****************************************
 *  Process login request
 *  Activity 5
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()

  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  try {
    // hash password
    if (await bcrypt.compare(account_password, accountData.account_password)) {
    delete accountData.account_password
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
    return res.redirect("/account/")
    }
   } catch (error) {
    return new Error('Access Forbidden')
   }
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  else {
    req.flash(
      "notice",
      `Welcome `
      `Congratulations, you\'re logged in.`
    )
    res.status(201).render("account/management", {
      title: "Management",
      nav,
      errors: null,
    })
  }
}

 /* ****************************************
 * Update account information view
 * ************************************ */
 async function accountUpdateView (req, res) {
  let nav = await utilities.getNav()
  const accountId = parseInt(req.params.account_id)
  const accountData = await accountModel.getAccountByAccountId(accountId)
  res.render("account/updateView", {
    title: "Edit Account",
    nav,
    errors: null,
    account_id: accountId,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
  })
}
 /* ****************************************
 *  Process update account information & password
 * ************************************ */
async function updateInfo(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id } = req.body

  const result = await accountModel.updateAccount(account_firstname, account_lastname, account_email, account_id)
  const data = await accountModel.getAccountByAccountId(account_id)

  if (result) {
    try {
      const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      req.flash("success", "Account was successfully updated")

      return res.redirect("/account/")

    } catch (error) {
      throw new Error("Can't update account for this time.")
    }
  } else {
    req.flash("error", `Sorry the update for ${account_firstname} failed`)
    res.status(501).render("account/updateView", {
      title: "Edit " + account_firstname,
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
      account_id
    })
  }
}
async function updatePassword (req, res) {
  let nav = await utilities.getNav()
  const {account_id, account_password, account_firstname, account_lastname, account_email} =req.body
  
  let hashedPassword
  try{
    hashedPassword = bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("error", 'Sorry, there was an error processing the password change.')
    res.status(500).render("account/updateView", {
      title: "Edit Account",
      nav,
      errors: null,
    })
  }
  const accountId = parseInt(req.body.account_id);
  const accountData = await accountModel.getAccountByAccountId(accountId)
  const result = await accountModel.updatePassword(hashedPassword, account_id)
 if (result) {
  req.flash ("success", "You have successfully updated your password")
  res.status(201).render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
  })
 } else {
  req.flash("error", "Sorry the password update failed")
  res.status(501).render("account/updateView", {
    title: "Edit Account",
    nav,
    errors:null,
    account_id: accountData.accountId,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
  })
 }
}
/* ****************************************
*  Deliver logout view
* *************************************** */
// async function buildLogout(req, res, next) {
//   let nav = await utilities.getNav()
//   res.render("./account/logout", {
//       title: "Logout",
//       nav,
//       errors: null,
//   })
// }
/* ****************************************
 *  Process logout request
 *  Activity 5
 * ************************************ */
async function accountLogout(req, res) {
  // let nav = await utilities.getNav()
  res.locals.loggedin = 0
  res.locals.accountData = {}
  res.clearCookie("jwt")
  res.redirect("/")
  req.flash(
    "notice",
    `Welcome `
    `Congratulations, you\'re logged out.`
  )
   
}

/* *****************************************************
*                     Final
* ******************************************************/

/* ****************************************
*  Deliver message inbox view
* *****************************************/
async function buildInbox(req, res) {
  let nav = await utilities.getNav()
  const accountId = req.params.account_id
  const accountData = await accountModel.getAccountByAccountId(accountId)
  const messageDataTable = await accountModel.getMessagesById(accountId)
  const table = await utilities.buildMessageTable(messageDataTable.rows)
  res.render("account/inbox", {
    title: accountData.account_firstname + " " + accountData.account_lastname + " " + "inbox",
    nav,
    errors: null,
    table,
  })
}

/* ****************************************
*  Deliver message view
* *****************************************/
async function buildMessage(req, res) {
  let nav = await utilities.getNav()
  const messageId = req.params.message_id
  const messageData = await accountModel.getMessageViewById(messageId)
  let div = await utilities.buildMessageToRead(messageData)
  console.log(messageData)
  res.render("./account/messages", {
    title: messageData[0].message_subject,
    nav,
    div,
    errors:null,
    message_id: messageId
  })
}

/* ****************************************
*  Deliver create message view
* *****************************************/
async function newMessageView(req, res) {
let nav = await utilities.getNav()
const names = await accountModel.getAccountNames()
let select = await utilities.getName(names)
res.render("./account/createMessage", {
  title: "New Message",
  nav,
  select,
  errors:null,
})
}

/* ****************************************
*  Process message send
* *****************************************/
async function sendNewMessage (req, res) {
  const {message_to, message_from, message_subject, message_body} = req.body

  const result = await accountModel.newMessageSent(message_to, message_from, message_subject, message_body)
  if (result) {
    let nav = await utilities.getNav()
    let accNames = await accountModel.getAccountNames()
    let select = await utilities.getName(accNames)
    const accountId = req.params.account_id
    const accountData = await accountModel.getAccountByAccountId(accountId)
    const messageDataTable = await accountModel.getMessagesById(accountId)
    const table = await utilities.buildMessageTable(messageDataTable.rows)
    req.flash("success", "Your message has been sent")
    res.status(201).render("account/inbox", {
      title: "Account Management",
      nav,
      errors: null,
      select,
      table
    }) 
  } else {
    req.flash ("error", "Sorry. Message was not sent. Try again")
    res.status(501).render("account/createMessage", {
      title: "New message",
      nav,
      errors,
      select,
      table
    })
  }


}
module.exports = {
  buildLogin, buildRegister,
  registerAccount, accountLogin,
  buildManagement, accountUpdateView,
  updateInfo, updatePassword, accountLogout,
  buildInbox, buildMessage, newMessageView, sendNewMessage
}
  