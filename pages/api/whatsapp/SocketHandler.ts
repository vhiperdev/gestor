import { Server } from 'socket.io'
import QRCode from 'qrcode'
import * as whatsapp from "wa-multi-session";


const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new Server(res.socket.server)
    res.socket.server.io = io

    io.on('connection', socket => {
      console.log('dsa')
      // Mendengarkan pesan dari klien
      socket.on('qrCode', async (session: string) => {

        console.log('dasdasd', session)
        if(session){
          // Check Session Name if Exist
          const sessionName = session;
          const isSessionExist = whatsapp.getSession(sessionName!);

          if (isSessionExist == null) {
            //Custom Path Session
            whatsapp.setCredentialsDir(process.env.SESSION_PATH);

            //Create New Session
            const session = await whatsapp.startSession(sessionName);


            //Return Response
            whatsapp.onQRUpdated(async (data) => {
                const qr = await QRCode.toDataURL(data.qr);                
                io.emit('qrCodeResponse', qr);
            });

            whatsapp.onConnecting(async (data) => {
                io.emit('connectingSession', data);
            });

            whatsapp.onConnected(async (data) => {
                io.emit('connectedSession', data);
            });


        } else {
           io.emit('messageError', 'Session Already Exist');
        }
        }
      });
    })
  }
  res.end()
}

export default SocketHandler