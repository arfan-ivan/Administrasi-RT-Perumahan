import React, { useEffect, useState } from "react";
import axios from "../../api/axios";

const RelasiVisual = () => {
  const [rumah, setRumah] = useState([]);

  useEffect(() => {
    axios.get("/rumah").then((res) => setRumah(res.data));
  }, []);

  return (
    <div>
      <h2>Relasi Rumah dan Penghuni</h2>
      <ul>
        {rumah.map((r) => (
          <li key={r.id}>
            <strong>{r.blok} {r.nomor}:</strong> {r.penghuni?.nama_lengkap || "Belum dihuni"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RelasiVisual;