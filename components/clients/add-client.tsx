// AddClientModal.jsx
import React, { useState } from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  VStack,
  Input,
  Select,
  FormControl,
  FormLabel,
  Textarea,
  HStack
} from "@chakra-ui/react";
import { Switch } from '@nextui-org/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const AddClient = ({ isOpen, onClose, onAdd, userId }) => {
  const [newClientInfo, setNewClientInfo] = useState({
    name: '',
    userId: userId,
    whatsappNumber: '',
    username: '',
    password: '',
    plan: '',
    product: '',
    invoiceStatus: '0', //0 for pending, 1 for paid
    expiredDate: '',
    status: 'active',
    autoRenewal: false, //0 for false. 1 for true
    before3DayNotification: false, //0 for false. 1 for true
    onDueDateNotification: false, //0 for false. 1 for true
    after3DayNotification: false, //0 for false. 1 for true
    comments: '',
  });

  function getFormattedToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClientInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleAdd = async () => {
    fetch('/api/clients/addClient', {
      method: 'POST',
      headers: {
        'X-Authorization': process.env.API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newClientInfo),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === 200) {
          successNotify('Account successfully added');
        } else if (data.code === 400) {
          failedNotify(data.message);
        } else if (data.code === 500) {
          failedNotify(data.sqlMessage);
        }
      });

        console.log(newClientInfo)
    // onClose();
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const handleSwitchChange = (name) => {
    setNewClientInfo((prevData) => ({ ...prevData, [name]: !prevData[name] }));
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

  const resetState = () => {
    setNewClientInfo({
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
      autoRenewal: false, //0 for false. 1 for true
      before3DayNotification: false, //0 for false. 1 for true
      onDueDateNotification: false, //0 for false. 1 for true
      after3DayNotification: false, //0 for false. 1 for true
      comments: '',
    });
  }

  const planOptions = [
    {
      id: 1,
      planName: "Basic",
      price: 1000
    },
    {
      id: 2,
      planName: "Standard",
      price: 3000
    },
    {
      id: 3,
      planName: "Premium",
      price: 5000
    }
  ];

  const productOptions = [
    {
      id: 1,
      productName: "Product A",
      price: 100
    },
    {
      id: 2,
      productName: "Product B",
      price: 200
    },
    {
      id: 3,
      productName: "Product C",
      price: 300
    }
  ];

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

    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center" fontSize="2xl" fontWeight="bold">
          New Client Area
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="start">
            <HStack spacing='22px'>
              <FormControl width={'2xl'} isRequired>
                <FormLabel fontSize="lg" fontWeight="bold">Client Name</FormLabel>
                <Input name="name" value={newClientInfo.name} onChange={handleInputChange} placeholder="Client Name" />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="lg" fontWeight="bold">WhatsApp</FormLabel>
                <Input type='tel' name="whatsappNumber" value={newClientInfo.whatsappNumber} onChange={handleInputChange} placeholder="Whatsapp Number with (62)" />
              </FormControl>
            </HStack>

            <FormControl isRequired>
              <FormLabel fontSize="lg" fontWeight="bold">Email</FormLabel>
              <Input name="username" value={newClientInfo.username} onChange={handleInputChange} placeholder="Username" />
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontSize="lg" fontWeight="bold">Password</FormLabel>
              <Input name="password" value={newClientInfo.password} onChange={handleInputChange} type="password" placeholder="Password" />
            </FormControl>

            <HStack spacing='22px'>
              <FormControl width={'2xl'} isRequired>
                <FormLabel fontSize="lg" fontWeight="bold">Plan</FormLabel>
                <Select name="plan" value={newClientInfo.plan} onChange={handleInputChange} placeholder='Select an Plan'>
                  {planOptions.map((option) => (
                    <option key={option.id} value={option.price}>{option.planName}</option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="lg" fontWeight="bold">Product</FormLabel>
                <Select name="product" value={newClientInfo.product} onChange={handleInputChange} placeholder='Select an Product'>
                  {productOptions.map((option) => (
                    <option key={option.id} value={option.price}>{option.productName} ({formatCurrency(option.price)})</option>
                  ))}
                </Select>
              </FormControl>
            </HStack>


            <FormControl isRequired>
              <FormLabel fontSize="lg" fontWeight="bold">Payment Status</FormLabel>
              <Select name="statusPembayaran" value={newClientInfo.invoiceStatus} onChange={handleInputChange}  placeholder='Select Payment Status'>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontSize="lg" fontWeight="bold">Expired Date</FormLabel>
              <Input name="expiredDate" value={newClientInfo.expiredDate} onChange={handleInputChange} type="date" min={getFormattedToday()} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontSize="lg" fontWeight="bold">Status</FormLabel>
              <Select name="status" value={newClientInfo.status} onChange={handleInputChange}  placeholder='Select Status'>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
            </FormControl>


            <HStack spacing='22px'>
              <FormControl mb={4} isRequired>
                <FormLabel>Auto Renewal</FormLabel>
                <Switch
                  color="success"
                  // isChecked={newClientInfo.autoRenewal}
                  isSelected={newClientInfo.autoRenewal}
                  onChange={() => handleSwitchChange('autoRenewal')}
                />
              </FormControl>
            </HStack>

            <HStack spacing='22px'>
              <FormControl mb={4} isRequired>
                <FormLabel>Before 3 Day Notification</FormLabel>
                <Switch
                  color="success"
                  // isChecked={newClientInfo.autoRenewal}
                  isSelected={newClientInfo.before3DayNotification}
                  onChange={() => handleSwitchChange('before3DayNotification')}
                />
              </FormControl>

              <FormControl mb={4} isRequired>
                <FormLabel>at the Day Notification</FormLabel>
                <Switch
                  color="success"
                  // isChecked={newClientInfo.autoRenewal}
                  isSelected={newClientInfo.onDueDateNotification}
                  onChange={() => handleSwitchChange('onDueDateNotification')}
                />
              </FormControl>

              <FormControl mb={4} isRequired>
                <FormLabel>After 3 Day Notification</FormLabel>
                <Switch
                  color="success"
                  // isChecked={newClientInfo.after3DayNotification}
                  isSelected={newClientInfo.after3DayNotification}
                  onChange={() => handleSwitchChange('after3DayNotification')}
                />
              </FormControl>
            </HStack>

            <FormControl mb={4} isRequired>
              <FormLabel>Comment</FormLabel>
              <Textarea name="comments" value={newClientInfo.comments} onChange={handleInputChange} />
            </FormControl>
          </VStack>

        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleAdd}>
            Add
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
    </>
  );
};

export default AddClient;
