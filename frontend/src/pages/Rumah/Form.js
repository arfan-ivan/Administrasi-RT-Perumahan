import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import "./RumahForm.css"; // Import CSS yang terpisah

const RumahForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    nomor_rumah: "",
    status: "tidak dihuni",
  });

  const [errors, setErrors] = useState({});
  const [penghuniAktif, setPenghuniAktif] = useState(null);
  const [penghuniList, setPenghuniList] = useState([]);
  const [penghuniBaru, setPenghuniBaru] = useState({
    penghuni_id: "",
    tanggal_masuk: "",
  });
  const [isiErrors, setIsiErrors] = useState({});

  useEffect(() => {
    if (id) {
      axios
        .get(`/rumah/${id}`)
        .then((res) => {
          setForm({
            nomor_rumah: res.data.nomor_rumah,
            status: res.data.status,
          });
          setPenghuniAktif(res.data.penghuni_saat_ini?.penghuni || null);
        })
        .catch((err) => {
          console.error("Gagal mengambil data rumah:", err);
        });

      // Load penghuni list
      axios
        .get("/penghuni")
        .then((res) => setPenghuniList(res.data))
        .catch((err) => console.error("Gagal load data penghuni:", err));
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const config = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };

      if (id) {
        await axios.put(`/rumah/${id}`, form, config);
      } else {
        await axios.post("/rumah", form, config);
      }

      navigate("/rumah");
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        console.error("Error:", err.message);
        alert("Terjadi kesalahan jaringan");
      }
    }
  };

  const handleIsiPenghuni = async (e) => {
    e.preventDefault();
    setIsiErrors({});

    try {
      await axios.post(`/rumah/${id}/isi-penghuni`, penghuniBaru);
      alert("Penghuni berhasil ditambahkan.");
      await axios.get(`/rumah/${id}`).then((res) => {
        setPenghuniAktif(res.data.penghuni_saat_ini?.penghuni || null);
      });
    } catch (err) {
      if (err.response?.status === 422) {
        setIsiErrors(err.response.data.errors || {});
      } else {
        alert("Terjadi kesalahan saat menambahkan penghuni.");
      }
    }
  };

  return (
    <div className="rumah-form-container">
      <h2 className="rumah-form-title">{id ? "Edit" : "Tambah"} Rumah</h2>

      {penghuniAktif && (
        <div className="rumah-active-resident">
          <strong>Penghuni Aktif:</strong> 
          <span>{penghuniAktif.nama_lengkap}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="rumah-form-group">
          <label className="rumah-form-label">Nomor Rumah</label>
          <input
            type="text"
            name="nomor_rumah"
            placeholder="Masukkan nomor rumah"
            value={form.nomor_rumah}
            onChange={handleChange}
            className="rumah-form-input"
          />
          {errors.nomor_rumah && (
            <div className="rumah-error-message">{errors.nomor_rumah[0]}</div>
          )}
        </div>

        <div className="rumah-form-group">
          <label className="rumah-form-label">Status Rumah</label>
          <select 
            name="status" 
            value={form.status} 
            onChange={handleChange}
            className="rumah-form-select"
          >
            <option value="dihuni">Dihuni</option>
            <option value="tidak dihuni">Tidak Dihuni</option>
          </select>
          {errors.status && (
            <div className="rumah-error-message">{errors.status[0]}</div>
          )}
        </div>

        <button type="submit" className="rumah-form-button">
          Simpan Data Rumah
        </button>
      </form>

      {/* --- ISI PENGHUNI FORM --- */}
      {id && (
        <div className="rumah-form-section" id="isi-penghuni">
          <h3 className="rumah-form-section-title">Isi Penghuni</h3>
          <form onSubmit={handleIsiPenghuni}>
            <div className="rumah-form-group">
              <label className="rumah-form-label">Pilih Penghuni</label>
              <select
                value={penghuniBaru.penghuni_id}
                onChange={(e) =>
                  setPenghuniBaru({ ...penghuniBaru, penghuni_id: e.target.value })
                }
                className="rumah-form-select"
              >
                <option value="">-- Pilih Penghuni --</option>
                {penghuniList.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nama_lengkap}
                  </option>
                ))}
              </select>
              {isiErrors.penghuni_id && (
                <div className="rumah-error-message">{isiErrors.penghuni_id[0]}</div>
              )}
            </div>

            <div className="rumah-form-group">
              <label className="rumah-form-label">Tanggal Masuk</label>
              <input
                type="date"
                value={penghuniBaru.tanggal_masuk}
                onChange={(e) =>
                  setPenghuniBaru({ ...penghuniBaru, tanggal_masuk: e.target.value })
                }
                className="rumah-date-input"
              />
              {isiErrors.tanggal_masuk && (
                <div className="rumah-error-message">{isiErrors.tanggal_masuk[0]}</div>
              )}
            </div>

            <button type="submit" className="rumah-add-resident-button">
              Tambahkan Penghuni
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default RumahForm;