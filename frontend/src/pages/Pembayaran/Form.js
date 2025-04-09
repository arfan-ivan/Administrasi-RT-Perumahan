import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import "./PembayaranForm.css";

const BULAN_LIST = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const PembayaranForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [penghuni, setPenghuni] = useState([]);
  const [form, setForm] = useState({
    penghuni_id: "",
    tanggal_pembayaran: "",
    iuran_kebersihan: "",
    iuran_satpam: "",
    status: "lunas",
    bulan_dibayar: [],
    full_year: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const penghuniRes = await axios.get("/penghuni");
        setPenghuni(penghuniRes.data);

        if (id) {
          const res = await axios.get(`/pembayaran/${id}`);
          setForm({
            penghuni_id: res.data.penghuni?.id || "",
            tanggal_pembayaran: res.data.tanggal_pembayaran || "",
            iuran_kebersihan: res.data.iuran_kebersihan || "",
            iuran_satpam: res.data.iuran_satpam || "",
            status: res.data.status || "lunas",
            bulan_dibayar: res.data.bulan_dibayar || [],
            full_year: res.data.full_year || false,
          });
        }
      } catch (error) {
        console.error("Gagal memuat data:", error);
        alert("Gagal memuat data");
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    let updatedBulan = [...form.bulan_dibayar];

    if (e.target.checked) {
      updatedBulan.push(value);
    } else {
      updatedBulan = updatedBulan.filter((b) => b !== value);
    }

    setForm({ ...form, bulan_dibayar: updatedBulan, full_year: updatedBulan.length === 12 });
  };

  const handleFullYearToggle = (e) => {
    const isChecked = e.target.checked;
    setForm({
      ...form,
      full_year: isChecked,
      bulan_dibayar: isChecked ? BULAN_LIST : [],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      tanggal_pembayaran: form.tanggal_pembayaran,
      bulan_dibayar: form.bulan_dibayar,
      full_year: form.full_year,
    };

    try {
      if (id) {
        await axios.put(`/pembayaran/${id}`, payload);
      } else {
        await axios.post("/pembayaran", payload);
      }
      navigate("/pembayaran");
    } catch (err) {
      console.error("Gagal menyimpan pembayaran:", err.response?.data || err);
      alert(
        err.response?.data?.message ||
        "Terjadi kesalahan saat menyimpan pembayaran."
      );
    }
  };

  return (
    <div className="pembayaran-container">
      <h2 className="pembayaran-title">{id ? "Edit" : "Tambah"} Pembayaran</h2>
      <form onSubmit={handleSubmit} className="pembayaran-form">
        <div className="form-group">
          <label htmlFor="penghuni_id">Penghuni:</label>
          <select
            id="penghuni_id"
            name="penghuni_id"
            onChange={handleChange}
            value={form.penghuni_id}
            required
            className="form-control"
          >
            <option value="">-- Pilih Penghuni --</option>
            {penghuni.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nama_lengkap}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="tanggal_pembayaran">Tanggal Pembayaran:</label>
          <input
            type="date"
            id="tanggal_pembayaran"
            name="tanggal_pembayaran"
            value={form.tanggal_pembayaran}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="iuran_kebersihan">Iuran Kebersihan:</label>
          <input
            type="number"
            id="iuran_kebersihan"
            name="iuran_kebersihan"
            value={form.iuran_kebersihan}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="iuran_satpam">Iuran Satpam:</label>
          <input
            type="number"
            id="iuran_satpam"
            name="iuran_satpam"
            value={form.iuran_satpam}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
            className="form-control"
          >
            <option value="lunas">Lunas</option>
            <option value="belum">Belum</option>
          </select>
        </div>

        <div className="form-group">
          <label>Pembayaran untuk Bulan:</label>
          <div className="bulan-checkbox-grid">
            {BULAN_LIST.map((bulan, index) => (
              <label key={index} className="checkbox-item">
                <input
                  type="checkbox"
                  value={bulan}
                  checked={form.bulan_dibayar.includes(bulan)}
                  onChange={handleCheckboxChange}
                  disabled={form.full_year}
                />
                {bulan}
              </label>
            ))}
          </div>
          <label style={{ marginTop: "10px", display: "block" }}>
            <input
              type="checkbox"
              checked={form.full_year}
              onChange={handleFullYearToggle}
            />{" "}
            Bayar untuk 1 Tahun Penuh
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit">Simpan</button>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/pembayaran")}
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
};

export default PembayaranForm;
