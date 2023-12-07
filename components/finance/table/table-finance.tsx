import React, { useState, useEffect } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  Stack,
  Text,
  Badge,
  VStack,
  Select,
  FormControl,
  FormLabel,
  HStack,
} from "@chakra-ui/react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";

const FinanceTable = () => {
  const [transaction, setTransaction] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [id, setId] = useState();

  const userId = localStorage.getItem('id')

  const {
    isOpen: isAddModalOpen,
    onOpen: onAddModalOpen,
    onClose: onAddModalClose,
  } = useDisclosure();
  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onClose: onEditModalClose,
  } = useDisclosure();
  const {
    isOpen: isAutoRenewalModalOpen,
    onOpen: onAutoRenewalModalOpen,
    onClose: onAutoRenewalModalClose,
  } = useDisclosure();
  const [notes, setNotes] = useState("");
  // let newValue = 1; // Menyimpan nilai yang akan digunakan untuk properti 'a'

  // const newArray = transaction.map((item) => {
  //   const updatedItem = { ...item, typeOfSales: newValue };
  //   newValue = 1 - newValue; // Mengubah nilai newValue antara 0 dan 1 secara bergantian
  //   return updatedItem;
  // });

  // setTransaction(newArray);

  useEffect(() => {
    // handleClientsApi();
    handleGetTransaction();
  }, []);

  const handleGetTransaction = async () => {
    try {
      await fetch(`/api/finance/getAllFinance?userid=${userId}`, {
        method: "GET",
        headers: {
          "X-Authorization": process.env.API_KEY,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          const updatedState = data.data.map((item, index) => {
            return { ...item, typeOfSales: index % 2 };
          });

          setTransaction(updatedState);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const handleAutoRenewal = (client) => {
    setId(client.id);
    // setSelectedClient(client);
    onAutoRenewalModalOpen();
  };

  const handleEditTransaction = () => {
    console.log(notes, id);

    fetch("/api/finance/editTransactions", {
      method: "PUT",
      headers: {
        "X-Authorization": process.env.API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notes,
        id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === 200) {
          successNotify("Successfully change notes");
        } else if (data.code === 400) {
          failedNotify(data.message);
        } else if (data.code === 500) {
          failedNotify(data.sqlMessage);
        }
      });

    onAutoRenewalModalClose();
  };

  const getStatusColor = (status) => {
    if (status === "1") return "green";
    if (status === "0") return "yellow";
    return "black"; // default color
  };

  const successNotify = (message) => {
    toast.success(message, {
      position: toast.POSITION.TOP_RIGHT,
    });
    setTimeout(() => {
      window.location.reload();
    }, 2500);
    // resetState();
  };

  const failedNotify = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "BRL",
    }).format(value);
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
        theme="light"
      />
      <Stack spacing={4}>
        {/* Search Input */}
        {/* <Input
          type="text"
          placeholder="Search Client"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        /> */}

        {/* Table */}
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Status</Th>
              <Th>Date</Th>
              <Th>Notes</Th>
              <Th>Price</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transaction.map((client) => {
              return (
                <Tr key={client.id}>
                  {/* <Td>{client.typeOfSales }</Td> */}
                  <Td>
                    <Badge
                      colorScheme={client.typeOfSales == "1" ? "green" : "red"}
                    >
                      {client.typeOfSales == "1" ? "IN" : "OUT"}
                    </Badge>
                  </Td>
                  <Td>{moment(client.date).format("MMM Do YY")}</Td>
                  <Td>{client.notes}</Td>
                  <Td>{formatCurrency(client.price)}</Td>

                  <Td>
                    <IconButton
                      icon={<FaEdit />}
                      colorScheme="blue"
                      onClick={() => handleAutoRenewal(client)}
                      mr={2}
                      aria-label={""}
                    />
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>

        {/* Modal for Auto Renewal */}
        <Modal
          isOpen={isAutoRenewalModalOpen}
          onClose={onAutoRenewalModalClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Give Notes</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl isRequired>
                <Text mb={2}>Notes</Text>
                <Input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleEditTransaction}>
                Save
              </Button>
              <Button onClick={onAutoRenewalModalClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Stack>
    </>
  );
};

export default FinanceTable;
