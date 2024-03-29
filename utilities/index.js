const invModel = require("../models/inventoryModel")
// activity 5
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}
const accModel = require("../models/account-model")

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}
/* ************************
 * Classification options list in the add new vehicle form
 ************************** */
Util.getClassificationOptions = async function (optionSelected=null) {
  let data = await invModel.getClassifications()
  let options = '<select id="classificationId" name="classification_id" required>'
  options += "<option value = ''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    options += `
    <option value ="${row.classification_id}" ${row.classification_id === Number(optionSelected) ? 'selected' : ''}
    >
    ${row.classification_name}
      </option>`
  })
  options +="</select>"

  return options
}
/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      // grid += '<div class="vehicle-display">'
      grid += '<li class="vehicle-display">'
      grid += '<div class="img-display">'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="'+ vehicle.inv_make + ' ' + vehicle.inv_model 
        + ' on CSE Motors" /></a>'
      grid += '</div>'

      grid += '<div class="namePrice">'
      grid += '<p>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</p>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
      // grid += '</div>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}
/* ****************************************
* Display only specific vehicle's info
 **************************************** */
Util.displayDetail = async function (data) {
  let detail
  // if (data.length > 0) {
    detail = '<div id="single-display">'
      detail += '<div id="single-picture">'
        detail += '<img src="' + data.inv_image + '" alt="Image_of_' + data.inv_make + '_'+ data.inv_model + '"/>'
        detail += '</div>'
      detail += '<div class="vehicle-detail">'
      detail += '<h2>' + data.inv_year + ' ' + data.inv_make + ' ' + data.inv_model + '</h2>'    
    detail += '<h3>Price: $'+ new Intl.NumberFormat('en-US').format(data.inv_price) + '</h3>'

    detail += '<p>' + 'Description: ' + data.inv_description + '</p>'

    detail += '<p> Miles:'+ data.inv_miles +'</p>'
 
    detail += '<p> Color:'+ data.inv_color +'</p>'    
    detail += '</div>'
    detail += '</div>'

  // } else {
  //   detail += '<p class="notice">Sorry, no matching data could be found.</p>'
  // }
  return detail
}



/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
/* ****************************************
* Middleware to check token validity -activity 5 
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }
/* ****************************************
 *  Check Login - activity 5
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }
/* ****************************************
 *  Check Login - activity 5
 * ************************************ */
Util.checkAccountType = (req, res, next) => {
  if (res.locals.loggedin != 1){
    req.flash("error", "You do not have permission to access this page.")
    res.status(403).redirect("/account/login")
  }
  // receive the account type from the payload
  const account_type = res.locals.accountData.account_type
  // verify if the account is an employee or an admin
  if (account_type === 'Employee' || account_type === 'Admin') {
    next() // move to the next thing
  } else {
    req.flash("error", "You do not have permission to access this page.")
    res.status(403).redirect("/account/login")
  }
}
 /* ***************************************************
*                      Final
* *******************************************************/
/* ********************************************
*  Build the table for messages
* *********************************************/
Util.buildMessageTable = async function (item) {
  let table = '<table><thead>'
  table += '<tr><th>Received</th><th>Subject</th><th>From</th><th>Read</th></tr>'
  table += '</thead>'
  
  table += '<tbody>'
  item.forEach((item) => {
    table += `<tr><td>${item.message_created.toISOString().slice(0, 10)}</td><td> 
    <a href='/account/messages/${item.message_id}'> ${item.message_subject}</a></td> <td>${item.account_firstname} ${item.account_lastname}</td><td>${item.message_read}</td></tr>`
  })
  table += '</tbody></table>'
  return table
}

/* **********************************************
 * Drop down menu for Names
 ************************************************/
Util.getName = async function(optionSelected) {
  let data = await accModel.getAccountNames()
  let select = "<select name='account_id' id='accountNames'>"
  let options = "<option value=''>Choose an email recipient</option>"
  data.rows.forEach((row) => {
    options += `
    <option
      value = "${row.account_firstname} ${row.account_lastname}"
      ${row.account_firstname === Number(optionSelected)? 'selected':''} > ${row.account_firstname} ${row.account_lastname} </option>`
    })
  select += options
  select += "</select>"
  return select
}
module.exports = Util