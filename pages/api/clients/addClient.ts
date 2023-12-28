import type { NextApiRequest, NextApiResponse } from "next";
import checkAuthorizationHeader from "../../../services/authorization";
import { createPool, executeQuery } from "../../../services/connectionDatabase";
import * as whatsapp from "wa-multi-session";
createPool();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    checkAuthorizationHeader(
      async (req: NextApiRequest, res: NextApiResponse) => {
        const {
          userId,
          name,
          whatsappNumber,
          username,
          password,
          plan,
          product,
          invoiceStatus, //0 for pending, 1 for paid
          expiredDate,
          status,
          autoRenewal, //0 for false. 1 for true
          before3DayNotification,
          before2DayNotification,
          before1DayNotification,
          onDueDateNotification, //0 for false. 1 for true
          after1DayNotification, //0 for false. 1 for true
          after2DayNotification, //0 for false. 1 for true
          after3DayNotification, //0 for false. 1 for true
          comments,
          application,
          mac,
          keyApplication,
          session,
          screens,
        } = req.body;

        const newAutoRenewal = autoRenewal ? 1 : 0;
        const newBefore3DayNotification = before3DayNotification ? 1 : 0;
        const newBefore2DayNotification = before2DayNotification ? 1 : 0;
        const newBefore1DayNotification = before1DayNotification ? 1 : 0;
        const newOnDueDateNotification = onDueDateNotification ? 1 : 0;
        const newAfter1DayNotification = after1DayNotification ? 1 : 0;
        const newAfter2DayNotification = after2DayNotification ? 1 : 0;
        const newAfter3DayNotification = after3DayNotification ? 1 : 0;
        const newExpiredDate = expiredDate.slice(0, 10);

        const sendMessage = async (sessionName, whatsappNumber, message) => {
          try {
            await whatsapp.sendTextMessage({
              sessionId: sessionName, // session ID
              to: whatsappNumber, // always add country code (ex: 62)
              text: message, // message you want to send
            });
          } catch (error) {}
        };

        if (newAutoRenewal == 1) {
          // console.log(session, whatsappNumber);
          executeQuery(
            `SELECT planName, price FROM plans WHERE id = ${plan}`
          ).then((result) => {
            const planName = result[0]["planName"];
            const price = result[0]["price"];
            sendMessage(
              session,
              whatsappNumber,
              `📌 Thank you for trusting our work✅ ${name} \n assinatura renovado com sucesso.\n ● Next due date: ${newExpiredDate}● Payment: ${
                invoiceStatus == 1 ? "Paid" : "Pending"
              }.\n ● Plan: ${planName}● Value: (R$${price})👥🚦 REFER 1 FRIEND AND GET 1 MONTH FREE`
            );
          });
        }

        const query = `INSERT INTO clients ( userId, clientName, whatsappNumber, clientEmail, clientPassword, product, plan, invoiceStatus, reminderBeforeOne, reminderBeforeTwo, reminderBeforeThree, reminderToday, reminderAfterOne, reminderAfterTwo, reminderAfterThree, comment, startDate, autoRenewal, status, application, mac, keyApplication, screens ) VALUES ('${userId}', '${name}', '55${whatsappNumber}', '${username}', '${password}', '${product}', '${plan}', '${invoiceStatus}', '${newBefore1DayNotification}', '${newBefore2DayNotification}', '${newBefore3DayNotification}', '${newOnDueDateNotification}', '${newAfter1DayNotification}', '${newAfter2DayNotification}', '${newAfter3DayNotification}', '${comments}', '${newExpiredDate}', '${newAutoRenewal}', '${status}', '${application}', '${mac}', '${keyApplication}', '${screens}')`;

        return new Promise<any[]>((resolve, reject) => {
          executeQuery(query)
            .then((results) => {
              executeQuery(
                `SELECT price FROM products WHERE id = '${product}'`
              ).then((result) => {
                const isi = result[0]["price"];
                for (let i = 0; i < screens; i++) {
                  executeQuery(
                    `INSERT INTO transactions (userId, typeOfSales, date, notes, price) VALUES ('${userId}', '1', '${new Date().getFullYear()}-${
                      new Date().getMonth() + 1
                    }-${new Date().getDate()}', '', '${isi}')`
                  );
                }
              });
              executeQuery(`SELECT price FROM plans WHERE id= '${plan}'`).then(
                (result) => {
                  const isi2 = result[0]["price"];
                  for (let i = 0; i < screens; i++) {
                    executeQuery(
                      `INSERT INTO transactions (userId, typeOfSales, date, notes, price) VALUES ('${userId}', '0', '${new Date().getFullYear()}-${
                        new Date().getMonth() + 1
                      }-${new Date().getDate()}', '', '${isi2}')`
                    );
                  }
                }
              );
              res.status(200).json({
                code: 200,
                message: "OK",
                data: results,
              });
            })
            .catch((err) => {
              console.error("Error executing query:", err);
            });
        });
      }
    )(req, res);
  } else {
    // Handle any other HTTP method
    res.status(405).json({
      code: 405,
      message: "Method Not Allowed",
    });
  }
}
