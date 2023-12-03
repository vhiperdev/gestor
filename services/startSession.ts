import * as whatsapp from "wa-multi-session";

export const startSession = async () => {

    //Custom Path Session
    whatsapp.setCredentialsDir(process.env.SESSION_PATH);

    //Create New Session
    const session =  whatsapp.loadSessionsFromStorage();

    return session;
}