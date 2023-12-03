import Link from "next/link";
import React, { useRef, useEffect, useState } from "react";
import { DotsIcon } from "../icons/accounts/dots-icon";
import { ExportIcon } from "../icons/accounts/export-icon";
import { InfoIcon } from "../icons/accounts/info-icon";
import { TrashIcon } from "../icons/accounts/trash-icon";
import { HouseIcon } from "../icons/breadcrumb/house-icon";
import { UsersIcon } from "../icons/breadcrumb/users-icon";
import { SettingsIcon } from "../icons/sidebar/settings-icon";
import { TableSessions } from "./table/tableSessions";
import {
  ChakraProvider,
  Container,
  Box,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Textarea,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Code,
} from '@chakra-ui/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const TemplateWhatsapp = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isButtonVisible, setIsButtonVisible] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const [modalContent, setModalContent] = useState('');
  const [modalId, setModalId] = useState('');
  const [data, setData] = useState([
  ]);

  const userId = localStorage.getItem('id');

  const generateTitle = (code) => {
    if (code == '100') {
      return 'Today Expiration';
    } else if (code == '3') {
      return 'Three Days Before Expiration'
    } else if (code == '2') {
      return 'Two Days Before Expiration'
    } else if (code == '1') {
      return 'One Days Before Expiration'
    } else if (code == '10') {
      return 'One Days After Expiration'
    } else if (code == '30') {
      return 'Three Days Before Expiration'
    } else if (code == '50') {
      return 'Five Days Before Expiration'
    } else {
      return 'Invalid code'; // Kode tidak valid
    }


  };

  const collapseContent = [
    '{name} = client name',
    '{username} = username',
    '{whatsapp} = whatsapp number',
    '{password} = password',
    '{invoice_status} = status invoice',
    '{product} = product',
    '{plan} = plan',
    '{expired_date} = expired date',
  ];

  const handleOpenModal = (item) => {
    setModalData(item);
    setModalId(item.id);
    setModalContent(item.message);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalData({});
    setModalContent('');
  };

  const handleSave = () => {

    const updateMessage = {
      "id": modalId,
      "message": modalContent
    }

    fetch(`/api/templateWhatsapp/updateMessage`, {
      method: 'PUT',
      headers: {
        'X-Authorization': process.env.API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateMessage),
    })
      // .then((res) => res.json())
      .then((data) => {
        console.log(data)
        if (data.status === 204) {
          successNotify('Successfully Updated');
        } else if (data.status == 500) {
          failedNotify("Internal Server Error");
        } else if (data.status == 503) {
          failedNotify("Internal Server Error");
        }
      });
  };

  //


  useEffect(() => {
    getTemplateWhatsapp();
  }, []);

  const successNotify = (message) => {
    toast.success(message, {
      position: toast.POSITION.TOP_RIGHT
    });
    setTimeout(() => {
      window.location.reload();
    }, 2500);
  };

  const failedNotify = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  };



  const getTemplateWhatsapp = async () => {
    fetch(`/api/templateWhatsapp/getTemplateWhatsappByUserId?userId=${userId}`, {
      method: 'GET',
      headers: {
        'X-Authorization': process.env.API_KEY,
        'Content-Type': 'application/json'
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data.data)
        // if (data.data === process.env.SESSION_NAME) {
        //   setIsButtonVisible(false);
        // } else if (data.data != process.env.SESSION_NAME) {
        //   setIsButtonVisible(true);
        // } else if (data.code === 404) {
        //   setIsButtonVisible(true);
        // }

      });
  };


  return (
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
        theme="dark" />

      <div className="my-14 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
        <ul className="flex">
          <li className="flex gap-2">
            <HouseIcon />
            <Link href={"/"}>
              <span>Home</span>
            </Link>
            <span> / </span>{" "}
          </li>

          <li className="flex gap-2">
            <UsersIcon />
            <span>Whatsapp</span>
            <span> / </span>{" "}
          </li>
          <li className="flex gap-2">
            <span>Templates</span>
          </li>
        </ul>

        <h3 className="text-xl font-semibold">Templates Manager</h3>
        <div className="flex justify-between flex-wrap gap-4 items-center">
          <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          </div>

        </div>
        <ChakraProvider>
          <Container mt={5}>
            {data.map((item) => (
              <Box
                key={item.id}
                border="1px"
                borderRadius="md"
                p={3}
                mb={3}
                className={`notification ${item.classification}`}
              >
                <Text>{generateTitle(item.codeMessage)}</Text>
                <Button onClick={() => handleOpenModal(item)} mt={2}>
                  Edit
                </Button>
              </Box>
            ))}

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} size="4xl">
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Edit Notification</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Textarea
                    minH={`${modalContent.split('\n').length * 1.5}rem`}
                    value={modalContent}
                    onChange={(e) => setModalContent(e.target.value)}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="blue" onClick={handleSave}>
                    Save Changes
                  </Button>
                  <Button onClick={handleCloseModal}>Close</Button>
                </ModalFooter>
                <Accordion mt={2}>
                  <AccordionItem>
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        Show Highlight Texts
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4}>
                      {collapseContent.map((text, index) => (
                        <Code key={index} colorScheme="green" p={1} display="block">
                          {text}
                        </Code>
                      ))}
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </ModalContent>
            </Modal>
          </Container>
        </ChakraProvider>
      </div>
    </>

  );
};
