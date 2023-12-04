import type { NextApiRequest, NextApiResponse } from 'next'
import checkAuthorizationHeader from '../../../services/authorization'
import * as whatsapp from "wa-multi-session";
import { startSession } from '../../../services/startSession';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        //Start Session
        startSession();

        checkAuthorizationHeader(async (req: NextApiRequest, res: NextApiResponse) => {
            //Get All Session
            const sessions = whatsapp.getAllSession();
            
            res.status(200).json({ 
                code: 200,
                message: 'Success',
                data: sessions
             });
        })(req, res);
    } else {
        // Handle any other HTTP method
        res.status(405).json({
            code: 405,
            message: 'Method Not Allowed'
        });
    }
}