import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { Link } from "react-router-dom";
import "./PembayaranIndex.css";

const PembayaranIndex = () => {
  const [pembayaran, setPembayaran] = useState([]);

  const fetchPembayaran = async () => {
    try {
      const res = await axios.get("/pembayaran");
      setPembayaran(res.data);
    } catch (err) {
      console.error("Gagal mengambil data pembayaran:", err);
      alert("Gagal mengambil data.");
    }
  };

  useEffect(() => {
    fetchPembayaran();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Hapus pembayaran ini?")) {
      try {
        await axios.delete(`/pembayaran/${id}`);
        fetchPembayaran();
      } catch (err) {
        console.error("Gagal menghapus:", err);
        alert("Gagal menghapus data.");
      }
    }
  };

  const formatRupiah = (num) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);

  const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";
    return new Date(tanggal).toLocaleString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="pembayaran-container">
      <div className="pembayaran-header">
        <h2 className="pembayaran-title">Data Pembayaran</h2>
        <Link to="/pembayaran/tambah" className="btn-tambah">
          + Tambah Pembayaran
        </Link>
      </div>

      <div className="table-container">
        <table className="pembayaran-table">
          <thead>
            <tr>
              <th>Nama Penghuni</th>
              <th>Rumah</th>
              <th>Tanggal Pembayaran</th>
              <th>Iuran Kebersihan</th>
              <th>Iuran Satpam</th>
              <th>Status</th>
              <th>Jumlah Bulan Dibayar</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pembayaran.length === 0 ? (
              <tr className="empty-data">
                <td colSpan="8">Tidak ada data.</td>
              </tr>
            ) : (
              pembayaran.map((p) => (
                <tr key={p.id}>
                  <td>{p.penghuni?.nama_lengkap || "-"}</td>
                  <td>{p.rumah ? `${p.rumah.nomor_rumah}` : "Belum terdaftar"}</td>
                  <td>{formatTanggal(p.tanggal_pembayaran)}</td>
                  <td className="text-right">{formatRupiah(p.iuran_kebersihan)}</td>
                  <td className="text-right">{formatRupiah(p.iuran_satpam)}</td>
                  <td>
                    <span
                      className={`status-badge ${p.status === "lunas" ? "status-lunas" : "status-belum"}`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td>
                    {p.full_year
                      ? "12 bulan (Penuh)"
                      : `${(p.bulan_dibayar?.length || 0)} bulan`}
                  </td>
                  <td className="action-buttons">
                    <Link to={`/pembayaran/edit/${p.id}`} className="btn-edit">
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="btn-delete"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PembayaranIndex;