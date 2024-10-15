import React, { useState } from "react";
import "./Home.css";
import NavBar from "../NavBar/NavBar";
import Modal from "../Modal/Modal";
import Footer from "../Footer/Footer";
import ReCAPTCHA from "react-google-recaptcha";

export default function Home() {
  const [subject1, setSubject1] = useState("");
  const [subject2, setSubject2] = useState("");
  const [subject3, setSubject3] = useState("");
  const [zScore, setZScore] = useState("");
  const [year, setYear] = useState("");
  const [district, setDistrict] = useState("");
  const [userInputData, setInputData] = useState({});
  const [response, setResponse] = useState({});
  const [filteredResponse, setFilteredResponse] = useState([]);
  const [loading, setLoading] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);

  const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

  // This will be called when the CAPTCHA is solved
  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission

    if (!captchaValue) {
      alert("Please verify the CAPTCHA.");
      return;
    }

    setLoading(true);

    const userInputData = {
      subject1,
      subject2,
      subject3,
      zScore,
      year,
      district,
    };

    setInputData(userInputData);
    
    try {
      const response = await fetch("http://localhost:8080/predict/postUserInputData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
        },
        body: JSON.stringify(userInputData),
      });

      if (!response.ok) {
        throw new Error("Failed to send userInputData to backend");
      }

      const res = await response.json();
      console.log("Response:", res);
      setResponse(res.modelResponseData);
      setFilteredResponse(res.filteredModelResponseData);

      // Trigger modal using its JavaScript API
      const modal = new window.bootstrap.Modal(document.getElementById('staticBackdrop'));
      modal.show();
    } 
    
    catch (error) {
      console.error("Error:", error);
    }

    finally {
      setLoading(false);
    }

  };

  return (
    <div className="content" id="home">
      <NavBar />

      <div className="container d-flex flex-column bd-highlight justify-content-center align-items-center shadow-lg p-5">
        <div className="p-2 bd-highlight">
          {/* <img src={uom_logo} alt="UOM LOGO" width="150" height="160"></img> */}
        </div>

        <div className="p-2 bd-highlight pb-4">
          <h2 className="topic fw-bold text-center">FIND SUITABLE COURSES HERE</h2>
        </div>

        <div className="p-2 bd-highlight">
          <form className="row g-4 needs-validation" onSubmit={handleSubmit}>
            <div className="col-md-6">
              <label htmlFor="subject1" className="form-label">
                Subject No.1*
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
                Subject No.2*
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
                Subject No.3*
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
                Your Z-score*
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
                Year*
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
                District*
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

            {/* CAPTCHA */}
            <div className="col-12 d-flex justify-content-center pt-4">
              <ReCAPTCHA
                sitekey={RECAPTCHA_SITE_KEY}
                onChange={handleCaptchaChange}
              />
            </div>

            <div className="col-12 d-flex justify-content-center pt-2">
              <button className="btn btn-primary shadow-sm" type="submit" disabled={loading}>
                {loading ? (
                  <span 
                    className="spinner-border spinner-border-sm" 
                    role="status" 
                    aria-hidden="true"
                  ></span>
                ) : (
                  "Submit"
                )}
              </button>

              <button 
                className="btn btn-secondary shadow-sm ms-2"
                type="button" 
                onClick={() => {
                  // Reset all fields
                  setSubject1("");
                  setSubject2("");
                  setSubject3("");
                  setZScore("");
                  setYear("");
                  setDistrict("");
                  setResponse({});
                }}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>

      <Modal 
        userInputData={userInputData}
        response={response}
        filteredResponse={filteredResponse}
      />

      <Footer />
    </div>
  );
}
