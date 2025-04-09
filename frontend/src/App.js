import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import PenghuniIndex from "./pages/Penghuni/Index";
import PenghuniForm from "./pages/Penghuni/Form";
import RumahIndex from "./pages/Rumah/Index";
import RumahForm from "./pages/Rumah/Form";
import PembayaranIndex from "./pages/Pembayaran/Index";
import PembayaranForm from "./pages/Pembayaran/Form";
import PengeluaranIndex from "./pages/Pengeluaran/Index";
import PengeluaranForm from "./pages/Pengeluaran/Form";
import ReportSummary from "./pages/Report/Summary";
import RelasiVisual from "./pages/Rumah/RelasiVisual";


function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/penghuni" element={<PenghuniIndex />} />
          <Route path="/penghuni/tambah" element={<PenghuniForm />} />
          <Route path="/penghuni/edit/:id" element={<PenghuniForm />} />
          <Route path="/rumah" element={<RumahIndex />} />
          <Route path="/rumah/tambah" element={<RumahForm />} />
          <Route path="/rumah/edit/:id" element={<RumahForm />} />
          <Route path="/relasi-rumah" element={<RelasiVisual />} />
          <Route path="/pembayaran" element={<PembayaranIndex />} />
          <Route path="/pembayaran/tambah" element={<PembayaranForm />} />
          <Route path="/pembayaran/edit/:id" element={<PembayaranForm />} />
          <Route path="/pengeluaran" element={<PengeluaranIndex />} />
          <Route path="/pengeluaran/tambah" element={<PengeluaranForm />} />
          <Route path="/pengeluaran/edit/:id" element={<PengeluaranForm />} />
          <Route path="/report" element={<ReportSummary />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
