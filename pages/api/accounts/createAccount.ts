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
    if (req.method === 'POST') {
        checkAuthorizationHeader(async (req: NextApiRequest, res: NextApiResponse) => {
            const { email, name, password } = req.body;

            const queryCheckDb = `select * from users where email='${email}'`;

            // Example usage
            const userToAdd: CreateUserRequest = {
                email: email,
                name: name,
                password: password,
                connection: 'Username-Password-Authentication', // Adjust connection based on your Auth0 setup
            };
            if (email == null || name == null || password == null) {
                res.status(400).json({
                    code: 400,
                    message: 'Bad Request',
                });
            }
            return new Promise<any[]>((resolve, reject) => {
                executeQuery(queryCheckDb)
                    .then((results) => {
                        if (results[0] != undefined) {
                            res.status(400).json({
                                code: 400,
                                message: 'Username already exists',
                            });
                        } else if (results[0] == undefined) {
                            //executing adding user to auth0
                            createUser(userToAdd).then((data) => {
                                if (data.data == undefined) {
                                    res.status(data.statusCode).json({
                                        code: data.statusCode,
                                        error: data.error,
                                        message: data.message
                                    })
                                } else {
                                    const queryInsertDb = `insert into users VALUES('${data.data.user_id}', '${data.data.email}', '${data.data.nickname}', '${data.data.picture}', "", 1, 0, '${data.data.created_at}');`;
                                    executeQuery(queryInsertDb)
                                        .then((results) => {
                                            res.status(201).json({
                                                code: 201,
                                                message: "Succesfully Created"
                                            });
                                        })
                                        .catch((err) => {
                                            console.log(err)
                                            res.status(503).json({
                                                code: 503,
                                                message: "Internal Server Error"
                                            });
                                        });
                                }
                            })
                        }
                    })
                    .catch((err) => {
                        console.error('Error executing query:', err);
                        return err
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