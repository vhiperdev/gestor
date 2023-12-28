// buat userId dari component client mengambil dari usecontext userId

"use client";

import { Button, Input } from "@nextui-org/react";
import { ToastContainer, toast } from "react-toastify";
import * as XLSX from "xlsx";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { DotsIcon } from "../icons/accounts/dots-icon";
import { ExportIcon } from "../icons/accounts/export-icon";
import { InfoIcon } from "../icons/accounts/info-icon";
import { TrashIcon } from "../icons/accounts/trash-icon";
import { HouseIcon } from "../icons/breadcrumb/house-icon";
import { UsersIcon } from "../icons/breadcrumb/users-icon";
import { SettingsIcon } from "../icons/sidebar/settings-icon";
import { TableWrapper } from "../table/table";
// import { AddClient } from "./add-client";
import ClientTable from "./table/table-client";
import {
  HStack,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import AddClient from "./add-client";
import ExportExcel from "./excel-export";

export const Clients = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [file, setFile] = useState(null);
  const [jsonData, setJsonData] = useState("");

  const [clients, setClients] = useState([]);
  const uid = localStorage.getItem("id");
  const username = localStorage.getItem("name");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const successNotify = (message) => {
    toast.success(message, {
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

  const handleUpload = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        console.log(json);

        setJsonData(JSON.stringify(json, null, 2));
        fetch("/api/clients/importclient", {
          method: "POST",
          headers: {
            "X-Authorization": process.env.API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ json, userId: uid }),
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
        // onClose();
        setTimeout(() => {
          window.location.reload();
        }, 2500);
      };
      reader.readAsBinaryString(file);
    }
  };

  const handleClientsApi = async () => {
    try {
      await fetch(`/api/clients/getExportClient?userid=${uid}`, {
        method: "GET",
        headers: {
          "X-Authorization": process.env.API_KEY,
        },
      })
        .then((res) => res.json())
        .then((data) => setClients(data.data));
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    handleClientsApi();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleOpenModal2 = () => {
    setIsModalOpen2(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleCloseModal2 = () => {
    setIsModalOpen2(false);
  };

  const handleAddClient = (clientInfo) => {
    // onAdd(clientInfo);
  };

  return (
    <div className="my-14 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <ul className="flex">
        <li className="flex gap-2">
          <HouseIcon />
          <Link href={"/"}>
            <span>Home</span>
          </Link>
          <span> / </span>{" "}
        </li>

        <li className="flex gap-2">
          <UsersIcon />
          <span>Client</span>
          <span> / </span>{" "}
        </li>
        <li className="flex gap-2">
          <span>List</span>
        </li>
      </ul>

      <h3 className="text-xl font-semibold">All Clients</h3>
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex flex-row gap-3.5 flex-wrap">
          <HStack spacing={4} align="start">
            <Button onClick={handleOpenModal}>Add Client</Button>
            <ExportExcel
              fileName={`Report - ${username} - ${new Date().getFullYear()}-${
                new Date().getMonth() + 1
              }-${new Date().getDate()}`}
              excelData={clients}
            />
            <Button onClick={handleOpenModal2}>Import excel</Button>

            <Modal isOpen={isModalOpen2} onClose={handleCloseModal2}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Choose File</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <input
                    type="file"
                    accept=".xls,.xlsx"
                    onChange={handleFileChange}
                  />
                </ModalBody>

                <ModalFooter gap={3}>
                  <Button onClick={handleCloseModal2}>Close</Button>
                  <Button onClick={handleUpload}>Import</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
            <AddClient
              userId={uid}
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              onAdd={handleAddClient}
            />
          </HStack>
        </div>
      </div>

      <div className="max-w-[95rem] mx-auto w-full">
        <ClientTable userId={uid} />
      </div>
    </div>
  );
};
