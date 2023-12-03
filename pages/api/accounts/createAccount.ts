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
                                            //00 for today
                                            const queryTodayTemplateMessage = `INSERT INTO templatemessages VALUES (NULL, '${data.data.user_id}', 'Dear {name},

                                            We hope this message finds you well. We would like to inform you that your subscription with us has reached its expiration date as of today, {expired_date}. We greatly appreciate your continued support and would like to ensure uninterrupted access to our services.
                                            
                                            To avoid any disruption in your subscription, we kindly request that you make the payment at your earliest convenience. Please find the details for the payment below:
                                            
                                            Subscription Type: {plan}
                                            Expiration Date: {expired_date}
                                            
                                            You can make the payment by {expired_date}. If you have already initiated the payment, we sincerely thank you for your prompt response.
                                            
                                            Should you encounter any issues or require assistance, feel free to contact our customer support team. We are here to help and ensure a smooth renewal process.
                                            
                                            Thank you for being a valued subscriber. We look forward to your continued patronage.
                                            
                                            Best regards,
                                            
                                            Diego
                                            +55-85-9629-5391', '100', '1');`

                                            //3 for three day before
                                            const queryThreeBeforeTemplateMessage = `INSERT INTO templatemessages VALUES (NULL, '${data.data.user_id}', 'Dear {name},

                                            We hope this message finds you well. We would like to inform you that your subscription with us has reached its expiration in 3 days, {expired_date}. We greatly appreciate your continued support and would like to ensure uninterrupted access to our services.
                                            
                                            To avoid any disruption in your subscription, we kindly request that you make the payment at your earliest convenience. Please find the details for the payment below:
                                            
                                            Subscription Type: {plan}
                                            Expiration Date: {expired_date}
                                            
                                            You can make the payment by {expired_date}. If you have already initiated the payment, we sincerely thank you for your prompt response.
                                            
                                            Should you encounter any issues or require assistance, feel free to contact our customer support team. We are here to help and ensure a smooth renewal process.
                                            
                                            Thank you for being a valued subscriber. We look forward to your continued patronage.
                                            
                                            Best regards,
                                            
                                            Diego
                                            +55-85-9629-5391', '3', '1');`

                                            //2 for two day before
                                            const queryTwoBeforeTemplateMessage = `INSERT INTO templatemessages VALUES (NULL, '${data.data.user_id}', 'Dear {name},

                                            We hope this message finds you well. We would like to inform you that your subscription with us has reached its expiration in 2 days, {expired_date}. We greatly appreciate your continued support and would like to ensure uninterrupted access to our services.
                                            
                                            To avoid any disruption in your subscription, we kindly request that you make the payment at your earliest convenience. Please find the details for the payment below:
                                            
                                            Subscription Type: {plan}
                                            Expiration Date: {expired_date}
                                            
                                            You can make the payment by {expired_date}. If you have already initiated the payment, we sincerely thank you for your prompt response.
                                            
                                            Should you encounter any issues or require assistance, feel free to contact our customer support team. We are here to help and ensure a smooth renewal process.
                                            
                                            Thank you for being a valued subscriber. We look forward to your continued patronage.
                                            
                                            Best regards,
                                            
                                            Diego
                                            +55-85-9629-5391', '2', '1');`

                                            //1 for one day before
                                            const queryOneBeforeTemplateMessage = `INSERT INTO templatemessages VALUES (NULL, '${data.data.user_id}', 'Dear {name},

                                            We hope this message finds you well. We would like to inform you that your subscription with us has reached its expiration in 1 days, {expired_date}. We greatly appreciate your continued support and would like to ensure uninterrupted access to our services.
                                            
                                            To avoid any disruption in your subscription, we kindly request that you make the payment at your earliest convenience. Please find the details for the payment below:
                                            
                                            Subscription Type: {plan}
                                            Expiration Date: {expired_date}
                                            
                                            You can make the payment by {expired_date}. If you have already initiated the payment, we sincerely thank you for your prompt response.
                                            
                                            Should you encounter any issues or require assistance, feel free to contact our customer support team. We are here to help and ensure a smooth renewal process.
                                            
                                            Thank you for being a valued subscriber. We look forward to your continued patronage.
                                            
                                            Best regards,
                                            
                                            Diego
                                            +55-85-9629-5391', '1', '1');`

                                            //10 for one day after
                                            const queryOneAfterTemplateMessage = `INSERT INTO templatemessages VALUES (NULL, '${data.data.user_id}', 'Dear {name},

                                            We hope this message finds you well. We would like to inform you that your subscription with us has reached its expired 1 days ago, {expired_date}. We greatly appreciate your continued support and would like to ensure uninterrupted access to our services.
                                            
                                            To avoid any disruption in your subscription, we kindly request that you make the payment at your earliest convenience. Please find the details for the payment below:
                                            
                                            Subscription Type: {plan}
                                            Expiration Date: {expired_date}
                                            
                                            You can make the payment by {expired_date}. If you have already initiated the payment, we sincerely thank you for your prompt response.
                                            
                                            Should you encounter any issues or require assistance, feel free to contact our customer support team. We are here to help and ensure a smooth renewal process.
                                            
                                            Thank you for being a valued subscriber. We look forward to your continued patronage.
                                            
                                            Best regards,
                                            
                                            Diego
                                            +55-85-9629-5391', '10', '1');`

                                            //30 for three day after
                                            const queryThreeAfterTemplateMessage = `INSERT INTO templatemessages VALUES (NULL, '${data.data.user_id}', 'Dear {name},

                                            We hope this message finds you well. We would like to inform you that your subscription with us has reached its expired 3 days ago, {expired_date}. We greatly appreciate your continued support and would like to ensure uninterrupted access to our services.
                                            
                                            To avoid any disruption in your subscription, we kindly request that you make the payment at your earliest convenience. Please find the details for the payment below:
                                            
                                            Subscription Type: {plan}
                                            Expiration Date: {expired_date}
                                            
                                            You can make the payment by {expired_date}. If you have already initiated the payment, we sincerely thank you for your prompt response.
                                            
                                            Should you encounter any issues or require assistance, feel free to contact our customer support team. We are here to help and ensure a smooth renewal process.
                                            
                                            Thank you for being a valued subscriber. We look forward to your continued patronage.
                                            
                                            Best regards,
                                            
                                            Diego
                                            +55-85-9629-5391', '30', '1');`

                                            //50 for five day after
                                            const queryFiveAfterTemplateMessage = `INSERT INTO templatemessages VALUES (NULL, '${data.data.user_id}', 'Dear {name},

                                            We hope this message finds you well. We would like to inform you that your subscription with us has reached its expired 5 days ago, {expired_date}. We greatly appreciate your continued support and would like to ensure uninterrupted access to our services.
                                            
                                            To avoid any disruption in your subscription, we kindly request that you make the payment at your earliest convenience. Please find the details for the payment below:
                                            
                                            Subscription Type: {plan}
                                            Expiration Date: {expired_date}
                                            
                                            You can make the payment by {expired_date}. If you have already initiated the payment, we sincerely thank you for your prompt response.
                                            
                                            Should you encounter any issues or require assistance, feel free to contact our customer support team. We are here to help and ensure a smooth renewal process.
                                            
                                            Thank you for being a valued subscriber. We look forward to your continued patronage.
                                            
                                            Best regards,
                                            
                                            Diego
                                            +55-85-9629-5391', '50', '1');`



                                            executeQuery(queryTodayTemplateMessage).then((results) => {
                                                executeQuery(queryThreeBeforeTemplateMessage).then((results) => {
                                                    executeQuery(queryTwoBeforeTemplateMessage).then((results) => {
                                                        executeQuery(queryOneBeforeTemplateMessage).then((results) => {
                                                            executeQuery(queryOneAfterTemplateMessage).then((results) => {
                                                                executeQuery(queryThreeAfterTemplateMessage).then((results) => {
                                                                    executeQuery(queryFiveAfterTemplateMessage).then((results) => {
                                                                        res.status(201).json({
                                                                            code: 201,
                                                                            message: "Succesfully Created"
                                                                        });
                                                                    }).catch((err) => {
                                                                        console.log(err)
                                                                        res.status(503).json({
                                                                            code: 503,
                                                                            message: "Internal Server Error"
                                                                        });
                                                                    })
                                                                }).catch((err) => {
                                                                    console.log(err)
                                                                    res.status(503).json({
                                                                        code: 503,
                                                                        message: "Internal Server Error"
                                                                    });
                                                                })
                                                            }).catch((err) => {
                                                                console.log(err)
                                                                res.status(503).json({
                                                                    code: 503,
                                                                    message: "Internal Server Error"
                                                                });
                                                            })
                                                        }).catch((err) => {
                                                            console.log(err)
                                                            res.status(503).json({
                                                                code: 503,
                                                                message: "Internal Server Error"
                                                            });
                                                        })
                                                    }).catch((err) => {
                                                        console.log(err)
                                                        res.status(503).json({
                                                            code: 503,
                                                            message: "Internal Server Error"
                                                        });
                                                    })
                                                }).catch((err) => {
                                                    console.log(err)
                                                    res.status(503).json({
                                                        code: 503,
                                                        message: "Internal Server Error"
                                                    });
                                                })
                                            }).catch((err) => {
                                                console.log(err)
                                                res.status(503).json({
                                                    code: 503,
                                                    message: "Internal Server Error"
                                                });
                                            })
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