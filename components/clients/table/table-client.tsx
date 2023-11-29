import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const initialClients = [
  {
    id: 1,
    name: 'John Doe',
    whatsappNumber: '62234567890',
    username: 'john_doe',
    password: 'password123',
    plan: 'Premium',
    product: 'Product A (R$100.00)',
    invoiceStatus: '1',
    expiredDate: '2023-12-31',
    status: true,
    autoRenewal: true,
  },
  {
    id: 2,
    name: 'Jane Doe',
    whatsappNumber: '629876543210',
    username: 'jane_doe',
    password: 'securepass',
    plan: 'Basic',
    product: 'Product B (R$82.00)',
    invoiceStatus: '0',
    expiredDate: '2023-10-15',
    status: false,
    autoRenewal: false,
  },
];


const ClientTable = ({ userId }) => {
  const [clients, setClients] = useState(initialClients);
  const [tanggal, setTanggal] = useState(getFormattedToday());
  const [searchTerm, setSearchTerm] = useState('');
  const { isOpen: isAddModalOpen, onOpen: onAddModalOpen, onClose: onAddModalClose } = useDisclosure();
  const { isOpen: isEditModalOpen, onOpen: onEditModalOpen, onClose: onEditModalClose } = useDisclosure();
  const { isOpen: isAutoRenewalModalOpen, onOpen: onAutoRenewalModalOpen, onClose: onAutoRenewalModalClose } = useDisclosure();
  const [renewalDate, setRenewalDate] = useState('');
  const [selectedClient, setSelectedClient] = useState({
    name: '',
    userId: '',
    whatsappNumber: '',
    username: '',
    password: '',
    plan: '',
    product: '',
    invoiceStatus: '0', //0 for pending, 1 for paid
    expiredDate: '',
    status: 'active',
    autoRenewal: '0', //0 for false. 1 for true
    before3DayNotification: '0', //0 for false. 1 for true
    onDueDateNotification: '0', //0 for false. 1 for true
    after3DayNotification: '0', //0 for false. 1 for true
    comments: '',
  });
  const [editedlient, setEditedClient] = useState({
    name: '',
    userId: '',
    whatsappNumber: '',
    username: '',
    password: '',
    plan: '',
    product: '',
    invoiceStatus: '0', //0 for pending, 1 for paid
    expiredDate: '',
    status: 'active',
    autoRenewal: '0', //0 for false. 1 for true
    before3DayNotification: '0', //0 for false. 1 for true
    onDueDateNotification: '0', //0 for false. 1 for true
    after3DayNotification: '0', //0 for false. 1 for true
    comments: '',
  });

  function getFormattedToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


  const currentDate = new Date();

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (client) => {
    setEditedClient(client);
    onEditModalOpen();
  };

  const handleAutoRenewal = (client) => {
    setSelectedClient(client);
    onAutoRenewalModalOpen();
  };


  const handleDeleteClick = (clientId) => {
    setClients((prevClients) =>
      prevClients.filter((client) => client.id !== clientId)
    );
  };

  const handleAutoRenewalSave = () => {
    // setClients((prevClients) =>
    //   prevClients.map((client) =>
    //     client.id === selectedClient.id
    //       ? { ...client, autoRenewal: true, expiredDate: renewalDate }
    //       : client
    //   )
    // );
    if (!renewalDate) {
      failedNotify("Renewal date must be filled in")
    } else if (renewalDate){
      successNotify("Successfully added expiration duration")
      onAutoRenewalModalClose();
    }
    
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedClient((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleSaveEdit = () => {
    console.log(editedlient)
    // onSave(editedClientInfo);
    // onClose();
  };

  const handleSave = () => {
    // onSave(editedClientInfo);
    onAddModalOpen();
  };


  const getStatusColor = (status) => {
    if (status === '1') return 'green';
    if (status === '0') return 'yellow';
    return 'black'; // default color
  };

  const isExpired = (date) => {
    const expiredDate = new Date(date);
    return currentDate > expiredDate;
  };

  const successNotify = (message) => {
    toast.success(message, {
      position: toast.POSITION.TOP_RIGHT
    });
    // setTimeout(() => {
    //   window.location.reload();
    // }, 2500);
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
        theme="dark" />
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
              <Th>Client Name</Th>
              <Th>Whatsapp</Th>
              <Th>Username</Th>
              <Th>Password</Th>
              <Th>Plan</Th>
              <Th>Product</Th>
              <Th>Payment Status</Th>
              <Th>Expired Date</Th>
              <Th>Status</Th>
              <Th>Auto Renewal Status</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredClients.map((client) => (
              <Tr key={client.id}>
                <Td>{client.name}</Td>
                <Td>{client.whatsappNumber}</Td>
                <Td>{client.username}</Td>
                <Td>{client.password}</Td>
                <Td>{client.plan}</Td>
                <Td>{client.product}</Td>
                <Td>
                  <Badge colorScheme={getStatusColor(client.invoiceStatus)}>
                    {client.invoiceStatus === '1' ? 'Paid' : 'Pending'}
                  </Badge>
                </Td>
                <Td color={isExpired(client.expiredDate) ? 'red' : 'green'}>
                  {client.expiredDate}
                </Td>
                <Td>
                  <Badge colorScheme={client.status ? 'green' : 'red'}>
                    {client.status ? 'Active' : 'Inactive'}
                  </Badge>
                </Td>
                <Td>
                  <Badge colorScheme={client.autoRenewal ? 'green' : 'red'}>
                    {client.autoRenewal ? 'Active' : 'Inactive'}
                  </Badge>
                </Td>
                <Td>
                  <IconButton
                    icon={<FaEdit />}
                    colorScheme="blue"
                    onClick={() => handleEditClick(client)}
                    mr={2}
                    aria-label={''}
                  />
                  <IconButton
                    icon={<FaTrash />}
                    colorScheme="red"
                    onClick={() => handleDeleteClick(client.id)}
                    aria-label={''}
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

                <HStack spacing='22px'>
                  <FormControl width={'2xl'}>
                    <Text fontSize="lg" fontWeight="bold">Client Name</Text>
                    <Input name="name" value={editedlient.name} onChange={handleInputChange} placeholder="Client Name" />
                  </FormControl>

                  <FormControl>
                    <Text fontSize="lg" fontWeight="bold">WhatsApp</Text>
                    <Input name="whatsappNumber" value={editedlient.whatsappNumber} onChange={handleInputChange} placeholder="Whatsapp Number" />
                  </FormControl>
                </HStack>


                <Text fontSize="lg" fontWeight="bold">Username</Text>
                <Input name="username" value={editedlient.username} onChange={handleInputChange} placeholder="Username" />

                <Text fontSize="lg" fontWeight="bold">Password</Text>
                <Input name="password" value={editedlient.password} onChange={handleInputChange} placeholder="Password" />

                <HStack spacing='22px'>
                  <FormControl width={'2xl'}>
                    <Text fontSize="lg" fontWeight="bold">Plan</Text>
                    <Input disabled name="plan" value={editedlient.plan} onChange={handleInputChange} placeholder="Plan" />
                  </FormControl>

                  <FormControl>
                    <Text fontSize="lg" fontWeight="bold">Product</Text>
                    <Input disabled name="product" value={editedlient.product} onChange={handleInputChange} placeholder="Product" />
                  </FormControl>
                </HStack>

                <Text fontSize="lg" fontWeight="bold">Payment Status</Text>
                {editedlient.invoiceStatus === '1' ?
                  <Select disabled name="invoiceStatus" value={editedlient.invoiceStatus} onChange={handleInputChange}>
                    <option value="1">Paid</option>
                    <option value="0">Pending</option>
                  </Select>

                  :
                  <Select name="invoiceStatus" value={editedlient.invoiceStatus} onChange={handleInputChange}>
                    <option value="1">Paid</option>
                    <option value="0">Pending</option>
                  </Select>
                }


                <Text fontSize="lg" fontWeight="bold">Expired Date</Text>
                <Input disabled name="expiredDate" value={editedlient.expiredDate} onChange={handleInputChange} placeholder="Expired Date" />

                <Text fontSize="lg" fontWeight="bold">Status</Text>
                <Select disabled name="status" value={editedlient.status} onChange={handleInputChange}>
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </Select>

                <Text fontSize="lg" fontWeight="bold">Auto Renewal Status</Text>
                <Select name="autoRenewal" value={editedlient.autoRenewal} onChange={handleInputChange}>
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </Select>
              </VStack>
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
        <Modal isOpen={isAutoRenewalModalOpen} onClose={onAutoRenewalModalClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Auto Renewal</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl isRequired>
                <Text mb={2}>Expired Date: {selectedClient.expiredDate}</Text>
                <Input
                  type="date"
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
