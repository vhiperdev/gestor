import type { NextApiRequest, NextApiResponse } from "next";
import checkAuthorizationHeader from "../../../services/authorization";
import { createPool, executeQuery } from "../../../services/connectionDatabase";
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
          reminderAfterOne,
          reminderAfterThree,
          reminderAfterTwo,
          reminderBeforeOne,
          reminderBeforeThree,
          reminderBeforeTwo,
          reminderToday,

          status,
          userId,
          whatsappNumber,
        } = req.body;

        const query = `UPDATE clients SET clientName = '${clientName}', whatsappNumber = '${whatsappNumber}', clientEmail = '${clientEmail}', clientPassword = '${clientPassword}', product = '${product}', plan = '${plan}', invoiceStatus = '${invoiceStatus}', reminderBeforeOne = '${reminderBeforeOne}', reminderBeforeTwo = '${reminderBeforeTwo}', reminderBeforeThree = '${reminderBeforeThree}', reminderToday = '${reminderToday}', reminderAfterOne = '${reminderAfterOne}', reminderAfterTwo = '${reminderAfterTwo}', reminderAfterThree = '${reminderAfterThree}', comment = '${comment}', autoRenewal = '${autoRenewal}', status = '${status}' WHERE id = '${id}'`;

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
