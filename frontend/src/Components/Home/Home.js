import React, { useEffect, useState } from "react";
import "./Home.css";
import NavBar from "../NavBar/NavBar";
import uom_logo from "../../uom-logo.svg";
import Modal from "../Modal/Modal";
import Footer from "../Footer/Footer";
import Axios from "axios";

export default function Home() {

  return (
    <div className="content" id="home">
      <NavBar />

      <div className="container d-flex flex-column bd-highlight justify-content-center align-items-center shadow-lg p-5">
        <div className="p-2 bd-highlight">
          <img src={uom_logo} alt="UOM LOGO" width="150" height="160"></img>
        </div>

        <div className="p-2 bd-highlight pb-4">
          <h2 className="topic fw-bold text-center">FIND YOUR EXAM RESULTS HERE</h2>
        </div>

        <div className="p-2 bd-highlight">
          <form className="row g-4 needs-validation">

          <div className="col-md-6">
              <label for="validationCustomUsername" className="form-label">
                Index Number
              </label>
              <div className="input-group has-validation">
                <span className="input-group-text" id="inputGroupPrepend">
                  #
                </span>
                <input
                  type="text"
                  className="form-control shadow-sm"
                  id="validationCustomUsername"
                  aria-describedby="inputGroupPrepend"
                  required
                ></input>
              </div>
            </div>

            <div className="col-md-6">
              <label for="validationCustom04" className="form-label">
                Semester
              </label>
              <select
                className="form-select shadow-sm"
                id="validationCustom04"
                required
              >
                <option selected disabled value="">
                  Select
                </option>
                <option>L1S1</option>
                <option>L1S2</option>
                <option>L2S1</option>
              </select>
            </div>

            <div className="col-12 d-flex justify-content-center pt-4">
              <button className="btn btn-primary shadow-sm" type="submit">
                Show Results
              </button>
            </div>
          </form>
        </div>
      </div>

      <Modal />

      <Footer />
      
    </div>
  );
}
