import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import {
  VStack,
  Input,
  FormControl,
  FormLabel,
  Textarea,
  HStack,
} from "@chakra-ui/react";

const CustomModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [size, setSize] = React.useState("md");
  const [value, setValue] = React.useState([]);

  const handleOpen = (size) => {
    setSize(size);
    onOpen();
  };

  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button onPress={() => handleOpen(size)}>Open</Button>
      </div>
      <Modal size="4xl" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Charge</ModalHeader>
              <hr />
              <ModalBody>
                <HStack spacing="22px">
                  <FormControl width={"2xl"} isRequired>
                    <FormLabel fontSize="lg" fontWeight="bold">
                      Shipping Time
                    </FormLabel>
                    <Input name="name" placeholder="Client Name" />
                  </FormControl>
                  <FormControl width={"2xl"} isRequired>
                    <FormLabel fontSize="lg" fontWeight="bold">
                      Days after or before
                    </FormLabel>
                    <Input name="name" placeholder="Client Name" />
                  </FormControl>
                  <FormControl width={"2xl"} isRequired>
                    <FormLabel fontSize="lg" fontWeight="bold">
                      Message Templates
                    </FormLabel>
                    <Input name="name" placeholder="Client Name" />
                  </FormControl>
                </HStack>
                <FormControl width={"2xl"} isRequired>
                  <FormLabel fontSize="lg" fontWeight="bold">
                    Days of the week
                  </FormLabel>
                  <Input name="name" placeholder="Client Name" />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default CustomModal;
