import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const AddPlan = ({ userId }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [ planName, setPlanName ] = useState('')
  const [ planPrice, setPlanPrice ] = useState('')

  const handleAddProduct = () => {
    const objectWithData = {
      userId: userId,
      planName: planName,
      planPrice: planPrice
    };

    fetch('/api/plan/addPlan', {
      method: 'POST',
      headers: {
        'X-Authorization': process.env.API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(objectWithData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === 200) {
          successNotify('Plan successfully added');
        } else if (data.code === 400) {
          failedNotify(data.message);
        } else if (data.code === 500) {
          failedNotify(data.sqlMessage);
        }
      });
  }

  const successNotify = (message) => {
    toast.success(message, {
      position: toast.POSITION.TOP_RIGHT
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

  const resetState = () => {
    setPlanName("");
    setPlanPrice("");
  }

  return (
    <div>
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
          theme="light" />
        <Button onPress={onOpen} color="primary">
          Add Plan
        </Button>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="top-center"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Add Plan
                </ModalHeader>
                <ModalBody>
                  <Input isRequired label="Plan Name" variant="bordered" onChange={(e) => {setPlanName(e.target.value)}}/>
                  <Input isRequired type="number"
                    label="Price"
                    placeholder="0.00"
                    labelPlacement="outside"
                    onChange={(e) => {setPlanPrice(e.target.value)}}
                    startContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-default-400 text-small">R$</span>
                      </div>
                    } />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onClick={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={handleAddProduct}>
                    Add Product
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    </div>
  );
};
