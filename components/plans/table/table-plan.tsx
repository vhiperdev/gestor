// buat function untuk get data plan where userId = UserId
"use client";

import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
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
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";

const PlanTable = ({ userId }) => {
  const [plans, setPlans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPlan, setSelectedPlan] = useState({});
  const [editedPlanName, setEditedPlanName] = useState("");
  const [editedPlanPrice, setEditedPlanPrice] = useState("");
  const [id, setId] = useState();

  const uid = localStorage.getItem("id");
  // /api/plan/getAllPlan?userid=${uid}

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
  useEffect(() => {
    handlePlansApi();
  }, []);

  // const filteredPlans =
  //   plans.length != 0
  //     ? plans.filter((plan) =>
  //         plan.name.toLowerCase().includes(searchTerm.toLowerCase())
  //       )
  //     : [];

  const handleEditClick = (product) => {
    setSelectedPlan(product);
    setEditedPlanName(product.planName);
    setEditedPlanPrice(product.price);
    setId(product.id);
    onOpen();
  };

  const handleDeleteClick = (productId) => {
    fetch("/api/plan/deletePlan", {
      method: "DELETE",
      headers: {
        "X-Authorization": process.env.API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: productId,
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

  const successNotify = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
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

  const handleSaveChanges = (productId) => {
    const objectWithData = {
      id: productId,
      planName: editedPlanName,
      planPrice: editedPlanPrice,
    };

    fetch("/api/plan/editPlan", {
      method: "PUT",
      headers: {
        "X-Authorization": process.env.API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(objectWithData),
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
    onClose();
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <>
      <InputGroup mb={4}>
        <InputLeftElement pointerEvents="none" children={<FaSearch />} />
        <Input
          type="text"
          placeholder="Search Plan"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Plan Name</Th>
            <Th>Price</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {plans.map((product) => (
            <Tr key={product.id}>
              <Td>{product.id}</Td>
              <Td>{product.planName}</Td>
              <Td>{formatCurrency(product.price)}</Td>
              <Td>
                <IconButton
                  icon={<FaEdit />}
                  colorScheme="blue"
                  onClick={() => handleEditClick(product)}
                  mr={2}
                  aria-label={""}
                />
                <IconButton
                  icon={<FaTrash />}
                  colorScheme="red"
                  onClick={() => handleDeleteClick(product.id)}
                  aria-label={""}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Plan</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Plan Name"
              value={editedPlanName}
              onChange={(e) => setEditedPlanName(e.target.value)}
              mb={4}
            />
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                color="gray.300"
                fontSize="1.2em"
                children="R$"
              />
              <Input
                placeholder="Enter amount"
                value={editedPlanPrice}
                onChange={(e) => setEditedPlanPrice(e.target.value)}
              />
            </InputGroup>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => handleSaveChanges(id)}
            >
              Save Changes
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PlanTable;
