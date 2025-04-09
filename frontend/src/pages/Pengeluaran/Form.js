import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import "./PengeluaranForm.css";

const PengeluaranForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({
    tanggal: "",
    kategori: "",
    jumlah: "",
    deskripsi: "",
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      axios.get(`/pengeluaran/${id}`)
        .then((res) => setForm(res.data))
        .catch((err) => console.error("Gagal mengambil data:", err));
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (id) {
        await axios.put(`/pengeluaran/${id}`, form);
      } else {
        await axios.post("/pengeluaran", form);
      }
      navigate("/pengeluaran");
    } catch (error) {
      console.error("Terjadi kesalahan saat menyimpan pengeluaran:", error);
      setError("Gagal menyimpan data. Pastikan semua field diisi dengan benar.");
    }
  };

  return (
    <div className="pengeluaran-container">
      <h2 className="form-title">{id ? "Edit" : "Tambah"} Pengeluaran</h2>
      
      {error && (
        <div className="error-message">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="pengeluaran-form">
        <div className="form-group">
          <label htmlFor="tanggal">Tanggal:</label>
          <input
            type="date"
            id="tanggal"
            name="tanggal"
            value={form.tanggal}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="kategori">Kategori:</label>
          <input
            type="text"
            id="kategori"
            name="kategori"
            placeholder="Kategori Pengeluaran"
            value={form.kategori}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="jumlah">Jumlah:</label>
          <input
            type="number"
            id="jumlah"
            name="jumlah"
            placeholder="Jumlah"
            value={form.jumlah}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="deskripsi">Deskripsi:</label>
          <textarea
            id="deskripsi"
            name="deskripsi"
            placeholder="Deskripsi (opsional)"
            value={form.deskripsi}
            onChange={handleChange}
            rows="4"
          ></textarea>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit">Simpan</button>
          <button 
            type="button" 
            className="btn-cancel"
            onClick={() => navigate("/pengeluaran")}
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
};

export default PengeluaranForm;