import type { NextApiRequest, NextApiResponse } from "next";
import checkAuthorizationHeader from "../../../services/authorization";
import { createPool, executeQuery } from "../../../services/connectionDatabase";
import * as whatsapp from "wa-multi-session";
createPool();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "PUT") {
    checkAuthorizationHeader(
      async (req: NextApiRequest, res: NextApiResponse) => {
        const {
          autoRenewal,
          clientEmail,
          clientName,
          clientPassword,
          comment,
          id,
          invoiceStatus,
          plan,
          product,
          before1DayNotification,
          after3DayNotification,
          after2DayNotification,
          after1DayNotification,
          before3DayNotification,
          before2DayNotification,
          onDueDateNotification,
          startDate,
          status,
          userId,
          whatsappNumber,
          application,
          mac,
          keyApplication,
          session,
        } = req.body;

        const newAutoRenewal = autoRenewal ? 1 : 0;
        const newBefore3DayNotification = before3DayNotification ? 1 : 0;
        const newBefore2DayNotification = before2DayNotification ? 1 : 0;
        const newBefore1DayNotification = before1DayNotification ? 1 : 0;
        const newOnDueDateNotification = onDueDateNotification ? 1 : 0;
        const newAfter1DayNotification = after1DayNotification ? 1 : 0;
        const newAfter2DayNotification = after2DayNotification ? 1 : 0;
        const newAfter3DayNotification = after3DayNotification ? 1 : 0;

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
              `📌 Thank you for trusting our work✅  \n assinatura renovado com sucesso.\n ● Next due date: ${startDate}● Payment: ${
                invoiceStatus == 1 ? "Paid" : "Pending"
              }.\n ● Plan: ${planName}● Value: (R$${price})👥🚦 REFER 1 FRIEND AND GET 1 MONTH FREE`
            );
          });
        }

        const query = `UPDATE clients SET clientName = '${clientName}', whatsappNumber = '${whatsappNumber}', clientEmail = '${clientEmail}', clientPassword = '${clientPassword}', product = '${product}', plan = '${plan}', invoiceStatus = '${invoiceStatus}', reminderBeforeOne = '${newBefore1DayNotification}', reminderBeforeTwo = '${newBefore2DayNotification}', reminderBeforeThree = '${newBefore3DayNotification}', reminderToday = '${newOnDueDateNotification}', reminderAfterOne = '${newAfter1DayNotification}', reminderAfterTwo = '${newAfter2DayNotification}', reminderAfterThree = '${newAfter3DayNotification}', comment = '${comment}', autoRenewal = '${newAutoRenewal}', status = '${status}', application = '${application}', mac = '${mac}', keyApplication = '${keyApplication}', startDate = '${startDate}' WHERE id = '${id}'`;

        return new Promise<any[]>((resolve, reject) => {
          executeQuery(query)
            .then((results) => {
              executeQuery(
                `SELECT price FROM products WHERE id = '${product}'`
              ).then((result) => {
                const isi = result[0]["price"];

                executeQuery(
                  `INSERT INTO transactions (userId, typeOfSales, date, notes, price) VALUES ('${userId}', '1', '${new Date().getFullYear()}-${
                    new Date().getMonth() + 1
                  }-${new Date().getDate()}', '', '${isi}')`
                );
              });
              executeQuery(`SELECT price FROM plans WHERE id= '${plan}'`).then(
                (result) => {
                  const isi2 = result[0]["price"];
                  executeQuery(
                    `INSERT INTO transactions (userId, typeOfSales, date, notes, price) VALUES ('${userId}', '0', '${new Date().getFullYear()}-${
                      new Date().getMonth() + 1
                    }-${new Date().getDate()}', '', '${isi2}')`
                  );
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
