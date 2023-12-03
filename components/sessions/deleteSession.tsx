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

export const DeleteSession = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isImageVisible, setIsImageVisible] = React.useState(false);




    const handlerDeletSession = async () => {
        const sessionName = localStorage.getItem('name'); //
        fetch(`/api/whatsapp/deleteSession?sessionName=${sessionName}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': process.env.API_KEY
            }
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.code === 200) {
                successNotify("Successfully deleted the session");
                handleClose();
                window.location.reload();
            } else if (data.code === 500) {
                failedNotify(data.message);
            } else if (data.code === 404) {
                failedNotify(data.message);
            }
        });
    }





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

    const handleClose = () => {
        onClose();
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

                <Button onPress={onOpen} color="danger">
                    Delete Session
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
                                    Are you sure you want to delete this session?
                                </ModalHeader>
                                <ModalBody>


                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="flat" onClick={handleClose}>
                                        Close
                                    </Button>
                                    <Button id="addSession" color="danger" onPress={handlerDeletSession}>
                                        Delete
                                    </Button>

                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </>
        </div>
    );
};
