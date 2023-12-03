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
} from "@chakra-ui/react";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";

const initialProducts = [
  { id: 1, name: "Produk 1", price: 100 },
  { id: 2, name: "Produk 2", price: 150 },
  { id: 3, name: "Produk 3", price: 200 },
];

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProduct, setSelectedProduct] = useState({});
  const [editedProductName, setEditedProductName] = useState("");
  const [editedProductPrice, setEditedProductPrice] = useState("");
  const [id, setId] = useState();

  const uid = localStorage.getItem("id");

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
  }, []);

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setEditedProductName(product.productName);
    setEditedProductPrice(product.price);
    setId(product.id);
    onOpen();
  };

  const handleDeleteClick = (productId) => {
    fetch("/api/product/deleteProduct", {
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
          successNotify("Product successfully deleted");
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
      productName: editedProductName,
      productPrice: editedProductPrice,
    };

    fetch("/api/product/editProduct", {
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
          {products.map((product) => (
            <Tr key={product.id}>
              <Td>{product.id}</Td>
              <Td>{product.productName}</Td>
              <Td>
                {product.price.toLocaleString("en-US", {
                  style: "currency",
                  currency: "BRL",
                })}
              </Td>
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
                pointerEvents="none"
                color="gray.300"
                fontSize="1.2em"
                children="R$"
              />
              <Input
                placeholder="Enter amount"
                value={editedProductPrice}
                onChange={(e) => setEditedProductPrice(e.target.value)}
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

export default ProductTable;
