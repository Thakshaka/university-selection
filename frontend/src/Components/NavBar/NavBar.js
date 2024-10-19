import React from "react";
import "./NavBar.css";
import logo from "../../logo.svg";
import "../Footer/Footer.js";
import "../Home/Home.js";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function NavBar() {

  const { t } = useTranslation();  // Translation hook

  const { i18n } = useTranslation(); // Access i18n instance

  // Function to change the language
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
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
              <li className="nav-item">
                <Link className="nav-link" to="#footer">
                  {t('navbar.about')}
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="#footer">
                  {t('navbar.contact')}
                </Link>
              </li>
            </ul>
            {/* Language Switcher */}
            <ul className="navbar-nav ms-auto mb-2 mb-md-0">
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
            <ul className="navbar-nav ms-auto mb-2 mb-md-0">
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
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
