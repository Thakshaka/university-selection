import React, { useContext } from "react";
import "./NavBar.css";
import logo from "../../logo.svg";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function NavBar() {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const { isLoggedIn, user, logout } = useContext(AuthContext);
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
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: "#003C7A" }}>
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img src={logo} alt="LOGO" width="76" height="50"></img>
          </Link>
          <Link className="navbar-brand fw-bold" to="/">
            UNIVERSITY
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarScroll"
            aria-controls="navbarScroll"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarScroll">
            <ul
              className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll"
              style={{ "--bs-scroll-height": "100px" }}
            >
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/">
                  {t('navbar.home')}
                </Link>
              </li>
              {isLoggedIn && (
                <li className="nav-item">
                  <Link className="nav-link" to="/courses">
                    {t('navbar.courses')}
                  </Link>
                </li>
              )}
              <li className="nav-item">
                <li className="nav-item">
                  <a className="nav-link" href="#footer">{t('navbar.about')}</a>
                </li>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#footer">{t('navbar.contact')}</a>
              </li>
            </ul>
            
            {/* Language Switcher */}
            <ul className="navbar-nav ms-auto mb-2 mb-md-0 me-3">
              <li className="nav-item">
                <button className="btn btn-light btn-sm me-1" onClick={() => changeLanguage('en')}>
                  English
                </button>
              </li>
              <li className="nav-item">
                <button className="btn btn-light btn-sm me-1" onClick={() => changeLanguage('si')}>
                  සිංහල
                </button>
              </li>
              <li className="nav-item">
                <button className="btn btn-light btn-sm" onClick={() => changeLanguage('ta')}>
                  தமிழ்
                </button>
              </li>
            </ul>
            
            {/* Login/Logout Button */}
            <ul className="navbar-nav mb-2 mb-md-0 me-3">
              <li className="nav-item">
                {isLoggedIn ? (
                  <>
                    {/* <span className="navbar-text me-3">
                      {t('navbar.welcome', { username: user?.username })}
                    </span> */}
                    <button onClick={handleLogout} className="btn btn-outline-light btn-sm">
                      {t('navbar.logout')}
                    </button>
                  </>
                ) : (
                  <Link to="/login" className="btn btn-outline-light btn-sm">
                    {t('navbar.login')}
                  </Link>
                )}
              </li>
            </ul>
            
            {/* Quick Access Dropdown */}
            {/* <ul className="navbar-nav mb-2 mb-md-0">
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#!"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {t('navbar.quickAccess')}
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item" href="https://www.doenets.lk/examresults" target="_blank" rel="noreferrer">
                      {t('navbar.examResults')}
                    </a>
                  </li>
                </ul>
              </li>
            </ul> */}
          </div>
        </div>
      </nav>
    </div>
  );
}