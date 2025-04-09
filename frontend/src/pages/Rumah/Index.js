import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { Link, useNavigate } from "react-router-dom";
import "./RumahIndex.css"; // Import file CSS terpisah

const RumahIndex = () => {
  const [rumahList, setRumahList] = useState([]);
  const navigate = useNavigate();

  const fetchRumah = async () => {
    try {
      const res = await axios.get("/rumah");
      setRumahList(res.data);
    } catch (error) {
      console.error("Gagal memuat data rumah:", error);
    }
  };

  useEffect(() => {
    fetchRumah();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus rumah ini?")) {
      try {
        await axios.delete(`/rumah/${id}`);
        fetchRumah();
      } catch (error) {
        console.error("Gagal menghapus rumah:", error);
      }
    }
  };

  // Function untuk menentukan class status badge
  const getStatusClass = (status) => {
    if (status === 'Tersedia') return 'rumah-status-tersedia';
    if (status === 'Terisi') return 'rumah-status-terisi';
    return 'rumah-status-lainnya'; 
  };

  return (
    <div className="rumah-container">
      <div className="rumah-header">
        <h2 className="rumah-title">Daftar Rumah</h2>
        <Link to="/rumah/tambah" className="rumah-add-button">+ Tambah Rumah</Link>
      </div>

      <table className="rumah-table">
        <thead>
          <tr>
            <th>Nomor Rumah</th>
            <th>Status</th>
            <th>Penghuni Aktif</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {rumahList.length === 0 ? (
            <tr>
              <td colSpan="4" className="rumah-empty-message">
                Tidak ada data rumah.
              </td>
            </tr>
          ) : (
            rumahList.map((rumah, index) => (
              <tr key={rumah.id} className={index % 2 === 1 ? 'rumah-even-row' : ''}>
                <td>{rumah.nomor_rumah}</td>
                <td>
                  <span className={`rumah-status-badge ${getStatusClass(rumah.status)}`}>
                    {rumah.status}
                  </span>
                </td>
                <td>
                  {rumah.penghuni_saat_ini && rumah.penghuni_saat_ini.penghuni
                    ? rumah.penghuni_saat_ini.penghuni.nama_lengkap
                    : <span className="rumah-empty-cell">Tidak ada penghuni</span>}
                </td>
                <td>
                  <div className="rumah-action-buttons">
                    <Link to={`/rumah/edit/${rumah.id}`} className="rumah-edit-button">Edit</Link>
                    <button 
                      onClick={() => handleDelete(rumah.id)}
                      className="rumah-delete-button"
                    >
                      Hapus
                    </button>
                    <button 
                      onClick={() => navigate(`/rumah/edit/${rumah.id}#isi-penghuni`)}
                      className="rumah-penghuni-button"
                    >
                      Isi Penghuni
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RumahIndex;