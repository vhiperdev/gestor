import type { NextApiRequest, NextApiResponse } from 'next'
import checkAuthorizationHeader from '../../../services/authorization'
import * as whatsapp from "wa-multi-session";
import { startSession } from '../../../services/startSession';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        //Start Session
        startSession();
        
        checkAuthorizationHeader(async (req: NextApiRequest, res: NextApiResponse) => {
            //Get Session Name from parameter
            const sessionName = req.query.sessionName?.toString();

            //Get Session by ID
            const session = whatsapp.getSession(sessionName!);
            
            res.status(200).json({ 
                code: 200,
                message: 'Success',
                data: session
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