// NavbarComponent.js
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { NavLink, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";

export const NavbarComponent = ({ onLogout }) => {
  const [isNavbarOpen, setNavbarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleNavbar = () => {
    setNavbarOpen(!isNavbarOpen);
  };

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  const handleSearch = (searchTerm) => {
    console.log("Buscar amigos con término:", searchTerm);
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark ">
        <div className="container">
          <NavLink to="/posts" className="navbar-brand">
            <img
              src="socialy.jpg"
              alt="Logo"
              style={{ width: "30px", marginRight: "5px" }}
            />
            Socialy
          </NavLink>

          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleNavbar}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className={`collapse navbar-collapse ${isNavbarOpen ? "show" : ""}`}
          >
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink to="/posts" className="nav-link" aria-current="page">
                  Posts
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/perfil" className="nav-link">
                  Hoja de vida
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/amigos" className="nav-link ">
                  Amplía tu red
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to={"/amigosagregados"} className="nav-link">
                  Mis amigos
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/registro" className="nav-link">
                  Registro
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink to="/usuarios" className="nav-link">
                  Listado usuarios excel
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink to={"/"} className="nav-link" onClick={handleLogout}>
                  Logout
                </NavLink>
              </li>
            </ul>
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </nav>
    </div>
  );
};
