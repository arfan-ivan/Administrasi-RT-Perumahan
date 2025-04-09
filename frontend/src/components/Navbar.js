import { Link } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState("/");

  const handleMenuClick = (path) => {
    setActiveMenu(path);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1>Arfan Nur Ivandi</h1>
        </div>
        <ul className="navbar-menu">
          <li className={activeMenu === "/" ? "active" : ""}>
            <Link to="/" onClick={() => handleMenuClick("/")}>
              <i className="nav-icon dashboard-icon"></i>
              Dashboard
            </Link>
          </li>
          <li className={activeMenu === "/penghuni" ? "active" : ""}>
            <Link to="/penghuni" onClick={() => handleMenuClick("/penghuni")}>
              <i className="nav-icon penghuni-icon"></i>
              Penghuni
            </Link>
          </li>
          <li className={activeMenu === "/rumah" ? "active" : ""}>
            <Link to="/rumah" onClick={() => handleMenuClick("/rumah")}>
              <i className="nav-icon rumah-icon"></i>
              Rumah
            </Link>
          </li>
          <li className={activeMenu === "/pembayaran" ? "active" : ""}>
            <Link to="/pembayaran" onClick={() => handleMenuClick("/pembayaran")}>
              <i className="nav-icon pembayaran-icon"></i>
              Pembayaran
            </Link>
          </li>
          <li className={activeMenu === "/pengeluaran" ? "active" : ""}>
            <Link to="/pengeluaran" onClick={() => handleMenuClick("/pengeluaran")}>
              <i className="nav-icon pengeluaran-icon"></i>
              Pengeluaran
            </Link>
          </li>
          <li className={activeMenu === "/report" ? "active" : ""}>
            <Link to="/report" onClick={() => handleMenuClick("/report")}>
              <i className="nav-icon report-icon"></i>
              Laporan
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;