import { Avatar, Card, CardBody } from "@nextui-org/react";
import moment from "moment";
import React, { useState, useEffect } from "react";

export const LatestTransaction = () => {
  const [transaction, setTransaction] = useState([]);
  const uid = localStorage.getItem("id");

  const handleGetTransaction = async () => {
    try {
      await fetch(`/api/finance/getAllFinance?userid=${uid}`, {
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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  useEffect(() => {
    handleGetTransaction();
  }, []);

  return (
    <Card className=" bg-default-50 rounded-xl shadow-md px-3">
      <CardBody className="py-5 gap-4">
        <div className="flex gap-2.5 justify-center">
          <div className="flex flex-col border-dashed border-2 border-divider py-2 px-6 rounded-xl">
            <span className="text-default-900 text-xl font-semibold">
              Latest Transactions
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-6 ">
          {transaction.slice(-5).map((item) => (
            <div key={item.id} className="grid grid-cols-4 w-full">
              <span className="text-default-900  font-semibold">
                {item.typeOfSales == 0 ? "OUT" : "IN"}
              </span>
              <span className="text-default-900  font-semibold">
                {moment(item.date).format("MMM Do YY, h:mm:ss a")}
              </span>
              <span className="text-default-900  font-semibold">
                {formatCurrency(item.price)}
              </span>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};
