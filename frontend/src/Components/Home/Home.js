import React, { useState } from "react";
import "./Home.css";
import NavBar from "../NavBar/NavBar";
import Modal from "../Modal/Modal";
import Footer from "../Footer/Footer";

export default function Home() {
  const [subject1, setSubject1] = useState("");
  const [subject2, setSubject2] = useState("");
  const [subject3, setSubject3] = useState("");
  const [zScore, setZScore] = useState("");
  const [year, setYear] = useState("");
  const [district, setDistrict] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form submission

    const inputData = {
      subject1,
      subject2,
      subject3,
      zScore,
      year,
      district,
    };

    console.log(inputData);

    // Trigger Bootstrap modal using its JavaScript API
    const modal = new window.bootstrap.Modal(document.getElementById('staticBackdrop'));
    modal.show();
  };

  return (
    <div className="content" id="home">
      <NavBar />

      <div className="container d-flex flex-column bd-highlight justify-content-center align-items-center shadow-lg p-5">
        <div className="p-2 bd-highlight">
          {/* <img src={uom_logo} alt="UOM LOGO" width="150" height="160"></img> */}
        </div>

        <div className="p-2 bd-highlight pb-4">
          <h2 className="topic fw-bold text-center">FIND YOUR COURSES HERE</h2>
        </div>

        <div className="p-2 bd-highlight">
          <form className="row g-4 needs-validation" onSubmit={handleSubmit}>
            <div className="col-md-6">
              <label htmlFor="subject1" className="form-label">
                Subject 1
              </label>
              <select
                className="form-select shadow-sm"
                id="subject1"
                value={subject1}
                onChange={(e) => setSubject1(e.target.value)}
                required
              >
                <option selected disabled value="">
                  Select
                </option>
                <option>Combined Mathematics</option>
                <option>Physics</option>
                <option>Chemistry</option>
              </select>

              <div className="mt-2"></div>

              <label htmlFor="subject2" className="form-label">
                Subject 2
              </label>
              <select
                className="form-select shadow-sm"
                id="subject2"
                value={subject2}
                onChange={(e) => setSubject2(e.target.value)}
                required
              >
                <option selected disabled value="">
                  Select
                </option>
                <option>Combined Mathematics</option>
                <option>Physics</option>
                <option>Chemistry</option>
              </select>

              <div className="mt-2"></div>

              <label htmlFor="subject3" className="form-label">
                Subject 3
              </label>
              <select
                className="form-select shadow-sm"
                id="subject3"
                value={subject3}
                onChange={(e) => setSubject3(e.target.value)}
                required
              >
                <option selected disabled value="">
                  Select
                </option>
                <option>Combined Mathematics</option>
                <option>Physics</option>
                <option>Chemistry</option>
              </select>
            </div>

            <div className="col-md-6">
              <label htmlFor="zScore" className="form-label">
                Z-score
              </label>
              <div className="input-group has-validation">
                <span className="input-group-text" id="inputGroupPrepend">
                  #
                </span>
                <input
                  type="text"
                  className="form-control shadow-sm"
                  id="zScore"
                  value={zScore}
                  onChange={(e) => setZScore(e.target.value)}
                  required
                />
              </div>

              <div className="mt-2"></div>

              <label htmlFor="year" className="form-label">
                Year
              </label>
              <select
                className="form-select shadow-sm"
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
              >
                <option selected disabled value="">
                  Select
                </option>
                <option>2024</option>
              </select>

              <div className="mt-2"></div>

              <label htmlFor="district" className="form-label">
                District
              </label>
              <select
                className="form-select shadow-sm"
                id="district"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                required
              >
                <option selected disabled value="">
                  Select
                </option>
                <option>Colombo</option>
                <option>Gampaha</option>
                <option>Kaluthara</option>
              </select>
            </div>

            <div className="col-12 d-flex justify-content-center pt-4">
              <button className="btn btn-primary shadow-sm" type="submit">
                Show Courses
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
