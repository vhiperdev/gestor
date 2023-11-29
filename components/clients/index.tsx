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
import { VStack } from "@chakra-ui/react";
import AddClient from "./add-client";

export const Clients = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
 

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
          <VStack spacing={4} align="start">
            <Button  onClick={handleOpenModal}>
              Add Client
            </Button>

            <AddClient userId="170323" isOpen={isModalOpen} onClose={handleCloseModal} onAdd={handleAddClient} />
          </VStack>
          {/* <Button color="primary" startContent={<ExportIcon />} >
            Export to CSV
          </Button> */}
        </div>
      </div>
      <div className="max-w-[95rem] mx-auto w-full">
        <ClientTable userId="170323"/>
      </div>
    </div>
  );
};
