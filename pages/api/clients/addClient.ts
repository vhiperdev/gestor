import type { NextApiRequest, NextApiResponse } from "next";
import checkAuthorizationHeader from "../../../services/authorization";
import { createPool, executeQuery } from "../../../services/connectionDatabase";
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
        } = req.body;

        const newAutoRenewal = autoRenewal ? 1 : 0;
        const newBefore3DayNotification = before3DayNotification ? 1 : 0;
        const newBefore2DayNotification = before2DayNotification ? 1 : 0;
        const newBefore1DayNotification = before1DayNotification ? 1 : 0;
        const newOnDueDateNotification = onDueDateNotification ? 1 : 0;
        const newAfter1DayNotification = after1DayNotification ? 1 : 0;
        const newAfter2DayNotification = after2DayNotification ? 1 : 0;
        const newAfter3DayNotification = after3DayNotification ? 1 : 0;

        const query = `INSERT INTO clients ( userId, clientName, whatsappNumber, clientEmail, clientPassword, product, plan, invoiceStatus, reminderBeforeOne, reminderBeforeTwo, reminderBeforeThree, reminderToday, reminderAfterOne, reminderAfterTwo, reminderAfterThree, comment, startDate, autoRenewal, status ) VALUES ('${userId}', '${name}', '${whatsappNumber}', '${username}', '${password}', '${product}', '${plan}', '${invoiceStatus}', '${newBefore1DayNotification}', '${newBefore2DayNotification}', '${newBefore3DayNotification}', '${newOnDueDateNotification}', '${newAfter1DayNotification}', '${newAfter2DayNotification}', '${newAfter3DayNotification}', '${comments}', '${expiredDate}', '${newAutoRenewal}', '${status}')`;

        return new Promise<any[]>((resolve, reject) => {
          executeQuery(query)
            .then((results) => {
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
