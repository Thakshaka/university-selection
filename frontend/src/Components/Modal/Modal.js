import React from "react";

export default function Modal() {
  return (
    <div>
      <button
        type="submit"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#staticBackdrop"
      >
        Modal Button
      </button>

      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fw-bold" id="staticBackdropLabel">
                Your Results
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="row  text-center">
                <div className="col fw-bold fs-4 pb-4">Semeseter 1</div>
              </div>
              <div className="row px-2 py-1">
                <div className="col">Name</div>
                <div className="col">R.M.T.P.R.B RATHNAYAKE</div>
              </div>
              <div className="row px-2 py-1">
                <div className="col">Index</div>
                <div className="col">000001A</div>
              </div>
              <div className="row px-2 py-1">
                <div className="col">Rank</div>
                <div className="col">1</div>
              </div>
              <div className="row px-2 py-1">
                <div className="col">SGPA</div>
                <div className="col">4.00</div>
              </div>
              <div className="row px-2 py-1">
                <div className="col">Degree</div>
                <div className="col">Information Technology</div>
              </div>
              <div className="row px-2 py-1">
                <div className="col">Intake</div>
                <div className="col">21 Batch</div>
              </div>
              <div className="pt-4">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th scope="col">Module</th>
                      <th scope="col">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Fundamentals of Mathematics</td>
                      <td>A</td>
                    </tr>
                    <tr>
                      <td>Programming Fundamentals</td>
                      <td>A</td>
                    </tr>
                    <tr>
                      <td>Digital System Design</td>
                      <td>A</td>
                    </tr>
                    <tr>
                      <td>Computer Organization</td>
                      <td>A</td>
                    </tr>
                    <tr>
                      <td>Multimedia Technologies</td>
                      <td>A</td>
                    </tr>
                    <tr>
                      <td>English</td>
                      <td>A</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-footer">

              <button type="button" className="btn btn-primary">
                All Results
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
    </div>
  );
}
