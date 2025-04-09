import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import "./PenghuniForm.css";

const PenghuniForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    nama_lengkap: "",
    status_penghuni: "kontrak",
    nomor_telepon: "",
    sudah_menikah: false,
    foto_ktp: null,
  });

  const [existingData, setExistingData] = useState(null);

  useEffect(() => {
    if (id) {
      axios.get(`/penghuni/${id}`).then((res) => {
        const data = res.data;
        setForm({
          nama_lengkap: data.nama_lengkap || "",
          status_penghuni: data.status_penghuni || "kontrak",
          nomor_telepon: data.nomor_telepon || "",
          sudah_menikah: !!data.sudah_menikah,
          foto_ktp: null,
        });
        setExistingData(data);
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setForm({ ...form, foto_ktp: files[0] });
    } else if (name === "sudah_menikah") {
      setForm({ ...form, sudah_menikah: value === "1" });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    // Hanya kirim field yang ada nilainya / berubah
    if (form.nama_lengkap) data.append("nama_lengkap", form.nama_lengkap);
    if (form.status_penghuni) data.append("status_penghuni", form.status_penghuni);
    if (form.nomor_telepon) data.append("nomor_telepon", form.nomor_telepon);
    data.append("sudah_menikah", form.sudah_menikah ? 1 : 0);

    if (form.foto_ktp) {
      data.append("foto_ktp", form.foto_ktp);
    }

    try {
      if (id) {
        await axios.post(`/penghuni/${id}?_method=PUT`, data);
      } else {
        await axios.post("/penghuni", data);
      }
      navigate("/penghuni");
    } catch (error) {
      console.error("Gagal menyimpan:", error.response?.data || error.message);
      alert("Gagal menyimpan data. Pastikan semua input valid.");
    }
  };

  return (
    <div className="penghuni-form-container">
      <h2 className="form-title">{id ? "Edit" : "Tambah"} Penghuni</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label className="form-label" htmlFor="nama_lengkap">Nama Lengkap</label>
          <input
            id="nama_lengkap"
            type="text"
            name="nama_lengkap"
            placeholder="Masukkan nama lengkap"
            value={form.nama_lengkap}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="nomor_telepon">Nomor Telepon</label>
          <input
            id="nomor_telepon"
            type="text"
            name="nomor_telepon"
            placeholder="Masukkan nomor telepon"
            value={form.nomor_telepon}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="status_penghuni">Status Penghuni</label>
          <select
            id="status_penghuni"
            name="status_penghuni"
            value={form.status_penghuni}
            onChange={handleChange}
            className="form-select"
          >
            <option value="kontrak">Kontrak</option>
            <option value="tetap">Tetap</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="sudah_menikah">Status Pernikahan</label>
          <select
            id="sudah_menikah"
            name="sudah_menikah"
            value={form.sudah_menikah ? "1" : "0"}
            onChange={handleChange}
            className="form-select"
          >
            <option value="1">Sudah Menikah</option>
            <option value="0">Belum Menikah</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="foto_ktp">Foto KTP</label>
          <div className="file-input-container">
            <input
              id="foto_ktp"
              type="file"
              name="foto_ktp"
              onChange={handleChange}
              className="form-control"
            />
          </div>
          
          {existingData?.foto_ktp && (
            <div className="image-preview">
              <span className="image-preview-label">Foto KTP Sebelumnya:</span>
              <img
                src={`http://localhost:8000/storage/${existingData.foto_ktp}`}
                alt="Foto KTP"
                width="150"
              />
            </div>
          )}
        </div>

        <button type="submit" className="btn-submit">
          {id ? "Perbarui" : "Simpan"} Data Penghuni
        </button>
      </form>
    </div>
  );
};

export default PenghuniForm;