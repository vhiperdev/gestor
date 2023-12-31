import type { NextApiRequest, NextApiResponse } from "next";
import checkAuthorizationHeader from "../../../services/authorization";
import { createPool, executeQuery } from "../../../services/connectionDatabase";
import { startDailyJob } from "../../../services/startScheduler";
createPool();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    startDailyJob()
    checkAuthorizationHeader(
      async (req: NextApiRequest, res: NextApiResponse) => {
        const uid = req.query.userid;
        const query = `SELECT * FROM clients WHERE userId = '${uid}'`;

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
