import { NextApiRequest, NextApiResponse } from 'next';

export default function checkAuthorizationHeader(handler: any) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        const authHeader = req.headers['x-authorization'];
        if (authHeader) {
            const token = authHeader.toString();

            if (token === process.env.API_KEY) {
                return handler(req, res);
            } else {
                res.status(401).json({
                    code: 401,
                    message: 'Unauthorized'
                });
            }
        } else {
            res.status(401).json({
                code: 401,
                message: 'Unauthorized'
            });
        }

    };
}

