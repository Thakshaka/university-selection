import React from "react";
import "./Home.css";
import NavBar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";
import { Link } from "react-router-dom";

export default function Home() {

  return (
    <div className="content" id="home">
      <NavBar />
      <div className="container d-flex flex-column bd-highlight justify-content-center align-items-center shadow-lg p-5">
        <Link to="/courses">
          <button className="btn btn-primary mt-4">Browse Courses</button>
        </Link>
      </div>
      <Footer />
    </div>
  );
}
