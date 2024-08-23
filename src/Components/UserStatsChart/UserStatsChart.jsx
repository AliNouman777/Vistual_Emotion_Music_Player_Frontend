import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import 'chart.js/auto';
import './UserStatsChart.css'; 

const getToken = () => {
  const tokenData = JSON.parse(localStorage.getItem("token"));
  return tokenData ? tokenData.value : null;
};

const UserStatsChart = () => {
  const [chartData, setChartData] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      console.error('No token found');
      return;
    }

    axios.get('https://face-detection-music-player-backend.onrender.com/user/stats', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        const data = response.data;

        const months = Object.keys(data.monthly_registrations);
        const registrations = Object.values(data.monthly_registrations);

        setTotalUsers(registrations.reduce((sum, num) => sum + num, 0));

        setChartData({
          labels: months,
          datasets: [
            {
              label: 'User Registrations',
              data: registrations,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            }
          ]
        });
      })
      .catch(error => {
        console.error('Error fetching user stats:', error);
      });
  }, []);

  return (
    <div className="chart-container">
      <h2 className="total-users">Total Users: {totalUsers}</h2>
      {chartData ? (
        <Bar
          data={chartData}
          options={{
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1,
                },
              },
            },
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Monthly User Registrations'
              }
            }
          }}
          className="user-chart"
        />
      ) : (
        <p className="loading-text">Loading chart...</p>
      )}
    </div>
  );
};

export default UserStatsChart;
