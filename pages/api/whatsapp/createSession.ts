import * as whatsapp from "wa-multi-session";
import type { NextApiRequest, NextApiResponse } from 'next'
import checkAuthorizationHeader from '../../../services/authorization'
import { startSession } from "../../../services/startSession";
import QRCode from 'qrcode'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        //Start Session
        startSession();

        checkAuthorizationHeader(async (req: NextApiRequest, res: NextApiResponse) => {

            const sessionName = req.body.session;

            //Check Session
            const isSessionExist = whatsapp.getSession(sessionName!);
            if (isSessionExist == null) {
                //Custom Path Session
                whatsapp.setCredentialsDir(process.env.SESSION_PATH);

                //Create New Session
                const session = await whatsapp.startSession(sessionName);

                //Return Response
                whatsapp.onQRUpdated(async (data) => {
                    const qr = await QRCode.toDataURL(data.qr);
                    res.status(200).json({
                        code: 200,
                        message: 'Success Created',
                        data: qr
                    });

                });


            } else {
                res.status(403).json({
                    code: 403,
                    message: 'Session Already Exist',

                });
            }
        })(req, res);
    } else {
        // Handle any other HTTP method
        res.status(405).json({
            code: 405,
            message: 'Method Not Allowed'
        });
    }
}