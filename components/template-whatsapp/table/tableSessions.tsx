import {
  Link,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";

export const TableSessions = () => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    fetchSessions();
  }, []);


  const fetchSessions = async () => {
    const response = await fetch("/api/whatsapp/getAllSession", {
      headers: {
        'X-Authorization': "YXRoaWZhYXJlemE6YXJlemFhdGhpZmE=",
      },
    });
    const data = await response.json();
    const sessions = data['data'];
    setSessions(sessions);
  };

  return (
    <div className=" w-full flex flex-col gap-4">
      <Table aria-label="Example empty table">
      <TableHeader>
        <TableColumn>ID</TableColumn>
        <TableColumn>NAME</TableColumn>
      </TableHeader>
      <TableBody>
        {sessions.map((row) =>
          <TableRow key={row.key}>
            {(columnKey) => <TableCell>{getKeyValue(row, '1')}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
    </div>
  );
};
