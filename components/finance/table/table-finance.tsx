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

const FinanceTable = () => {
  const [transaction, setTransaction] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [id, setId] = useState();

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

  const handleGetTransaction = async () => {
    try {
      await fetch(`/api/finance/getAllFinance`, {
        method: "GET",
        headers: {
          "X-Authorization": process.env.API_KEY,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setTransaction(data.data);
        });
    } catch (error) {
      console.error(error);
    }
  };

  function getFormattedToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const uid = localStorage.getItem("id");
  // /api/plan/getAllPlan?userid=${uid}

  // const handleClientsApi = async () => {
  //   try {
  //     await fetch(`/api/clients/getAllClient?userid=${uid}`, {
  //       method: "GET",
  //       headers: {
  //         "X-Authorization": process.env.API_KEY,
  //       },
  //     })
  //       .then((res) => res.json())
  //       .then((data) => setClients(data.data));
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  useEffect(() => {
    // handleClientsApi();
    handleGetTransaction();
  }, []);

  const currentDate = new Date();

  // const filteredClients = clients.filter((client) =>
  //   client.name.toLowerCase().includes(searchTerm.toLowerCase())
  // );

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
  // const handleSaveEdit = () => {
  //   fetch("/api/clients/editClient", {
  //     method: "PUT",
  //     headers: {
  //       "X-Authorization": process.env.API_KEY,
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(editedClient),
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (data.code === 200) {
  //         successNotify("Plan successfully edited");
  //       } else if (data.code === 400) {
  //         failedNotify(data.message);
  //       } else if (data.code === 500) {
  //         failedNotify(data.sqlMessage);
  //       }
  //     });

  //   // onClose();
  // };

  // const handleSave = () => {
  //   // onSave(editedClientInfo);
  //   onAddModalOpen();
  // };

  const getStatusColor = (status) => {
    if (status === "1") return "green";
    if (status === "0") return "yellow";
    return "black"; // default color
  };

  // const isExpired = (date) => {
  //   const expiredDate = new Date(date);
  //   return currentDate > expiredDate;
  // };

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
        theme="dark"
      />
      <Stack spacing={4}>
        {/* Search Input */}
        <Input
          type="text"
          placeholder="Search Client"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

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
            {transaction.map((client) => (
              <Tr key={client.id}>
                {/* <Td>{client.typeOfSales }</Td> */}
                <Td>
                  <Badge
                    colorScheme={client.typeOfSales == "1" ? "green" : "red"}
                  >
                    {client.typeOfSales == "1" ? "Active" : "Inactive"}
                  </Badge>
                </Td>
                <Td>{client.date}</Td>
                <Td>{client.notes}</Td>
                <Td>{client.price}</Td>

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
            ))}
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
