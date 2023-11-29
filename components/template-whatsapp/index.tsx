import Link from "next/link";
import React, { useRef, useEffect, useState } from "react";
import { DotsIcon } from "../icons/accounts/dots-icon";
import { ExportIcon } from "../icons/accounts/export-icon";
import { InfoIcon } from "../icons/accounts/info-icon";
import { TrashIcon } from "../icons/accounts/trash-icon";
import { HouseIcon } from "../icons/breadcrumb/house-icon";
import { UsersIcon } from "../icons/breadcrumb/users-icon";
import { SettingsIcon } from "../icons/sidebar/settings-icon";
import { AddSessions } from "./addSessions";
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


export const TemplateWhatsapp = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isButtonVisible, setIsButtonVisible] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const [modalContent, setModalContent] = useState('');
  const [data, setData] = useState([
    { id: 1, classification: '3 day before notification', code: 1, content: '3 day before notification' },
    { id: 2, classification: 'after 3 day notification', code: 2, content: 'after 3 day notification' },
    { id: 3, classification: 'today notification', code: 0, content: 'today notification' },
  ]);
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
    setModalContent(item.content);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalData({});
    setModalContent('');
  };

  const handleSave = () => {
    // const newData = data.map((item) =>
    //   item.id === modalData.id ? { ...item, content: modalContent } : item
    // );
    // setData(newData);
    // handleCloseModal();
    // console.log(modalContent)
  };

  //


  useEffect(() => {
    checkSession();
  }, []);



  const checkSession = async () => {
    fetch('/api/whatsapp/getAllSession', {
      method: 'GET',
      headers: {
        'X-Authorization': process.env.API_KEY,
        'Content-Type': 'application/json'
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.data === process.env.SESSION_NAME) {
          setIsButtonVisible(false);
        } else if (data.data != process.env.SESSION_NAME) {
          setIsButtonVisible(true);
        } else if (data.code === 404) {
          setIsButtonVisible(true);
        }

      });
  };


  return (
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
              <Text>{item.content}</Text>
              <Button onClick={() => handleOpenModal(item)} mt={2}>
                Edit
              </Button>
            </Box>
          ))}

          <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Edit Notification</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Textarea
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
  );
};
