// buat userId dari component client mengambil dari usecontext userId

"use client";

import { Button, Input, Card, CardBody } from "@nextui-org/react";
import { Community } from "../icons/community";
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
import ClientTable from "./table/table-finance";
import { HStack, VStack } from "@chakra-ui/react";
import AddClient from "./add-finance";
import ExportExcel from "./excel-export";
import FinanceTable from "./table/table-finance";

export const Finance = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transaction, setTransaction] = useState([]);
  const [expTransaction, setExpTransaction] = useState([]);

  const [productTotal, setProductTotal] = useState(0);
  const [planTotal, setPlanTotal] = useState(0);

  const userId = localStorage.getItem('id')
  const username = localStorage.getItem('name')

  const handleGetProduct = async () => {
    try {
      await fetch(`/api/finance/getProductPrice?userid=${userId}`, {
        method: "GET",
        headers: {
          "X-Authorization": process.env.API_KEY,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          data.data.length != 0
            ? data.data.reduce((a, b) => {
              setProductTotal(parseInt(a.price) + parseInt(b.price));

              // return ;
            })
            : "";
        });
    } catch (error) {
      console.error(error);
    }
  };

  const handleGetPlan = async () => {
    try {
      await fetch(`/api/finance/getPlanPrice?userid=${userId}`, {
        method: "GET",
        headers: {
          "X-Authorization": process.env.API_KEY,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          data.data.length != 0
            ? data.data.reduce((a, b) => {
              setPlanTotal(parseInt(a.price) + parseInt(b.price));
            })
            : "";
        });
    } catch (error) {
      console.error(error);
    }
  };

  const handleGetTransaction = async () => {
    try {
      await fetch(`/api/finance/getAllFinance?userid=${userId}`, {
        method: "GET",
        headers: {
          "X-Authorization": process.env.API_KEY,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setTransaction(data.data);
        });
    } catch (error) {
      console.error(error);
    }
  };


  const changePropTransaction = () => {
    const newArray = transaction.map((item) => {
      return { ...item, typeOfSales: item.typeOfSales == 1 ? "IN" : "OUT" };
      // Ganti 'Nilai Baru' dengan nilai baru yang ingin Anda berikan kepada properti 'propertyName'
    })
    console.log('duar', newArray)
    setExpTransaction(newArray);
  };

  useEffect(() => {
    handleGetProduct();
    handleGetPlan();
    handleGetTransaction();
    changePropTransaction();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "BRL",
    }).format(value);
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
          <span>Finance</span>
          <span> / </span>{" "}
        </li>
        <li className="flex gap-2">
          <span>List</span>
        </li>
      </ul>

      <h3 className="text-xl font-semibold">All Finance</h3>
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex flex-row gap-3.5 flex-wrap">
          <VStack spacing={4} align="start">
            {/* <Button onClick={handleOpenModal}>Add Client</Button> */}
            <ExportExcel
              fileName={`Finance - ${username} - ${new Date().getFullYear()}-${new Date().getMonth() + 1
                }-${new Date().getDate()}`}
              excelData={expTransaction}
            />

            {/* <AddClient
              userId={uid}
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              onAdd={handleAddClient}
            /> */}
          </VStack>
        </div>
      </div>
      {/*  */}
      <div className="flex justify-around gap-4">
        {/* left card */}
        {/* total dari type of sale product = 1 */}
        <Card className="xl:max-w-sm bg-success rounded-xl shadow-md px-3 w-full">
          <CardBody className="py-5">
            <div className="flex gap-2.5">
              <Community />
              <div className="flex flex-col">
                <span className="text-default-900 pb-5">Product - Plan</span>
              </div>
            </div>
            <div className="flex gap-2.5 py-2 items-center">
              <span className="text-default-900 text-xl font-semibold">
                R${productTotal - planTotal}
              </span>
              <span className="text-white text-xs">of All</span>
            </div>
          </CardBody>
        </Card>

        {/* center card */}

        <Card className="xl:max-w-sm bg-primary rounded-xl shadow-md px-3 w-full">
          <CardBody className="py-5">
            <div className="flex gap-2.5">
              <Community />
              <div className="flex flex-col">
                <span className="text-default-900 pb-5">Total Product</span>
              </div>
            </div>
            <div className="flex gap-2.5 py-2 items-center">
              <span className="text-default-900 text-xl font-semibold">
                R${productTotal}
              </span>
              <span className="text-white text-xs">of Product</span>
            </div>
          </CardBody>
        </Card>
        {/*  */}
        {/* right card */}
        <Card className="xl:max-w-sm bg-danger rounded-xl shadow-md px-3 w-full">
          <CardBody className="py-5">
            <div className="flex gap-2.5">
              <Community />
              <div className="flex flex-col">
                <span className="text-default-900 pb-5">Total Plan</span>
              </div>
            </div>
            <div className="flex gap-2.5 py-2 items-center">
              <span className="text-default-900 text-xl font-semibold">
                R${planTotal}
              </span>
              <span className="text-white text-xs">of Plan</span>
            </div>
          </CardBody>
        </Card>
      </div>
      <div className="max-w-[95rem] mx-auto w-full">
        <FinanceTable />
      </div>
    </div>
  );
};
