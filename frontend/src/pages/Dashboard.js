import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import {
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  Label,
  Brush
} from "recharts";
import "./Dashboard.css";

const formatRupiah = (angka) => {
  return angka
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    .replace(/(\d+)(\.\d{2})/, "Rp $1$2");
};

const Dashboard = () => {
  const [chartData, setChartData] = useState([]);
  const [stats, setStats] = useState({
    penghuni_tetap: 0,
    penghuni_kontrak: 0,
    rumah_dihuni: 0,
    rumah_kosong: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const summaryRes = await axios.get("/report/summary");
        const statsRes = await axios.get("/dashboard/stats");

        setChartData(summaryRes.data);
        setStats(statsRes.data);
      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
      }
    };

    fetchData();
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-200">
          <p className="font-bold text-gray-800">{`Bulan: ${label}`}</p>
          <div className="flex flex-col gap-2 mt-2">
            <p className="text-emerald-600 font-medium flex items-center">
              <span className="inline-block w-3 h-3 bg-emerald-500 rounded-full mr-2"></span>
              Pemasukan: {formatRupiah(payload[0].value)}
            </p>
            <p className="text-red-600 font-medium flex items-center">
              <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
              Pengeluaran: {formatRupiah(payload[1].value)}
            </p>
            {payload[0].value > payload[1].value ? (
              <p className="text-emerald-700 font-semibold mt-1">
                Profit: {formatRupiah(payload[0].value - payload[1].value)}
              </p>
            ) : (
              <p className="text-red-700 font-semibold mt-1">
                Defisit: {formatRupiah(payload[1].value - payload[0].value)}
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard</h2>

      <div className="stats-cards">
        <div className="card-item">
          <h4>Penghuni Tetap</h4>
          <p>{stats.penghuni_tetap}</p>
        </div>
        <div className="card-item">
          <h4>Penghuni Kontrak</h4>
          <p>{stats.penghuni_kontrak}</p>
        </div>
        <div className="card-item">
          <h4>Rumah Dihuni</h4>
          <p>{stats.rumah_dihuni}</p>
        </div>
        <div className="card-item">
          <h4>Rumah Kosong</h4>
          <p>{stats.rumah_kosong}</p>
        </div>
      </div>

      {/* Grafik yang ditingkatkan */}
      <div className="chart-container bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Ringkasan Keuangan Tahunan</h3>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 40 }}>
            <defs>
              <linearGradient id="colorPemasukan" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#4CAF50" stopOpacity={0.2}/>
              </linearGradient>
              <linearGradient id="colorPengeluaran" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f44336" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#f44336" stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis 
              dataKey="bulan" 
              tick={{ fill: '#666', fontSize: 12 }}
              axisLine={{ stroke: '#999' }}
            >
              <Label 
                value="Bulan" 
                position="bottom" 
                style={{ textAnchor: 'middle', fill: '#666', fontSize: 14, fontWeight: 'bold' }}
                dy={30}
              />
            </XAxis>
            <YAxis 
              tickFormatter={formatRupiah} 
              tick={{ fontSize: 12, fill: '#666' }}
              axisLine={{ stroke: '#999' }}
            >
              <Label 
                value="Jumlah (Rupiah)" 
                angle={-90} 
                position="insideLeft" 
                style={{ textAnchor: 'middle', fill: '#666', fontSize: 14, fontWeight: 'bold' }}
                dx={-10}
              />
            </YAxis>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              iconType="circle" 
              iconSize={10} 
              wrapperStyle={{ paddingTop: 20 }}
            />
            <Area 
              type="monotone"
              dataKey="pemasukan"
              fill="url(#colorPemasukan)"
              stroke="#4CAF50"
              fillOpacity={0.3}
              name="Pemasukan"
            />
            <Area 
              type="monotone"
              dataKey="pengeluaran"
              fill="url(#colorPengeluaran)"
              stroke="#f44336"
              fillOpacity={0.3}
              name="Pengeluaran"
            />
            <Brush 
              dataKey="bulan" 
              height={30} 
              stroke="#8884d8"
              fill="#f5f5f5"
              travellerWidth={10}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
