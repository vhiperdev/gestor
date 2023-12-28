import type { NextApiRequest, NextApiResponse } from "next";
import checkAuthorizationHeader from "../../../services/authorization";
import { createPool, executeQuery } from "../../../services/connectionDatabase";
import * as whatsapp from "wa-multi-session";
createPool();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    checkAuthorizationHeader(
      async (req: NextApiRequest, res: NextApiResponse) => {
        const { json, userId } = req.body;
        console.log(json, userId);

        json.forEach((element) => {
          const query = `INSERT INTO clients ( userId, clientName, whatsappNumber, clientEmail, clientPassword, product, plan, invoiceStatus, reminderBeforeOne, reminderBeforeTwo, reminderBeforeThree, reminderToday, reminderAfterOne, reminderAfterTwo, reminderAfterThree, comment, startDate, autoRenewal, status, application, mac, keyApplication, screens ) VALUES ('${userId}', '${element.name}', '${element.whatsappNumber}', '${element.username}', '${element.password}', '${element.product}', '${element.plan}', '0', '0', '0', '0', '0', '0', '$0', '$0', '', '${element.expiredDate}', '0', 'active', '', '', '', '1')`;
        });

        res.status(200).json({
          code: 200,
          message: "OK",
        });

        // return new Promise<any[]>((resolve, reject) => {
        //   executeQuery(query)
        //     .then((results) => {
        //       executeQuery(
        //         `SELECT price FROM products WHERE id = '${product}'`
        //       ).then((result) => {
        //         const isi = result[0]["price"];
        //         for (let i = 0; i < screens; i++) {
        //           executeQuery(
        //             `INSERT INTO transactions (userId, typeOfSales, date, notes, price) VALUES ('${userId}', '1', '${new Date().getFullYear()}-${
        //               new Date().getMonth() + 1
        //             }-${new Date().getDate()}', '', '${isi}')`
        //           );
        //         }
        //       });
        //       executeQuery(`SELECT price FROM plans WHERE id= '${plan}'`).then(
        //         (result) => {
        //           const isi2 = result[0]["price"];
        //           for (let i = 0; i < screens; i++) {
        //             executeQuery(
        //               `INSERT INTO transactions (userId, typeOfSales, date, notes, price) VALUES ('${userId}', '0', '${new Date().getFullYear()}-${
        //                 new Date().getMonth() + 1
        //               }-${new Date().getDate()}', '', '${isi2}')`
        //             );
        //           }
        //         }
        //       );
        //       res.status(200).json({
        //         code: 200,
        //         message: "OK",
        //         data: results,
        //       });
        //     })
        //     .catch((err) => {
        //       console.error("Error executing query:", err);
        //     });
        // });
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
