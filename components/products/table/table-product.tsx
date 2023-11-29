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
} from '@chakra-ui/react';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

const initialProducts = [
  { id: 1, name: 'Produk 1', price: 100 },
  { id: 2, name: 'Produk 2', price: 150 },
  { id: 3, name: 'Produk 3', price: 200 },
];

const ProductTable = () => {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProduct, setSelectedProduct] = useState({});
  const [editedProductName, setEditedProductName] = useState('');
  const [editedProductPrice, setEditedProductPrice] = useState('');

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setEditedProductName(product.name);
    setEditedProductPrice(product.price);
    onOpen();
  };

  const handleDeleteClick = (productId) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== productId)
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

  return (
    <>
      <InputGroup mb={4}>
        <InputLeftElement pointerEvents="none" children={<FaSearch />} />
        <Input
          type="text"
          placeholder="Search Product"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Product Name</Th>
            <Th>Price</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredProducts.map((product) => (
            <Tr key={product.id}>
              <Td>{product.id}</Td>
              <Td>{product.name}</Td>
              <Td>{product.price.toLocaleString('en-US', { style: 'currency', currency: 'BRL' })}</Td>
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
          <ModalHeader>Edit Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Product Name"
              value={editedProductName}
              onChange={(e) => setEditedProductName(e.target.value)}
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
                value={editedProductPrice}
                onChange={(e) => setEditedProductPrice(e.target.value)}/>
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

export default ProductTable;
