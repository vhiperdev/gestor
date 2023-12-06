import { createPool, executeQuery } from './connectionDatabase';
createPool();

import * as whatsapp from "wa-multi-session";


function replaceVariables(message, replacements) {
  for (const key in replacements) {
    if (Object.prototype.hasOwnProperty.call(replacements, key)) {
      const placeholder = `{${key}}`;
      console.log("ini kunci",key)
      message = message.replace(new RegExp(placeholder, 'g'), replacements[key]);
    }
  }
  return message;
}

export const schedulerAfterFive = () => {
  const queryAfterFive = `SELECT u.username, c.clientPassword, c.clientName, c.clientEmail, c.whatsappNumber, DATE_FORMAT(c.startDate, '%Y-%m-%d') as expired_date, tm.message, p.productName, p.price as product_price, pl.planName, pl.price as plan_price, CASE WHEN c.invoiceStatus = 0 THEN 'Pending' WHEN c.invoiceStatus = 1 THEN 'Paid' ELSE 'Unknown' END AS invoiceStatus FROM clients c JOIN templateMessages tm ON c.userId = tm.userId JOIN plans pl ON c.plan = pl.id JOIN products p ON c.product = p.id JOIN users u ON c.userId = u.id WHERE c.reminderAfterTwo = 1 AND tm.codeMessage = 50 AND c.startDate >= DATE_SUB(CURDATE(), INTERVAL 5 DAY) AND c.startDate < DATE_SUB(CURDATE(), INTERVAL 4 DAY);`

  executeQuery(queryAfterFive)
    .then((results) => {
      const lengthResult = results.length

      if (lengthResult != 0) {
        results.forEach((item, index) => {
          let sessionName = item['username']
          let name = item['clientName']
          let username = item['clientEmail']
          let password = item['clientPassword']
          let whatsappNumber = item['whatsappNumber']
          let invoice_status = item['invoiceStatus']
          let product = `${item['productName']} (R$${item['product_price']})`
          let plan = `${item['planName']} (R$${item['plan_price']})`
          let expired_date = item['expired_date']
          let message = item['message']
          let application = item['application']
          let mac = item['mac']
          let keyApplication = item['keyApplication']

      
          let replacements = {
            name: name,
            username: username,
            password: password,
            whatsapp: whatsappNumber,
            invoice_status: invoice_status,
            product: product,
            plan: plan,
            expired_date: expired_date,
            application: application,
            mac: mac,
            key: keyApplication,
          };

          let modifiedMessage = replaceVariables(message, replacements);

          // send message to whatsapp
          sendMessage(sessionName, whatsappNumber, modifiedMessage)
        });
      };
    }).catch((err) => {
      console.log("error in scheduler Today")
    })
};


const sendMessage = async (sessionName, whatsappNumber, message) => {

  const sendMessage = await whatsapp.sendTextMessage({
    sessionId: sessionName, // session ID
    to: whatsappNumber, // always add country code (ex: 62)
    text: message, // message you want to send
  });
}
