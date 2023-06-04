const invModel = require("../models/inventory-model")
const Util = {}

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

module.exports = Util
/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}
/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
/* ****************************************
* Display only specific vehicle's info
 **************************************** */
Util.displayDetail = async function (data) {
  let detail
  // if (data.length > 0) {
    detail = '<div id="single-display">'
      detail += '<div>'
      detail += '<img src="' + data.inv_image + 'alt="Image of ' + data.inv_make + ' ' + data.inv_model + '"/>'
      detail += '<div class="vehicle-detail">'
      detail += '<hr/>'
      detail += '<h2>' + data.inv_year + ' ' + data.inv_make + ' ' + data.inv_model + '</h2>'
    detail += '<hr/>'
    
    detail += '<h3>Price: $'+ new Intl.NumberFormat('en-US').format(data.inv_price) + '</h3>'
    detail += '<hr/>'
    detail += '<p>' + 'Description: ' + data.inv_description + '</p>'
    detail += '<hr/>'
    detail += '<p> Miles:'+ data.inv_miles +'</p>'
    detail += '<hr/>'
    detail += '<p> Color:'+ data.inv_color +'</p>'
    detail += '<hr/>'
    
    detail += '</div>'
      detail += '</div>'
  // } else {
  //   detail += '<p class="notice">Sorry, no matching data could be found.</p>'
  // }
  return detail
}