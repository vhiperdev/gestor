import type { NextApiRequest, NextApiResponse } from "next";
import checkAuthorizationHeader from "../../../services/authorization";
import { createPool, executeQuery } from "../../../services/connectionDatabase";
createPool();

// clientPassword, product, plan, comment, startDate, autoRenewal,
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    checkAuthorizationHeader(
      async (req: NextApiRequest, res: NextApiResponse) => {
        const uid = req.query.userid;
        const query = `SELECT clients.clientName AS clientName, clients.whatsappNumber AS whatsappNumber, clients.clientEmail AS clientEmail, clients.clientPassword,products.productName AS productName,products.price AS productPrice, plans.planName AS planName, plans.price AS planPrice, clients.comment, DATE_FORMAT(NOW(), '%Y-%m-%d') AS expiredDate, clients.autoRenewal, clients.status FROM clients INNER JOIN plans ON clients.plan = plans.id INNER JOIN products ON clients.product = products.id`;

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
