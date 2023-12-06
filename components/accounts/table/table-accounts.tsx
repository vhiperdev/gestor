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
import moment from 'moment';


const AccountTable = ({ users, onToggleUser }) => {
  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          {/* <Th>Photo Profile</Th> */}
          <Th>Full Name</Th>
          <Th>Email</Th>
          <Th>Created On</Th>
          <Th>Action</Th>
        </Tr>
      </Thead>
      <Tbody>
        {users.map((user) => (
          <Tr key={user.id}>
            {/* <Td>Tampilkan foto profil di sini</Td> */}
            <Td>{user.username}</Td>
            <Td>{user.email}</Td>
            <Td>{moment(user.createdOn).format('MMM Do YY')}</Td>
            <Td>
              <Button
                onClick={() => onToggleUser(user.id, !user.isActive)}
                colorScheme={user.isActive ? 'red' : 'green'}
              >
                {user.isActive ? 'Disable' : 'Enable'}
              </Button>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default AccountTable
