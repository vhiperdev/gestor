import React, { useEffect, useState } from "react";
import { Chart, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';


Chart.register(ArcElement, Tooltip, Legend, Title);
Chart.defaults.plugins.tooltip.backgroundColor = 'rgb(24,24,27)';
Chart.defaults.plugins.legend.position = 'right';
Chart.defaults.plugins.legend.title.display = true;


export const Steam = () => {
  const [totalAttendance, setTotalAttendance] = React.useState('');
  const [inactiveClients, setInactiveClients] = useState([]);
  const [activeClients, setActiveClients] = useState([]);

  const uid = localStorage.getItem('id')



  useEffect(() => {
    handleActiveClientsApi()
    handleInactiveClientsApi()

  }, [])

  const handleActiveClientsApi = async () => {
    try {
      await fetch(`/api/home/getAllClientsOne?userid=${uid}`, {
        method: "GET",
        headers: {
          "X-Authorization": process.env.API_KEY,
        },
      })
        .then((res) => res.json())
        .then((data) => setActiveClients(data.data));
    } catch (error) {
      console.error(error);
    }
  };

  const handleInactiveClientsApi = async () => {
    try {
      await fetch(`/api/home/getAllClientsZero?userid=${uid}`, {
        method: "GET",
        headers: {
          "X-Authorization": process.env.API_KEY,
        },
      })
        .then((res) => res.json())
        .then((data) => setInactiveClients(data.data));
    } catch (error) {
      console.error(error);
    }
  };
  

  const data = {
    labels: [
      'Active Clients',
      'Inactive Clients'
    ],
    datasets: [{
      data: [activeClients.length, inactiveClients.length],
      backgroundColor: [
        'rgb(75,192,192)',
        'rgb(54,162,235)'
      ],
      // borderWidth: 2,
      radius: '80%'
    }]
  };


  return (
    <>
      <div className="" style={{width: "70%", height: "70%"}}>
        <div id="chart">
          <Doughnut  data={data} />
        </div>
      </div>
    </>
  );
};
