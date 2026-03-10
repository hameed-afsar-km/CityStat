import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartsProps {
  weatherHistory: number[];
  aqiHistory: number[];
  trafficHistory: number[];
  years: number[];
}

export default function Charts({ weatherHistory, aqiHistory, trafficHistory, years }: ChartsProps) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { color: '#fff' }
      },
      title: { display: false }
    },
    scales: {
      x: {
        ticks: { color: '#aaa' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      y: {
        ticks: { color: '#aaa' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      }
    }
  };

  const aqiData = {
    labels: years,
    datasets: [
      {
        fill: true,
        label: 'AQI Trend',
        data: aqiHistory,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const tempData = {
    labels: years,
    datasets: [
      {
        fill: true,
        label: 'Temperature (°C)',
        data: weatherHistory,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const trafficData = {
    labels: years,
    datasets: [
      {
        fill: true,
        label: 'Traffic Congestion (%)',
        data: trafficHistory,
        borderColor: 'rgb(255, 206, 86)',
        backgroundColor: 'rgba(255, 206, 86, 0.5)',
      },
    ],
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="h-48 w-full bg-white/5 p-4 rounded-xl border border-white/10">
        <Line options={options} data={aqiData} />
      </div>
      <div className="h-48 w-full bg-white/5 p-4 rounded-xl border border-white/10">
        <Line options={options} data={tempData} />
      </div>
      <div className="h-48 w-full bg-white/5 p-4 rounded-xl border border-white/10">
        <Line options={options} data={trafficData} />
      </div>
    </div>
  );
}
