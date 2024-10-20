import React, { useContext } from "react";
import "./NavBar.css";
import logo from "../../logo.svg";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function NavBar() {
  const { t, i18n } = useTranslation();
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        logout();
        navigate('/');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src={logo} alt="LOGO" width="50" height="50" className="me-2" />
          <span className="brand-text">UniHope</span>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">{t('navbar.home')}</Link>
            </li>
            {isLoggedIn && (
              <li className="nav-item">
                <Link className="nav-link" to="/courses">{t('navbar.courses')}</Link>
              </li>
            )}
            <li className="nav-item">
              <a className="nav-link" href="#footer">{t('navbar.about')}</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#footer">{t('navbar.contact')}</a>
            </li>
          </ul>
          <div className="d-flex align-items-center">
            <div className="dropdown me-3">
              <button className="btn btn-outline-light dropdown-toggle" type="button" id="languageDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                {t('navbar.language')}
              </button>
              <ul className="dropdown-menu" aria-labelledby="languageDropdown">
                <li><button className="dropdown-item" onClick={() => changeLanguage('en')}>English</button></li>
                <li><button className="dropdown-item" onClick={() => changeLanguage('si')}>සිංහල</button></li>
                <li><button className="dropdown-item" onClick={() => changeLanguage('ta')}>தமிழ்</button></li>
              </ul>
            </div>
            {isLoggedIn ? (
              <button onClick={handleLogout} className="btn btn-outline-light">
                {t('navbar.logout')}
              </button>
            ) : (
              <Link to="/login" className="btn btn-outline-light">
                {t('navbar.login')}
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}