const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
      return error.message
    }
}
/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
    try {
      const sql = "SELECT * FROM account WHERE account_email = $1"
      const email = await pool.query(sql, [account_email])
      return email.rowCount
    } catch (error) {
      return error.message
    }
}
  
/* *****************************
* Return account data using email address  - activity 5
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}
/* *****************************
* Return account data using account id
* ***************************** */
async function getAccountByAccountId (account_id) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname,account_lastname, account_email FROM account WHERE account_id = $1', [account_id])
      return result.rows[0]
  } catch(error) {
    return new Error("No account matches found")
  }
}

// Update account info & password in the DB
async function updateAccount(account_firstname, account_lastname, account_email, account_id) {
  try {
    const sql = "UPDATE public.account SET account_firstname =$1, account_lastname =$2, account_email =$3 WHERE account_id=$4 RETURNING *"
     return await pool.query(sql, [account_firstname, account_lastname, account_email, account_id])
  } catch(error) {
    console.log("model error: " + error )
  }
}

async function updatePassword(account_password, account_id) {
  try {
    const sql = "UPDATE public.account SET account_password =$1 WHERE account_id=$2 RETURNING *"
    return await pool.query(sql, [account_password, account_id])
  } catch(error) {
    console.log("model error: " + error)
  }
}

/* *****************************************************
*                     Final
* ******************************************************/


/* ***************************
 * Get message
 * ************************** */
async function getMessagesById(account_id) {
  try {
    const sql =
      'SELECT a.account_firstname, account_lastname, message_id, message_from, message_to, message_created, message_read, message_body, message_subject FROM message m FULL JOIN account a ON m.message_from = a.account_id WHERE message_to = $1 AND message_archived = false'
      return await pool.query(sql, [account_id]);
    } catch (error) {
    return new Error(error)
  }
}
/* ***************************
 * Get the message display without a join
 * ************************** */
async function getMessageViewByID(message_id) {
  try {
    const result = await pool.query('SELECT message_id, message_subject, message_from, message_body, message_created FROM public.message WHERE message_id = $1',
      [message_id]) 
  return result.rows
  } catch(error){
    return new Error(error)
  }
}

/* ***************************
 *  Get the account names for the dropdown list - select - create new message
 * ************************** */
async function getAccountNames(){
  return await pool.query('SELECT * FROM public.account ORDER BY account_firstname, account_lastname')
}

/* ***************************
 *  Insert new message into DB
 * ****************************/
async function sentMessage(message_to, message_from, message_subject, message_body) {
  try {
    const sql = 'INSERT INTO public.message (message_to, message_from, message_subject, message_body) VALUES ($1, $2, $3, $4) RETURNING *'
    return await pool.query(sql, [message_to, message_from, message_subject, message_body])
  } catch(error) {
    return error.message
  }
}
/* **********************************
 * Update to Mark as read in the DB
 * **********************************/

async function markMessageAsRead (message_id){
  try{
    const sql = "UPDATE public.message SET message_read = true WHERE message_id = $1"
    return await pool.query(sql, [message_id])
  } catch(error){
    return new Error(error)
  }
}

/* **********************************
 * Update to archive list in the DB
 * **********************************/
async function markMessageAsArchived (message_id){
  try{
    const sql = "UPDATE public.message SET message_archived = true WHERE message_id = $1"
    return await pool.query(sql, [message_id])
  } catch(error){
    return new Error(error)
  }
}

/* **********************************
 * Show archived messages in the DB
 * **********************************/
async function getArchivedMessages (message_to) {
  try {
    const result = await pool.query(
      'SELECT m.*, a.account_firstname AS message_from_firstname, a.account_lastname AS message_from_lastname FROM public.message m LEFT JOIN public.account a ON m.message_from = a.account_id WHERE m.message_to IN ($1) AND m.message_archived = true ORDER BY m.message_created desc',
      [message_to])
    return result.rows
  } catch (error) {
    return new Error("No message found")
  }
}

/* **********************************
 * Delete messages in the DB
 * **********************************/
async function deleteMessage(message_id) {
  try{
    const sql = "DELETE FROM public.message WHERE message_id = $1"
    return await pool.query(sql, [message_id])
  } catch(error){
    return new Error(error)
  }
}
/* *****************************
* Return messages not read using messages_to
* ***************************** */
async function getUnreadMessages(message_to) {
  try {
    const result = await pool.query(
      'SELECT message_id, message_subject, message_body, message_created, message_to, message_from, message_read, message_archived FROM message WHERE message_to = $1 AND message_read = false',
      [message_to])
    return result.rows
  } catch (error) {
    return new Error("No message found")
  }
}

// /* **********************************
//  * Select unread messages
//  * **********************************/
// async function unreadMessages(message_to) {
//   try {
//     const sql =
//     "SELECT COUNT(message_read) FROM message m FULL JOIN account a ON m.message_from = a.account_id WHERE message_to = $1 AND message_read = false GROUP BY message_read";
//     return await pool.query(sql, [message_to]);
//   } catch (error) {
//     return error.message;
//   }
// }

/* **********************************
 * Reply message
 * **********************************/
async function replyReceivedMessage (message_id, message_subject, message_body) {
  try {
    const sql = "UPDATE public.message SET message_subject = $2 ,message_body = $3 WHERE message_id = $1 ";
    return await pool.query(sql, [message_id, message_subject, message_body])
  } catch (error) {
    return error.message;
  }
}
module.exports = {
  registerAccount,
  checkExistingEmail,
  getAccountByEmail,
  updateAccount,
  updatePassword,
  getAccountByAccountId,
  getMessagesById,
  getMessageViewByID,
  getAccountNames,
  sentMessage,
  markMessageAsArchived,
  markMessageAsRead,
  getArchivedMessages,
  deleteMessage,
  getUnreadMessages,
  replyReceivedMessage
};