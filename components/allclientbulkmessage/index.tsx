"use client"

import Link from "next/link";
import React, { useEffect } from "react";
import { HouseIcon } from "../icons/breadcrumb/house-icon";
import { UsersIcon } from "../icons/breadcrumb/users-icon";
import { Card, CardBody, Textarea, Button } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/select";
// import { parentData } from "./data";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { fetchAllStudentInfo } from "./data";
// minified version is also included
// import 'react-toastify/dist/ReactToastify.min.css';





export const AllClientBulkMessage = () => {
  const [message, setMessage] = React.useState("");
  const [numberParent, setNumberParent] = React.useState(new Set([]));
  // const [studentInfo, SetStudentInfo] = React.useState([]);

  const resolveAfter3Sec = new Promise(resolve => setTimeout(resolve, 3000));

  const username = localStorage.getItem('name')
  const userId = localStorage.getItem('id')

  useEffect(() => {
    StudentInfo()
  }, [])

  const StudentInfo = async () => {
    //    const data = await fetchAllStudentInfo()

    //    SetStudentInfo(data)
  }


  const successNotify = () => {
    toast.success("Successfully sent the message", {
      position: toast.POSITION.TOP_RIGHT
    });
    setMessage("");
  };

  const failedNotify = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const waitNotify = () => {
    toast.promise(
      resolveAfter3Sec,
      {
        pending: 'Sending a message',
      }
    )
  }

  const getSelectValue = (value) => {
    // console.log(value);
    setNumberParent(value);
  }


  const handlerSendMessage = () => {
    const targetParent = Array.from(numberParent)
    waitNotify();

    // console.log(Array.from(numberParent).join(", "))
    // console.log(targetParent.length)



    if (message === "") {
      failedNotify("Message cannot be empty");
      return;
    } else {
      const objectWithData = {
        'session': username,
        "message": message,
        "userId": userId
      };

      fetch('api/whatsapp/sendMessage', {
        method: 'POST',
        headers: {
          'X-Authorization': process.env.API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(objectWithData),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
          if (data.code === 200) {
            resetState();
            successNotify();
          } else if (data.code === 500) {
            failedNotify(data.message);
          } else if (data.code === 404) {
            failedNotify(data.message);
          }

        });
    }

    const resetState = () => {
      setMessage('');
      setTimeout(() => {
        window.location.reload();
      }, 2500);
    }



  };

  return (
    <div className="my-14 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
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
          <span>Send Message</span>
        </li>
      </ul>

      <h3 className="text-xl font-semibold">Send Message to All Client</h3>
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
        </div>
        <div className="flex flex-row gap-3.5 flex-wrap">
          {/* <AddAccount /> */}
          {/* <Button color="primary" startContent={<ExportIcon />} onClick={handleFileUpload}>
            Add With CSV
          </Button>
          <input type="file" ref={fileInputRef} style={{ display: "none" }} /> */}
        </div>
      </div>
      <div className="max-w-[50rem] mx-auto w-full mt-10">

        <Card className="py-4">
          <CardBody>
            {/* <Select
              label="Select parent number"
              placeholder="Select parent number"
              labelPlacement="outside-left"
              selectionMode="multiple"
              className="max-w-xl mt-5"
              isRequired={true}
              selectedKeys={numberParent}
              onSelectionChange={(value) => getSelectValue(value)}
            >
              {studentInfo.map((parent) => (
                <SelectItem key={parent.no_ortu} value={parent.no_ortu}>
                  {parent.kelas} | {parent.nama_lengkap}  
                </SelectItem>
              ))}
            </Select> */}
            <Textarea
              label="Message"
              labelPlacement="outside"
              placeholder="Enter your Message"
              className="max-w-xl"
              minRows={12}
              size="lg"
              isRequired={true}
              fullWidth={true}
              onChange={(e) => setMessage(e.target.value)}
            />

            <Button className="mt-5" color="success" onClick={handlerSendMessage}>
              Send Message
            </Button>
          </CardBody>

        </Card>
      </div>
    </div>
  );
};
