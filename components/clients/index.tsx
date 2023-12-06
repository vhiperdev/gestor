// buat userId dari component client mengambil dari usecontext userId

"use client";

import { Button, Input } from "@nextui-org/react";
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
import { HStack, VStack } from "@chakra-ui/react";
import AddClient from "./add-client";
import ExportExcel from "./excel-export";

export const Clients = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [clients, setClients] = useState([]);
  const uid = localStorage.getItem("id");
  const username = localStorage.getItem("name");

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

  const handleCloseModal = () => {
    setIsModalOpen(false);
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

            <AddClient
              userId={uid}
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              onAdd={handleAddClient}
            />
          </HStack>
          {/* <Button color="primary" startContent={<ExportIcon />} >
            Export to CSV
          </Button> */}
        </div>
      </div>
      <div className="max-w-[95rem] mx-auto w-full">
        <ClientTable userId={uid} />
      </div>
    </div>
  );
};
