import type { NextApiRequest, NextApiResponse } from 'next'
import checkAuthorizationHeader from '../../../services/authorization'
import * as whatsapp from "wa-multi-session";
import { startSession } from "../../../services/startSession";
import { createPool, executeQuery } from '../../../services/connectionDatabase';
createPool()


function replaceVariables(message, replacements) {
    for (const key in replacements) {
        if (Object.prototype.hasOwnProperty.call(replacements, key)) {
            const placeholder = `{${key}}`;
            message = message.replace(new RegExp(placeholder, 'g'), replacements[key]);
        }
    }
    return message;
}



export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        //Start Session
        startSession();

        checkAuthorizationHeader(async (req: NextApiRequest, res: NextApiResponse) => {
            //Get Session Name from Body

            const sessionName = req.body.session;
            const message = req.body.message;
            const userId = req.body.userId;

            const queryGetClientData = `select whatsappNumber from clients WHERE userId = '${userId}' `


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
                    executeQuery(queryGetClientData)
                        .then((results) => {
                            const lengthResult = results.length

                            console.log(results)
                            if (lengthResult != 0) {
                                results.forEach(async (item, index) => {
                                    console.log(item)
                                 
                                    let whatsappNumber = item['whatsappNumber']
                                    // let invoice_status = item['invoiceStatus']
                                    // let product = `${item['productName']} (R$${item['product_price']})`
                                    // let plan = `${item['planName']} (R$${item['plan_price']})`
                                    // let expired_date = item['expired_date']
                                    // // let message = item['message']
                                    // let application = item['application']
                                    // let mac = item['mac']
                                    // let keyApplication = item['keyApplication']


                                    console.log('duarr',whatsappNumber)
                                    // let replacements = {
                                    //     name: name,
                                    //     username: username,
                                    //     password: password,
                                    //     whatsapp: whatsappNumber,
                                    //     invoice_status: invoice_status,
                                    //     product: product,
                                    //     plan: plan,
                                    //     expired_date: expired_date,
                                    //     application: application,
                                    //     mac: mac,
                                    //     key: keyApplication
                                    // };

                                    // let modifiedMessage = replaceVariables(message, replacements);

                                    // send message to whatsapp
                                    try {
                                        const sendMessage = await whatsapp.sendTextMessage({
                                            sessionId: sessionName, // session ID
                                            to: whatsappNumber, // always add country code (ex: 62)
                                            text: message, // message you want to send
                                        });
                                        res.status(200).json({
                                            code: 200,
                                            message: 'Success Send Message'
                                        });
                                    } catch (error) {
                                        console.log(error)
                                    }
                                });
                            };
                        })



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

