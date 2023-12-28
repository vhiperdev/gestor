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
          expiredDate,
          status,
          userId,
          whatsappNumber,
        } = req.body;

        console.log(expiredDate, id);

        const query = `UPDATE clients SET startDate = '${expiredDate}', autoRenewal = '1' WHERE id = '${id}'`;

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
