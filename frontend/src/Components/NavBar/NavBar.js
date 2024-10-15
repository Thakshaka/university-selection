import React from "react";
import "./NavBar.css";
import logo from "../../logo.svg";
import "../Footer/Footer.js";
import "../Home/Home.js";

export default function NavBar() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: "#003C7A" }}>
        <div className="container-fluid">
          <a className="navbar-brand" href="#home">
            <img src={logo} alt="LOGO" width="76" height="50"></img>
          </a>
          <a className="navbar-brand fw-bold" href="#!">
            UNIVERSITY
          </a>
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
                <a className="nav-link active" aria-current="page" href="#home">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#footer">
                  About
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#footer">
                  Contact
                </a>
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
                  Quick Access
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item" href="https://www.doenets.lk/examresults" target="_blank" rel="noreferrer">
                      Exam Results
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
