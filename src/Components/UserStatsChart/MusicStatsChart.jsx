import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import 'chart.js/auto';
import './MusicStatsChart.css';  // We'll create this CSS file for styling

const getToken = () => {
  const tokenData = JSON.parse(localStorage.getItem("token"));
  return tokenData ? tokenData.value : null;
};

const MusicStatsChart = () => {
  const [chartData, setChartData] = useState(null);
  const [totalSongs, setTotalSongs] = useState(0);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      console.error('No token found');
      return;
    }

    axios.get('https://face-detection-music-player-backend.onrender.com/music/stats', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        const data = response.data;

        // Prepare chart data
        const musicTypes = Object.keys(data.music_stats);
        const musicCounts = Object.values(data.music_stats);

        // Set the total songs count
        setTotalSongs(data.total_songs);

        // Set the chart data
        setChartData({
          labels: musicTypes,
          datasets: [
            {
              label: 'Music Type Distribution',
              data: musicCounts,
              backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
                'rgba(201, 203, 207, 0.6)'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(201, 203, 207, 1)'
              ],
              borderWidth: 1,
            }
          ]
        });
      })
      .catch(error => {
        console.error('Error fetching music stats:', error);
      });
  }, []);

  return (
    <div className="music-chart-container">
      <h2 className="total-songs">Total Songs: {totalSongs}</h2>
      {chartData ? (
        <Pie
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Music Type Distribution'
              }
            }
          }}
          className="music-chart"
        />
      ) : (
        <p className="loading-text">Loading chart...</p>
      )}
    </div>
  );
};

export default MusicStatsChart;
