import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import React, { useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import io from 'Socket.IO-client'



export const AddSessions = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [qrCode, setQrCode] = React.useState("");
  const [isImageVisible, setIsImageVisible] = React.useState(false);
  const [isQrCodeVisible, setIsQrCodeVisible] = React.useState(false);

  // const SOCKET_URL = '/api/whatsapp'; // Ganti dengan URL server Anda

  // let socket = io(SOCKET_URL);
  let socket


  useEffect(() => {
    // socketInitializer();

  },)

  // const socketInitializer = async () => {
  //   await fetch('/api/whatsapp/SocketHandler')
  //   // socket = io(url)

  //   // socket.on('connect', () => {
  //   //   console.log('connected socket nya ni')
  //   // })
  // }

  // const socketInitializer = async () => {
  //   await fetch('/api/whatsapp/SocketHandler')
  //   const socket = io('http://localhost:3000')

  //   socket.on('connect', () => {
  //     // console.log('connected')
  //   })

  //   socket.once('qrCodeResponse', (response) => {

  //     if (isQrCodeVisible === false ) {
  //       setQrCode(response);
  //       successNotify("Succesfully generated QR Code");
  //       setIsImageVisible(true);

  //       //for stoping the loop emit
  //       setIsQrCodeVisible(true);
  //     }

  //   });
  //   socket.once('connectedSession', (response) => {
  //     if (response === process.env.SESSION_NAME) {
  //       successNotify("Succesfully connected to session");
  //       resetState();

  //       //set timeout 2,5 second before reload
  //       setTimeout(() => {
  //         window.location.reload();
  //       }, 2500)
  //     }
  //   });



  //   socket.on('messageError', (error: string) => {
  //     failedNotify(error);
  //   });
  // }

  const successNotify = (message) => {
    toast.success(message, {
      position: toast.POSITION.TOP_RIGHT
    });
    setIsImageVisible(true);
  };

  const failedNotify = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const resetState = () => {
    setQrCode("");
    setIsImageVisible(false);
    handleClose();
  }

  const handleClose = () => {
    setQrCode("");
    setIsImageVisible(false);
    onClose();
  }

  function handlerAddSession() {
    const session = localStorage.getItem('name')

    // socket.emit('qrCode', session);

    const objectWithData = {
      session: session,
    };

    fetch('/api/whatsapp/createSession', {
      method: 'POST',
      headers: {
        'X-Authorization': process.env.API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(objectWithData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === 200) {
          setQrCode(data.data);
          successNotify("Succesfully generated QR Code");
          setIsImageVisible(true);

          setTimeout(() => {
          successNotify("Succesfully Connected");
            window.location.reload();
          }, 10000);
        } else if (data.code === 400) {
          failedNotify(data.message);
        } else if (data.code === 500) {
          failedNotify(data.sqlMessage);
        }
      });
  }

  return (
    <div>
      <>
        <ToastContainer
          position="top-right"
          autoClose={2800}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light" />

        <Button onPress={onOpen} color="primary">
          Add Sessions
        </Button>
        <Modal
          isOpen={isOpen}
          onClose={handleClose}
          placement="top-center"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Add Sessions
                </ModalHeader>
                <ModalBody>
                  {isImageVisible && (
                    <img
                      src={qrCode}
                      alt="Qr Code"
                      id="qrCode"
                      style={{ maxWidth: '100%', maxHeight: '400px' }}
                    />
                  )}

                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onClick={handleClose}>
                    Close
                  </Button>
                  {!isImageVisible && (
                    <Button id="addSession" color="primary" onPress={handlerAddSession}>
                      Add Session
                    </Button>
                  )}

                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    </div>
  );
};
