import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { Link } from "react-router-dom";
import "./PengeluaranIndex.css";

const PengeluaranIndex = () => {
  const [pengeluaran, setPengeluaran] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPengeluaran = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/pengeluaran");
      setPengeluaran(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPengeluaran();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Yakin hapus pengeluaran ini?")) {
      try {
        await axios.delete(`/pengeluaran/${id}`);
        fetchPengeluaran();
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  return (
    <div className="pengeluaran-container">
      <div className="pengeluaran-header">
        <h2>Data Pengeluaran</h2>
        <Link to="/pengeluaran/tambah" className="add-button">
          <span>+</span> Tambah Pengeluaran
        </Link>
      </div>

      {isLoading ? (
        <div className="loading">Memuat data...</div>
      ) : pengeluaran.length === 0 ? (
        <div className="empty-state">Belum ada data pengeluaran</div>
      ) : (
        <div className="table-container">
          <table className="pengeluaran-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Kategori</th>
                <th>Jumlah</th>
                <th>Deskripsi</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pengeluaran.map((p) => (
                <tr key={p.id}>
                  <td>{p.tanggal}</td>
                  <td>{p.kategori}</td>
                  <td className="amount">
                    Rp {parseFloat(p.jumlah).toLocaleString("id-ID")}
                  </td>
                  <td>{p.deskripsi}</td>
                  <td className="actions">
                    <Link to={`/pengeluaran/edit/${p.id}`} className="edit-button">
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="delete-button"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PengeluaranIndex;