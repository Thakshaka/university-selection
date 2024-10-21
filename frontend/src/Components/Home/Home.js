import React from "react";
import "./Home.css";
import NavBar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";
import { Link } from "react-router-dom";
import illustration1 from "./illustration1.svg";
import illustration2 from "./illustration2.svg";
import illustration3 from "./illustration3.svg";

export default function Home() {
  return (
    <div className="home-content" id="home">

      <NavBar />
      
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="hero-title">Find Your Perfect University Courses</h1>
              <p className="hero-subtitle">
                AI-powered recommendations tailored to your G.C.E. A/L results
              </p>
              <Link to="/courses">
                <button className="btn btn-explore btn-lg mt-4">Explore Now</button>
              </Link>
            </div>
            <div className="col-lg-6 d-none d-lg-block">
              <img
                src={illustration1}
                alt="Students exploring courses"
                className="img-fluid rounded"
              />
            </div>
          </div>
        </div>
      </section>
      
      <section className="features-section">
        <div className="container">
          <h2 className="section-title text-center mb-5">Empowering Your Academic Journey</h2>
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4">
              <div className="feature-image-container">
                <img src={illustration2} alt="AI-powered insights" className="img-fluid rounded" />
              </div>
            </div>
            <div className="col-lg-6 mb-4">
              <div className="feature-content">
                <h3>AI-Powered Insights</h3>
                <p>Our advanced machine learning model analyze years of historical data to provide accurate cutoff score predictions. This empowers you to make informed decisions about your university applications.</p>
                <ul className="feature-list">
                  <li>Precise cutoff score forecasts</li>
                  <li>Trend analysis of course popularity</li>
                  <li>Personalized success probability</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="row align-items-center flex-row-reverse">
            <div className="col-lg-6 mb-4">
              <div className="feature-image-container">
                <img src={illustration3} alt="Personalized recommendations" className="img-fluid rounded" />
              </div>
            </div>
            <div className="col-lg-6 mb-4">
              <div className="feature-content">
                <h3>Tailored Course Recommendations</h3>
                <p>Experience a personalized approach to course selection. Our system considers your unique academic profile to suggest the most suitable university courses.</p>
                <ul className="feature-list">
                  <li>Custom course matching</li>
                  <li>Career path alignment</li>
                  <li>Holistic profile assessment</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="text-center mt-5">
            <h3 className="mb-4">Supporting Your Language Needs</h3>
            <p>Access our platform in Sinhala, Tamil, and English, ensuring that language is never a barrier to your educational aspirations.</p>
            <div className="language-icons">
              <i className="fas fa-language fa-3x mx-3"></i>
              <i className="fas fa-globe fa-3x mx-3"></i>
              <i className="fas fa-comments fa-3x mx-3"></i>
            </div>
          </div>
        </div>
      </section>

      <Footer />

    </div>
  );
}