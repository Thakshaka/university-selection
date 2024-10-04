import React from "react";

export default function Modal() {
  return (
    <div
      className="modal fade"
      id="staticBackdrop"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex="-1"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-bold" id="staticBackdropLabel">
              Courses Prediction
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="row text-center">
              <div className="col fw-bold fs-4 pb-4">A/L Examination</div>
            </div>
            <div className="row px-2 py-1">
              <div className="col">Stream</div>
              <div className="col">Physical Science</div>
            </div>
            <div className="row px-2 py-1">
              <div className="col">Z-Score</div>
              <div className="col">2.1000</div>
            </div>
            <div className="row px-2 py-1">
              <div className="col">A/L Year</div>
              <div className="col">2024</div>
            </div>
            <div className="row px-2 py-1">
              <div className="col">District</div>
              <div className="col">Colombo</div>
            </div>
            <div className="pt-4">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">No.</th>
                    <th scope="col">Unicode</th>
                    <th scope="col">Course</th>
                    <th scope="col">University</th>
                    <th scope="col">Previous Year</th>
                    <th scope="col">2024 Prediction</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>001A</td>
                    <td>Engineering</td>
                    <td>University of Moratuwa</td>
                    <td>2.0000</td>
                    <td>2.1000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-primary">
              All Courses
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
