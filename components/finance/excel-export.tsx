import React from "react";
import * as FileSaver from "file-saver";
import { Button, Input } from "@nextui-org/react";
import XSLX from "sheetjs-style";

const ExportExcel: any = ({ excelData, fileName }) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToExcel = async () => {
    const ws = XSLX.utils.json_to_sheet(excelData);
    const wb = {
      Sheets: {
        data: ws,
      },
      SheetNames: ["data"],
    };
    const excelBuffer = XSLX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  return (
    <>
      <Button onClick={() => exportToExcel()}>ExportExcel</Button>
    </>
  );
};

export default ExportExcel;
