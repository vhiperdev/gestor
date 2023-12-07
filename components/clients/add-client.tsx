// AddClientModal.jsx
import React, { useState, useEffect } from "react";
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
  HStack,
} from "@chakra-ui/react";
import { Switch } from "@nextui-org/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddClient = ({ isOpen, onClose, onAdd, userId }) => {
  const [newClientInfo, setNewClientInfo] = useState({
    name: "",
    userId: userId,
    whatsappNumber: "",
    username: "",
    password: "",
    plan: "",
    product: "",
    invoiceStatus: "0", //0 for pending, 1 for paid
    expiredDate: "",
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
    keyApplication: ""
  });
  const [products, setProducts] = useState([]);
  const [plans, setPlans] = useState([]);

  function getFormattedToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClientInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleAdd = () => {
    fetch("/api/clients/addClient", {
      method: "POST",
      headers: {
        "X-Authorization": process.env.API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newClientInfo),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === 200) {
          successNotify("Account successfully added");
        } else if (data.code === 400) {
          failedNotify(data.message);
        } else if (data.code === 500) {
          failedNotify(data.sqlMessage);
        }
      });


    // console.log(newClientInfo);
    onClose();
    setTimeout(() => {
      window.location.reload();
    }, 2500);

  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleSwitchChange = (name) => {
    setNewClientInfo((prevData) => ({ ...prevData, [name]: !prevData[name] }));
  };

  const successNotify = (message) => {
    toast.success(message, {
      position: toast.POSITION.TOP_RIGHT,
    });
    setTimeout(() => {
      window.location.reload();
    }, 2500);
    resetState();
  };

  const failedNotify = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const uid = localStorage.getItem("id");

  const handlePlansApi = async () => {
    try {
      await fetch(`/api/plan/getAllPlans?userid=${uid}`, {
        method: "GET",
        headers: {
          "X-Authorization": process.env.API_KEY,
        },
      })
        .then((res) => res.json())
        .then((data) => setPlans(data.data));
    } catch (error) {
      console.error(error);
    }
  };

  const handleProductsApi = async () => {
    try {
      await fetch(`/api/product/getAllProduct?userid=${uid}`, {
        method: "GET",
        headers: {
          "X-Authorization": process.env.API_KEY,
        },
      })
        .then((res) => res.json())
        .then((data) => setProducts(data.data));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleProductsApi();
    handlePlansApi();
  }, []);

  const resetState = () => {
    setNewClientInfo({
      name: "",
      userId: "",
      whatsappNumber: "",
      username: "",
      password: "",
      plan: "",
      product: "",
      invoiceStatus: "0", //0 for pending, 1 for paid
      expiredDate: "",
      status: "active",
      autoRenewal: false, //0 for false. 1 for true
      before3DayNotification: false, //0 for false. 1 for true
      before2DayNotification: false, //0 for false. 1 for true
      before1DayNotification: false, //0 for false. 1 for true
      onDueDateNotification: false, //0 for false. 1 for true
      after1DayNotification: false, //0 for false. 1 for true
      after2DayNotification: false, //0 for false. 1 for true
      after3DayNotification: false, //0 for false. 1 for true
      comments: "",
      application: "",
      mac: "",
      keyApplication: ""
    });
  };

  const planOptions = [
    {
      id: 1,
      planName: "Basic",
      price: 1000,
    },
    {
      id: 2,
      planName: "Standard",
      price: 3000,
    },
    {
      id: 3,
      planName: "Premium",
      price: 5000,
    },
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
        theme="light"
      />

      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" fontSize="2xl" fontWeight="bold">
            New Client Area
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="start">
              <HStack spacing="22px">
                <FormControl width={"2xl"} isRequired>
                  <FormLabel fontSize="lg" fontWeight="bold">
                    Client Name
                  </FormLabel>
                  <Input
                    name="name"
                    value={newClientInfo.name}
                    onChange={handleInputChange}
                    placeholder="Client Name"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="lg" fontWeight="bold">
                    WhatsApp
                  </FormLabel>
                  <Input
                    type="tel"
                    name="whatsappNumber"
                    value={newClientInfo.whatsappNumber}
                    onChange={handleInputChange}
                    placeholder="Whatsapp Number with (62)"
                  />
                </FormControl>
              </HStack>

              <FormControl isRequired>
                <FormLabel fontSize="lg" fontWeight="bold">
                  Email
                </FormLabel>
                <Input
                  name="username"
                  value={newClientInfo.username}
                  onChange={handleInputChange}
                  placeholder="Username"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="lg" fontWeight="bold">
                  Password
                </FormLabel>
                <Input
                  name="password"
                  value={newClientInfo.password}
                  onChange={handleInputChange}
                  type="password"
                  placeholder="Password"
                />
              </FormControl>

              <HStack spacing="22px">
                <FormControl width={"2xl"} isRequired>
                  <FormLabel fontSize="lg" fontWeight="bold">
                    Plan
                  </FormLabel>
                  <Select
                    name="plan"
                    value={newClientInfo.plan}
                    onChange={handleInputChange}
                    placeholder="Select an Plan"
                  >
                    {plans.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.planName} ({formatCurrency(option.price)})
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="lg" fontWeight="bold">
                    Product
                  </FormLabel>
                  <Select
                    name="product"
                    value={newClientInfo.product}
                    onChange={handleInputChange}
                    placeholder="Select an Product"
                  >
                    {products.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.productName} ({formatCurrency(option.price)})
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </HStack>

              <FormControl isRequired>
                <FormLabel fontSize="lg" fontWeight="bold">
                  Payment Status
                </FormLabel>
                <Select
                  name="invoiceStatus"
                  value={newClientInfo.invoiceStatus}
                  onChange={handleInputChange}
                  placeholder="Select Payment Status"
                >
                  <option value="1">Paid</option>
                  <option value="0">Pending</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="lg" fontWeight="bold">
                  Expired Date
                </FormLabel>
                <Input
                  name="expiredDate"
                  value={newClientInfo.expiredDate}
                  onChange={handleInputChange}
                  type="datetime-local"
                  min={getFormattedToday()}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="lg" fontWeight="bold">
                  Status
                </FormLabel>
                <Select
                  name="status"
                  value={newClientInfo.status}
                  onChange={handleInputChange}
                  placeholder="Select Status"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Select>
              </FormControl>

              <HStack spacing="22px">
                <FormControl width={"2xl"} >
                  <FormLabel fontSize="lg" fontWeight="bold">
                    Application
                  </FormLabel>
                  <Input
                    name="application"
                    value={newClientInfo.application}
                    onChange={handleInputChange}
                    placeholder="Application"
                  />
                </FormControl>

                <FormControl >
                  <FormLabel fontSize="lg" fontWeight="bold">
                    Mac
                  </FormLabel>
                  <Input
                    name="mac"
                    value={newClientInfo.mac}
                    onChange={handleInputChange}
                    placeholder="Mac"
                  />
                </FormControl>
              </HStack>

              <FormControl >
                <FormLabel fontSize="lg" fontWeight="bold">
                  Key
                </FormLabel>
                <Input
                  name="keyApplication"
                  value={newClientInfo.keyApplication}
                  onChange={handleInputChange}
                  placeholder="Key"
                />
              </FormControl>

              <HStack spacing="22px">
                <FormControl mb={4}>
                  <FormLabel>Auto Renewal</FormLabel>
                  <Switch
                    color="success"
                    // isChecked={newClientInfo.autoRenewal}
                    isSelected={newClientInfo.autoRenewal}
                    onChange={() => handleSwitchChange("autoRenewal")}
                  />
                </FormControl>
              </HStack>

              <HStack spacing="22px">
                <FormControl mb={4}>
                  <FormLabel>Before 3 Day Notification</FormLabel>
                  <Switch
                    color="success"
                    // isChecked={newClientInfo.autoRenewal}
                    isSelected={newClientInfo.before3DayNotification}
                    onChange={() =>
                      handleSwitchChange("before3DayNotification")
                    }
                  />
                </FormControl>

                <FormControl mb={4}>
                  <FormLabel>Before 2 Day Notification</FormLabel>
                  <Switch
                    color="success"
                    // isChecked={newClientInfo.autoRenewal}
                    isSelected={newClientInfo.before2DayNotification}
                    onChange={() =>
                      handleSwitchChange("before2DayNotification")
                    }
                  />
                </FormControl>

                <FormControl mb={4}>
                  <FormLabel>Before 1 Day Notification</FormLabel>
                  <Switch
                    color="success"
                    // isChecked={newClientInfo.after3DayNotification}
                    isSelected={newClientInfo.before1DayNotification}
                    onChange={() =>
                      handleSwitchChange("before1DayNotification")
                    }
                  />
                </FormControl>
              </HStack>
              <HStack spacing="22px">
                <FormControl mb={4}>
                  <FormLabel>After 3 Day Notification</FormLabel>
                  <Switch
                    color="success"
                    // isChecked={newClientInfo.autoRenewal}
                    isSelected={newClientInfo.after3DayNotification}
                    onChange={() => handleSwitchChange("after3DayNotification")}
                  />
                </FormControl>

                <FormControl mb={4}>
                  <FormLabel>After 2 Day Notification</FormLabel>
                  <Switch
                    color="success"
                    // isChecked={newClientInfo.autoRenewal}
                    isSelected={newClientInfo.after2DayNotification}
                    onChange={() => handleSwitchChange("after2DayNotification")}
                  />
                </FormControl>

                <FormControl mb={4}>
                  <FormLabel>After 1 Day Notification</FormLabel>
                  <Switch
                    color="success"
                    // isChecked={newClientInfo.after3DayNotification}
                    isSelected={newClientInfo.after1DayNotification}
                    onChange={() => handleSwitchChange("after1DayNotification")}
                  />
                </FormControl>
              </HStack>

              <HStack spacing="22px">
                <FormControl mb={4}>
                  <FormLabel>at the Day Notification</FormLabel>
                  <Switch
                    color="success"
                    // isChecked={newClientInfo.after3DayNotification}
                    isSelected={newClientInfo.onDueDateNotification}
                    onChange={() => handleSwitchChange("onDueDateNotification")}
                  />
                </FormControl>
              </HStack>

              <FormControl mb={4}>
                <FormLabel>Comment</FormLabel>
                <Textarea
                  name="comments"
                  value={newClientInfo.comments}
                  onChange={handleInputChange}
                />
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
