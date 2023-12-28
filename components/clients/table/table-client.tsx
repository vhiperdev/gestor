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
import { Switch } from "@nextui-org/react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";

const ClientTable = ({ userId }) => {
  const [clients, setClients] = useState([]);
  const [tanggal, setTanggal] = useState(getFormattedToday());
  const [searchTerm, setSearchTerm] = useState("");
  const [id, setId] = useState();
  const [name, setName] = useState("");
  const session = localStorage.getItem("name");

  const handleSearch = async () => {
    try {
      await fetch(`/api/clients/getByName?userid=${uid}&name=${name}`, {
        method: "GET",
        headers: {
          "X-Authorization": process.env.API_KEY,
        },
      })
        .then((res) => res.json())
        .then((data) => setClients(data.data));
    } catch (error) {
      console.error(error);
    }
  };

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
  const [renewalDate, setRenewalDate] = useState("");
  const [selectedClient, setSelectedClient] = useState({
    clientName: "",
    userId: "",
    whatsappNumber: "",
    clientEmail: "",
    clientPassword: "",
    plan: "",
    product: "",
    invoiceStatus: "0", //0 for pending, 1 for paid
    startDate: "",
    status: "active",
    autoRenewal: "0", //0 for false. 1 for true
    before3DayNotification: false,
    before2DayNotification: false,
    before1DayNotification: false,
    onDueDateNotification: false, //0 for false. 1 for true
    after1DayNotification: false, //0 for false. 1 for true
    after2DayNotification: false, //0 for false. 1 for true
    after3DayNotification: false, //0 for false. 1 for true
    comments: "",
    application: "",
    mac: "",
    keyApplication: "",
  });
  const [editedClient, setEditedClient] = useState({
    clientName: "",
    userId: "",
    whatsappNumber: "",
    clientEmail: "",
    clientPassword: "",
    plan: "",
    product: "",
    invoiceStatus: "0", //0 for pending, 1 for paid
    startDate: "",
    status: "active",
    autoRenewal: false, //0 for false. 1 for true
    before3DayNotification: false,
    before2DayNotification: false,
    before1DayNotification: false,
    onDueDateNotification: false, //0 for false. 1 for true
    after1DayNotification: false, //0 for false. 1 for true
    after2DayNotification: false, //0 for false. 1 for true
    after3DayNotification: false, //0 for false. 1 for true
    comments: "",
    application: "",
    mac: "",
    keyApplication: "",
    plan_name: "",
    product_name: "",
    plan_price: "",
    product_price: "",
    screens: "",
    session,
  });

  function getFormattedToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const handleSwitchChange = (name) => {
    setEditedClient((prevData) => ({ ...prevData, [name]: !prevData[name] }));
  };

  const uid = localStorage.getItem("id");
  // /api/plan/getAllPlan?userid=${uid}

  const handleClientsApi = async () => {
    try {
      await fetch(`/api/clients/getAllClient?userid=${uid}`, {
        method: "GET",
        headers: {
          "X-Authorization": process.env.API_KEY,
        },
      })
        .then((res) => res.json())
        .then((data) => setClients(data.data));
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    handleClientsApi();
  }, []);

  const currentDate = new Date();

  // const filteredClients = clients.filter((client) =>
  //   client.name.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const handleEditClick = (client) => {
    setEditedClient(client);
    onEditModalOpen();
  };

  const handleAutoRenewal = (client) => {
    setId(client.id);
    setSelectedClient(client);
    onAutoRenewalModalOpen();
  };

  const handleDeleteClick = (clientId) => {
    fetch("/api/clients/deleteClient", {
      method: "DELETE",
      headers: {
        "X-Authorization": process.env.API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: clientId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === 200) {
          successNotify("Plan successfully deleted");
        } else if (data.code === 400) {
          failedNotify(data.message);
        } else if (data.code === 500) {
          failedNotify(data.sqlMessage);
        }
      });
  };

  const handleAutoRenewalSave = () => {
    if (!renewalDate) {
      failedNotify("Renewal date must be filled in");
    } else if (renewalDate) {
      fetch("/api/clients/editStartDate", {
        method: "PUT",
        headers: {
          "X-Authorization": process.env.API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expiredDate: renewalDate,
          id: id,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code === 200) {
            successNotify("Successfully added expiration duration");
          } else if (data.code === 400) {
            failedNotify(data.message);
          } else if (data.code === 500) {
            failedNotify(data.sqlMessage);
          }
        });

      onAutoRenewalModalClose();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedClient((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleSaveEdit = () => {
    fetch("/api/clients/editClient", {
      method: "PUT",
      headers: {
        "X-Authorization": process.env.API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedClient),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === 200) {
          successNotify("Plan successfully edited");
        } else if (data.code === 400) {
          failedNotify(data.message);
        } else if (data.code === 500) {
          failedNotify(data.sqlMessage);
        }
      });

    // onClose();
  };

  const handleSave = () => {
    // onSave(editedClientInfo);
    onAddModalOpen();
  };

  const getStatusColor = (status) => {
    if (status === "1") return "green";
    if (status === "0") return "yellow";
    return "black"; // default color
  };

  const isExpired = (date) => {
    const expiredDate = new Date(date);
    return currentDate > expiredDate;
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

  const screens = [1, 2, 3, 4, 5];

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
      <Input
        type="text"
        placeholder="Search by name"
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          // setName(e.target.value);
          if (e.key === "Enter") handleSearch();
        }}
      />
      <Stack spacing={4}>
        {/* Search Input */}

        {/* Table */}
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Client Name</Th>
              <Th>Whatsapp</Th>
              <Th>Username</Th>
              <Th>Password</Th>
              <Th>Plan</Th>
              <Th>Product</Th>
              <Th>Application</Th>
              <Th>Payment Status</Th>
              <Th>Expired Date</Th>
              <Th>Status</Th>
              <Th>Auto Renewal Status</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {clients.map((client) => (
              <Tr key={client.id}>
                <Td>{client.clientName}</Td>
                <Td>{client.whatsappNumber}</Td>
                <Td>{client.clientEmail}</Td>
                <Td>{client.clientPassword}</Td>
                <Td>
                  {client.plan_name} ({formatCurrency(client.plan_price)})
                </Td>
                <Td>{client.product_name}</Td>
                <Td>{client.application}</Td>
                <Td>
                  <Badge colorScheme={getStatusColor(client.invoiceStatus)}>
                    {client.invoiceStatus == "1" ? "Paid" : "Pending"}
                  </Badge>
                </Td>
                <Td color={isExpired(client.startDate) ? "red" : "green"}>
                  {moment(client.startDate).format("MMM Do YY, h:mm:ss a")}
                </Td>
                <Td>
                  <Badge colorScheme={client.status ? "green" : "red"}>
                    {client.status ? "Active" : "Inactive"}
                  </Badge>
                </Td>
                <Td>
                  <Badge colorScheme={client.autoRenewal ? "green" : "red"}>
                    {client.autoRenewal == "1" ? "Active" : "Inactive"}
                  </Badge>
                </Td>
                <Td>
                  <IconButton
                    icon={<FaEdit />}
                    colorScheme="blue"
                    onClick={() => handleEditClick(client)}
                    mr={2}
                    aria-label={""}
                  />
                  <IconButton
                    icon={<FaTrash />}
                    colorScheme="red"
                    onClick={() => handleDeleteClick(client.id)}
                    aria-label={""}
                  />
                  <Button
                    colorScheme="teal"
                    size="sm"
                    onClick={() => {
                      handleAutoRenewal(client);
                    }}
                  >
                    Edit Expired Date
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        {/* Modal for Edit Details */}
        <Modal isOpen={isEditModalOpen} onClose={onEditModalClose} size="4xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Client</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4} align="start">
                <HStack spacing="22px">
                  <FormControl width={"2xl"}>
                    <Text fontSize="lg" fontWeight="bold">
                      Client Name
                    </Text>
                    <Input
                      name="clientName"
                      value={editedClient.clientName}
                      onChange={handleInputChange}
                      placeholder="Client Name"
                    />
                  </FormControl>

                  <FormControl>
                    <Text fontSize="lg" fontWeight="bold">
                      WhatsApp
                    </Text>
                    <Input
                      name="whatsappNumber"
                      value={editedClient.whatsappNumber}
                      onChange={handleInputChange}
                      placeholder="Whatsapp Number"
                    />
                  </FormControl>
                </HStack>

                <Text fontSize="lg" fontWeight="bold">
                  Username
                </Text>
                <Input
                  name="clientEmail"
                  value={editedClient.clientEmail}
                  onChange={handleInputChange}
                  placeholder="Username"
                />

                <Text fontSize="lg" fontWeight="bold">
                  Password
                </Text>
                <Input
                  name="clientPassword"
                  value={editedClient.clientPassword}
                  onChange={handleInputChange}
                  placeholder="Password"
                />

                <HStack spacing="22px">
                  <FormControl width={"2xl"}>
                    <Text fontSize="lg" fontWeight="bold">
                      Plan
                    </Text>
                    <Input
                      disabled
                      name="plan"
                      value={`${editedClient.plan_name} ${formatCurrency(
                        editedClient.plan_price
                      )}`}
                      onChange={handleInputChange}
                      placeholder="Plan"
                    />
                  </FormControl>

                  <FormControl>
                    <Text fontSize="lg" fontWeight="bold">
                      Product
                    </Text>
                    <Input
                      disabled
                      name="product"
                      value={`${editedClient.product_name} ${formatCurrency(
                        editedClient.product_price
                      )}`}
                      onChange={handleInputChange}
                      placeholder="Product"
                    />
                  </FormControl>
                </HStack>

                <Text fontSize="lg" fontWeight="bold">
                  Payment Status
                </Text>
                {editedClient.invoiceStatus === "1" ? (
                  <Select
                    disabled
                    name="invoiceStatus"
                    value={editedClient.invoiceStatus}
                    onChange={handleInputChange}
                  >
                    <option value="1">Paid</option>
                    <option value="0">Pending</option>
                  </Select>
                ) : (
                  <Select
                    name="invoiceStatus"
                    value={editedClient.invoiceStatus}
                    onChange={handleInputChange}
                  >
                    <option value="1">Paid</option>
                    <option value="0">Pending</option>
                  </Select>
                )}

                <Text fontSize="lg" fontWeight="bold">
                  Expired Date
                </Text>
                <Input
                  name="startDate"
                  type="datetime-local"
                  value={editedClient.startDate}
                  onChange={handleInputChange}
                  min={getFormattedToday()}
                />

                <Text fontSize="lg" fontWeight="bold">
                  Status
                </Text>
                <Select
                  disabled
                  name="status"
                  value={editedClient.status}
                  onChange={handleInputChange}
                >
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </Select>

                <FormControl isRequired>
                  <FormLabel fontSize="lg" fontWeight="bold">
                    Screens
                  </FormLabel>
                  <Select
                    name="screens"
                    value={editedClient.screens}
                    onChange={handleInputChange}
                    placeholder="Select an Screens"
                  >
                    {screens.map((option, ind) => (
                      <option key={ind} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <HStack spacing="22px">
                  <FormControl mb={4}>
                    <FormLabel>Auto Renewal</FormLabel>
                    <Switch
                      color="success"
                      // isChecked={newClientInfo.autoRenewal}
                      isSelected={editedClient.autoRenewal}
                      onChange={() => handleSwitchChange("autoRenewal")}
                    />
                  </FormControl>
                </HStack>
              </VStack>

              <HStack spacing="22px">
                <FormControl width={"2xl"}>
                  <FormLabel fontSize="lg" fontWeight="bold">
                    Application
                  </FormLabel>
                  <Input
                    name="application"
                    value={editedClient.application}
                    onChange={handleInputChange}
                    placeholder="Application"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="lg" fontWeight="bold">
                    Mac
                  </FormLabel>
                  <Input
                    name="mac"
                    value={editedClient.mac}
                    onChange={handleInputChange}
                    placeholder="Mac"
                  />
                </FormControl>
              </HStack>

              <FormControl>
                <FormLabel fontSize="lg" fontWeight="bold">
                  Key
                </FormLabel>
                <Input
                  name="keyApplication"
                  value={editedClient.keyApplication}
                  onChange={handleInputChange}
                  placeholder="Key"
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleSaveEdit}>
                Save
              </Button>
              <Button onClick={onEditModalClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Modal for Auto Renewal */}
        <Modal
          isOpen={isAutoRenewalModalOpen}
          onClose={onAutoRenewalModalClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Auto Renewal</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl isRequired>
                <Text mb={2}>
                  Expired Date:{" "}
                  {moment(selectedClient.startDate).format(
                    "MMM Do YY, h:mm:ss a"
                  )}
                </Text>
                <Input
                  type="datetime-local"
                  value={renewalDate}
                  onChange={(e) => setRenewalDate(e.target.value)}
                  min={getFormattedToday()}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleAutoRenewalSave}>
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

export default ClientTable;
