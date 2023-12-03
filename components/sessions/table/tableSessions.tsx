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

  const userName = localStorage.getItem('name');
  // const userName = 'localStorage.getItem';

  useEffect(() => {
    fetchSessions();
  }, []);


  const fetchSessions = async () => {
    const response = await fetch(`/api/whatsapp/getSessionByUsername?session=${userName}`, {
      headers: {
        'X-Authorization': "YXRoaWZhYXJlemE6YXJlemFhdGhpZmE=",
      },
    });
    const data = await response.json();

    const datas = data['data']

    if (datas != undefined) {
      setSessions(data['data']['user']);
    } else if (datas === undefined) {
      setSessions(null)
    }
  };

  return (
    <div className=" w-full flex flex-col gap-4">
      <Table aria-label="Example empty table">
        <TableHeader>
          {/* <TableColumn>ID</TableColumn> */}
          <TableColumn>NAME</TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow key={sessions != null ? sessions['id'] : '-'}>
            <TableCell>{sessions != null ? sessions['id'] : '-'}</TableCell>
            {/* <TableCell>{sessions != null ? sessions['name'] : '-'}</TableCell> */}
          </TableRow>

        </TableBody>
      </Table>
    </div>
  );
};
