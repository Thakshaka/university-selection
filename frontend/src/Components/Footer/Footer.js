import React from "react";
import logo from "./logo.svg";
import "./Footer.css";
import "../Home/Home.js"

export default function Footer() {
  return (
    <div>
      <footer
        className="text-center text-white"
        style={{ backgroundColor: "#0A4275" }}
        id="footer"
      >
        <div className="container p-5">
          <div className="row">
            <div className="col-lg-6 col-md-6">
              <h5>University</h5>

              <p className="description">
                Description 1 here
              </p>
            </div>

            <div className="col-lg-6 col-md-6">
              <h5>Contact</h5>

              <p>
                <p className="description">
                Description 2 here
                </p>
                
              </p>
            </div>
          </div>
        </div>

        <div className="mb-2">
          <ul className="nav justify-content-center">
            <li className="nav-item">
              <a href="#home" className="nav-link px-2">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a href="#footer" className="nav-link px-2">
                About
              </a>
            </li>
            <li className="nav-item">
              <a href="#footer" className="nav-link px-2">
                Contact
              </a>
            </li>
          </ul>
        </div>

        <div className="text-center p-2 copyright" style={{ backgroundColor: "#17345A" }}>
          Copyright © 2024{" "}
          <img src={logo} alt="LOGO" width="40" height="27"></img> All rights
          reserved
        </div>
      </footer>
    </div>
  );
}
