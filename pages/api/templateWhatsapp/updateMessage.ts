import type { NextApiRequest, NextApiResponse } from 'next'
import checkAuthorizationHeader from '../../../services/authorization';
import { createPool, executeQuery } from '../../../services/connectionDatabase';
import axios from 'axios';

createPool();

interface CreateUserRequest {
    email: string;
    password: string;
    connection: string;
    name: string
}


const auth0Domain = process.env.AUTH0_ISSUER_BASE_URL;

const createUser = async (user: CreateUserRequest) => {
    try {
        const response = await axios.post(
            `${auth0Domain}/api/v2/users`,
            user,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.AUTH0_KEY_MANAGEMET}`,
                },
            }
        );

        return response;
    } catch (error: any) {
        return error.response?.data
        // console.error('Error creating user:', error.response?.data || error.message);
    }
};


export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        checkAuthorizationHeader(async (req: NextApiRequest, res: NextApiResponse) => {
            const { id, message } = req.body;

            const queryUpdate = `UPDATE templatemessages SET message = '${message}' WHERE id = ${id};`;
            return new Promise<any[]>((resolve, reject) => {
                executeQuery(queryUpdate)
                    .then((results) => {
                        res.status(204).json({
                            code: 204,
                            message: "Succesfully Updated"
                        });
                    })
                    .catch((err) => {
                        res.status(503).json({
                            code: 503,
                            message: "Internal Server Error"
                        });
                    });
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