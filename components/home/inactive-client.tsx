import { Card, CardBody } from "@nextui-org/react";
import React from "react";
import { Community } from "../icons/community";

export const InactiveClient = () => {
  return (
    <Card className="xl:max-w-sm bg-danger rounded-xl shadow-md px-3 w-full">
      <CardBody className="py-5">
        <div className="flex gap-2.5">
          <Community />
          <div className="flex flex-col">
            <span className="text-default-900 pb-5">Inactive Client</span>
          </div>
        </div>
        <div className="flex gap-2.5 py-2 items-center">
          <span className="text-default-900 text-xl font-semibold">
            34
          </span>
          <span className="text-white text-xs">of Client</span>
        </div>
      
      </CardBody>
    </Card>
  );
};
