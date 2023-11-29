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
import ClientTable from "./table/table-accounts";
import { Container, Heading, VStack } from "@chakra-ui/react";
import AccountTable from "./table/table-accounts";
import AddAcount from "./add-accounts";

export const Accounts = () => {
  const [users, setUsers] = useState([]); // Simpan daftar pengguna di sini
  const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);


  useEffect(() => {
    fetechAccount();
  }, []);

  const fetechAccount = async () => {
    const response = await fetch("/api/accounts/getAllAccount", {
      headers: {
        'X-Authorization': process.env.API_KEY,
      },
    });
    const data = await response.json();
    const accountData = data['data'];
    setUsers(accountData)
    
  };



  const handleAddUser = (newUser) => {
    // Implementasikan logika penambahan pengguna ke state atau API Auth0 v2 di sini
    setUsers([...users, { ...newUser, id: users.length + 1, isActive: true }]);
  };

  const handleToggleUser = (userId, isActive) => {
    // Implementasikan logika pengaktifan atau non-aktifasi pengguna ke state atau API Auth0 v2 di sini
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, isActive } : user
    );
    setUsers(updatedUsers);
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
          <span>Account</span>
          <span> / </span>{" "}
        </li>
        <li className="flex gap-2">
          <span>List</span>
        </li>
      </ul>

      <h3 className="text-xl font-semibold">All Account</h3>
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex flex-row gap-3.5 flex-wrap">
          <VStack spacing={4} align="start">
            <Button onClick={() => setAddUserModalOpen(true)}>Add Account</Button>
            <AddAcount
              isOpen={isAddUserModalOpen}
              onClose={() => setAddUserModalOpen(false)}
              onAddUser={handleAddUser}
            />
          </VStack>
          {/* <Button color="primary" startContent={<ExportIcon />} >
            Export to CSV
          </Button> */}
        </div>
      </div>
      <div className="max-w-[95rem] mx-auto w-full">
        <AccountTable users={users} onToggleUser={handleToggleUser} />
      </div>
    </div>
  );
};
