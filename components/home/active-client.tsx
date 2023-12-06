import { Card, CardBody } from "@nextui-org/react";
import React, { useState, useEffect } from "react";
import { Community } from "../icons/community";

export const ActiveClient = () => {
  const [clients, setClients] = useState([]);

  const uid = localStorage.getItem("id");

  const handleClientsApi = async () => {
    try {
      await fetch(`/api/home/getAllClientsOne?userid=${uid}`, {
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
  return (
    <Card className="xl:max-w-sm bg-primary rounded-xl shadow-md px-3 w-full">
      <CardBody className="py-5">
        <div className="flex gap-2.5">
          <Community />
          <div className="flex flex-col">
            <span className="text-white pb-3">Active Client</span>
          </div>
        </div>
        <div className="flex gap-2.5 py-2 items-center">
          <span className="text-white text-xl font-semibold">
            {clients.length}
          </span>
          <span className="text-white text-xs">of Clients</span>
        </div>
      </CardBody>
    </Card>
  );
};
