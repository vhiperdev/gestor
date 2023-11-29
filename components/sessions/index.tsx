import { Button, Input } from "@nextui-org/react";
import Link from "next/link";
import React, { useRef, useEffect } from "react";
import { DotsIcon } from "../icons/accounts/dots-icon";
import { ExportIcon } from "../icons/accounts/export-icon";
import { InfoIcon } from "../icons/accounts/info-icon";
import { TrashIcon } from "../icons/accounts/trash-icon";
import { HouseIcon } from "../icons/breadcrumb/house-icon";
import { UsersIcon } from "../icons/breadcrumb/users-icon";
import { SettingsIcon } from "../icons/sidebar/settings-icon";
import { AddSessions } from "./addSessions";
import { TableSessions } from "./table/tableSessions";
import { DeleteSession } from "./deleteSession";


export const Sessions = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isButtonVisible, setIsButtonVisible] = React.useState(false);

  useEffect(() => {
    checkSession();
  }, []);



  const checkSession = async () => {
    fetch('/api/whatsapp/getAllSession', {
      method: 'GET',
      headers: {
        'X-Authorization': process.env.API_KEY,
        'Content-Type': 'application/json'
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.data === process.env.SESSION_NAME) {
          setIsButtonVisible(false);
        } else if (data.data != process.env.SESSION_NAME) {
          setIsButtonVisible(true);
        } else if (data.code === 404) {
          setIsButtonVisible(true);
        }

      });
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
          <span>Whatsapp</span>
          <span> / </span>{" "}
        </li>
        <li className="flex gap-2">
          <span>Sessions</span>
        </li>
      </ul>

      <h3 className="text-xl font-semibold">Session Manager</h3>
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
        </div>
        <div className="flex flex-row gap-3.5 flex-wrap">
          {isButtonVisible && (
            <AddSessions />
          )}

          {!isButtonVisible && (
            <DeleteSession />
          )}

          {/* <Button color="primary" startContent={<ExportIcon />} onClick={handleFileUpload}>
            Add With CSV
          </Button>
          <input type="file" ref={fileInputRef} style={{ display: "none" }} /> */}
        </div>
      </div>
      <div className="max-w-[95rem] mx-auto w-full">
          <TableSessions />
        </div>
    </div>
  );
};
