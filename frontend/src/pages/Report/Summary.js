import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
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
} from "recharts";
import "./ReportSummary.css";

// Format Rupiah yang aman dan konsisten
const formatRupiah = (angka) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
};

const ReportSummary = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bulan, setBulan] = useState(""); 
  const [availableMonths, setAvailableMonths] = useState([]); 

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/report/summary");
        
        const chartData = res.data.map((item) => ({
          bulan: item.bulan,
          Pemasukan: item.pemasukan,
          Pengeluaran: item.pengeluaran,
        }));

        const bulanList = chartData.map(item => item.bulan);
        setAvailableMonths(bulanList); 
        
        setData(chartData);
        setLoading(false);
      } catch (err) {
        console.error("Gagal mengambil data ringkasan laporan:", err);
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  useEffect(() => {
    const fetchDetail = async () => {
      if (bulan) {
        try {
          setLoading(true);
          const res = await axios.get(`/report/detail/${bulan}`);
          
          const chartData = res.data.pemasukan.map((item) => ({
            bulan: res.data.bulan,
            Pemasukan: item.iuran_kebersihan + item.iuran_satpam, 
            Pengeluaran: res.data.pengeluaran.reduce((sum, pengeluaran) => sum + pengeluaran.jumlah, 0)
          }));

          setData(chartData);
          setLoading(false);
        } catch (err) {
          console.error("Gagal mengambil data laporan detail:", err);
          setLoading(false);
        }
      }
    };

    if (bulan) {
      fetchDetail();
    }
  }, [bulan]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const pemasukan = payload.find(p => p.name === "Pemasukan")?.value || 0;
      const pengeluaran = payload.find(p => p.name === "Pengeluaran")?.value || 0;

      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`Bulan: ${label}`}</p>
          <p className="tooltip-income">
            <span className="dot income-dot"></span>
            Pemasukan: {formatRupiah(pemasukan)}
          </p>
          <p className="tooltip-expense">
            <span className="dot expense-dot"></span>
            Pengeluaran: {formatRupiah(pengeluaran)}
          </p>
          {pemasukan > pengeluaran ? (
            <p className="tooltip-profit">
              Profit: {formatRupiah(pemasukan - pengeluaran)}
            </p>
          ) : (
            <p className="tooltip-deficit">
              Defisit: {formatRupiah(pengeluaran - pemasukan)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="report-summary">
      <h2 className="report-title">
        Laporan Ringkasan Keuangan
      </h2>

      <div className="month-selector">
        <select
          value={bulan}
          onChange={(e) => setBulan(e.target.value)}
          className="month-select"
        >
          <option value="">Pilih Bulan</option>
          {availableMonths.map((bulanItem) => (
            <option key={bulanItem} value={bulanItem}>
              {bulanItem}
            </option>
          ))}
        </select>
      </div>

      <div className="chart-wrapper">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Memuat data...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="no-data">
            <p>Tidak ada data untuk ditampilkan.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart 
              data={data} 
              margin={{ top: 10, right: 30, left: 20, bottom: 40 }}
            >
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
              />
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
                dataKey="Pemasukan"
                fill="url(#colorPemasukan)"
                stroke="#4CAF50"
                fillOpacity={0.3}
                name="Pemasukan"
              />
              <Area 
                type="monotone"
                dataKey="Pengeluaran"
                fill="url(#colorPengeluaran)"
                stroke="#f44336"
                fillOpacity={0.3}
                name="Pengeluaran"
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default ReportSummary;
