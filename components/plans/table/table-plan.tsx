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
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from '@chakra-ui/react';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

const initialProducts = [
  { id: 1, name: 'Plan 1', price: 100 },
  { id: 2, name: 'Plan 2', price: 150 },
  { id: 3, name: 'Plan 3', price: 200 },
];

const PlanTable = () => {
  const [plans, setPlans] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPlan, setSelectedPlan] = useState({});
  const [editedPlanName, setEditedPlanName] = useState('');
  const [editedPlanPrice, setEditedPlanPrice] = useState('');

  const filteredPlans = plans.filter((plan) =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (product) => {
    setSelectedPlan(product);
    setEditedPlanName(product.name);
    setEditedPlanPrice(product.price);
    onOpen();
  };

  const handleDeleteClick = (productId) => {
    setPlans((prevPlans) =>
      prevPlans.filter((product) => product.id !== productId)
    );
  };

  const handleSaveChanges = () => {
    // setProducts((prevProducts) =>
    //   prevProducts.map((product) =>
    //     product.id === selectedProduct.id
    //       ? { ...product, name: editedProductName, price: editedProductPrice }
    //       : product
    //   )
    // );
    onClose();
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'BRL' }).format(value);
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
          {filteredPlans.map((product) => (
            <Tr key={product.id}>
              <Td>{product.id}</Td>
              <Td>{product.name}</Td>
              <Td>{formatCurrency(product.price)}</Td>
              <Td>
                <IconButton
                  icon={<FaEdit />}
                  colorScheme="blue"
                  onClick={() => handleEditClick(product)}
                  mr={2} aria-label={''}
                />
                <IconButton
                  icon={<FaTrash />}
                  colorScheme="red"
                  onClick={() => handleDeleteClick(product.id)}
                  aria-label={''}
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
                pointerEvents='none'
                color='gray.300'
                fontSize='1.2em'
                children='R$'
              />
              <Input placeholder='Enter amount'
                value={editedPlanPrice}
                onChange={(e) => setEditedPlanPrice(e.target.value)} />
            </InputGroup>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSaveChanges}>
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
