import React, { useEffect, useState } from "react"; 
import axios from "../../api/axios";
import { Link } from "react-router-dom";
import "./PenghuniIndex.css"; 

const PenghuniIndex = () => {
  const [penghuni, setPenghuni] = useState([]);
  const [selectedKTP, setSelectedKTP] = useState(null);

  const fetchPenghuni = async () => {
    try {
      const res = await axios.get("/penghuni");
      setPenghuni(res.data);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
    }
  };

  useEffect(() => {
    fetchPenghuni();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus?")) {
      try {
        await axios.delete(`/penghuni/${id}`);
        fetchPenghuni();
      } catch (err) {
        console.error("Gagal menghapus:", err);
      }
    }
  };

  const openKTPModal = (fotoKTP) => {
    setSelectedKTP(fotoKTP);
  };

  const closeKTPModal = () => {
    setSelectedKTP(null);
  };

  return (
    <div className="penghuni-container">
      <div className="header-container">
        <h2 className="page-title">Daftar Penghuni</h2>
        <Link to="/penghuni/tambah" className="add-button">+ Tambah Penghuni</Link>
      </div>
      
      <div className="table-container">
        <table className="penghuni-table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Status Penghuni</th>
              <th>No Telepon</th>
              <th>Status Menikah</th>
              <th>KTP</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {penghuni.map((p) => (
              <tr key={p.id}>
                <td>{p.nama_lengkap}</td>
                <td>{p.status_penghuni}</td>
                <td>{p.nomor_telepon || "-"}</td>
                <td>{p.sudah_menikah ? "Sudah" : "Belum"}</td>
                <td className="ktp-column">
                  {p.foto_ktp ? (
                    <div 
                      className="ktp-container"
                      onClick={() => openKTPModal(`http://localhost:8000/storage/${p.foto_ktp}`)}
                    >
                      <img
                        src={`http://localhost:8000/storage/${p.foto_ktp}`}
                        alt="KTP"
                        className="ktp-image"
                      />
                      <div className="ktp-overlay">
                        <span>Lihat</span>
                      </div>
                    </div>
                  ) : (
                    <div className="no-ktp">Tidak ada KTP</div>
                  )}
                </td>
                <td className="action-column">
                  <Link to={`/penghuni/edit/${p.id}`} className="edit-button">Edit</Link>
                  <button onClick={() => handleDelete(p.id)} className="delete-button">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal KTP */}
      {selectedKTP && (
        <div className="ktp-modal-overlay" onClick={closeKTPModal}>
          <div className="ktp-modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="ktp-modal-close" onClick={closeKTPModal}>&times;</span>
            <img src={selectedKTP} alt="KTP Preview" className="ktp-modal-image" />
          </div>
        </div>
      )}
    </div>
  );
};

export default PenghuniIndex;