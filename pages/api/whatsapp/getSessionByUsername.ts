import type { NextApiRequest, NextApiResponse } from 'next'
import checkAuthorizationHeader from '../../../services/authorization'
import * as whatsapp from "wa-multi-session";
import { startSession } from '../../../services/startSession';
import { schedulerToday } from '../../../services/schedulerToday';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        //Start Session
        startSession();
        // schedulerToday()

        checkAuthorizationHeader(async (req: NextApiRequest, res: NextApiResponse) => {
            const session = req.query.session as string
            //Get Session by UserName
            const sessions = whatsapp.getSession(session);
            
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