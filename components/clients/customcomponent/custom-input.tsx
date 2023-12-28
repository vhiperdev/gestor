import React from "react";
import { Input } from "@nextui-org/react";

const CustomInput = ({ handleOnChange, value }) => {
  return (
    <>
      <Input
        isRequired
        type="number"
        name="whatsappNumber"
        value={value}
        placeholder="Whatsapp Number"
        onChange={handleOnChange}
        startContent={
          <div className="pointer-events-none flex items-center">
            <span className="text-default-400 text-small">+55</span>
          </div>
        }
      />
    </>
  );
};

export default CustomInput;
