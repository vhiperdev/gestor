import { createPool, executeQuery } from './connectionDatabase';
import * as whatsapp from "wa-multi-session";


createPool();


export const schedulerToday = () => {
  const queryToday = `SELECT u.username, c.clientName, c.clientEmail, c.whatsappNumber, c.startDate as expired_date, tm.message, p.productName, p.price as product_price, pl.planName, pl.price as plan_price, CASE WHEN c.invoiceStatus = 0 THEN 'Pending' WHEN c.invoiceStatus = 1 THEN 'Paid' ELSE 'Unknown' END AS invoiceStatus FROM clients c JOIN templateMessages tm ON c.userId = tm.userId JOIN plans pl ON c.plan = pl.id JOIN products p ON c.product = p.id JOIN users u ON c.userId = u.id WHERE c.reminderToday = 1 AND tm.codeMessage = 100 AND DATE(c.startDate) = CURDATE();`

  executeQuery(queryToday)
  .then((results) => {
    results.forEach(async (item, index) => {
        let sessionName = item['username']
        let name = item['clientName']
        let username = item['clientEmail']
        let whatsapp = item['whatsappNumber']
        let invoice_status = item['invoiceStatus']
        let product = `${item['productName']} (R$${item['product_price']})`
        let plan = `${item['planName']} (R$${item['plan_price']})`
        let expired_date = Date.parse(item['expired_date'])
        let message = item['message']

        //send message to whatsapp
        // const sendMessage = await whatsapp.sendTextMessage({
        //     sessionId: sessionName, // session ID
        //     to: whatsapp, // always add country code (ex: 62)
        //     text: message, // message you want to send
        // });
      });
  }).catch((err) => {
    console.log("error in scheduler Today")
  })
  };
