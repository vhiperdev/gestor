import type { NextApiRequest, NextApiResponse } from 'next'
import checkAuthorizationHeader from '../../../services/authorization'
import * as whatsapp from "wa-multi-session";
import { startSession } from "../../../services/startSession";



export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        //Start Session
        startSession();
        
        checkAuthorizationHeader(async (req: NextApiRequest, res: NextApiResponse) => {
            //Get Session Name from Body
            const sessionName = req.body.session;
            const to = req.body.to;
            const message = req.body.message;

            //Check Session Name data from Body
            if (sessionName == null) {
                res.status(400).json({
                    code: 400,
                    message: 'Session Name is Required'
                });
            }

            //Check to data data from Body
            if (to == null) {
                res.status(400).json({
                    code: 400,
                    message: 'To is Required'
                });
            }

            //Check message data data from Body
            if (message == null) {
                res.status(400).json({
                    code: 400,
                    message: 'Message is Required'
                });
            }

            //Check Session
            const isSessionExist = whatsapp.getSession(sessionName!);
            if (isSessionExist != null) {
                try {
                    //Send Message
                    const sendMessage = await whatsapp.sendTextMessage({
                        sessionId: sessionName, // session ID
                        to: to, // always add country code (ex: 62)
                        text: message, // message you want to send
                    });

                    res.status(200).json({
                        code: 200,
                        message: 'Success Send Message'
                    });
                } catch (error: any) {
                    res.status(500).json({
                        code: 500,
                        message: error!.message
                    });
                }
            } else {
                res.status(404).json({
                    code: 404,
                    message: 'Session Not Found',

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