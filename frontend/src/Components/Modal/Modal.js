import React, { useState, useEffect } from "react";


export default function Modal({ userInputData, response, filteredResponse, category }) {
  const [filtered, setFiltered] = useState(true);

  useEffect(() => {
    // Add event listener for modal hide event
    const modalElement = document.getElementById('staticBackdrop');
    const handleModalHide = () => setFiltered(true); // Reset filtered to true when modal is closed

    modalElement.addEventListener('hidden.bs.modal', handleModalHide);

    // Cleanup the event listener when component is unmounted
    return () => {
      modalElement.removeEventListener('hidden.bs.modal', handleModalHide);
    };
  }, []);

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
            {filtered 
                ? "Suitable Courses" 
                : "All Courses"}
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
              <div className="col fw-bold fs-4 pb-4">G.C.E. A/L Examination ({userInputData.year})</div>
            </div>
            
            <div className="row px-2 py-1">
              <div className="col">Stream</div>
              <div className="col">{category}</div>
            </div>
            <div className="row px-2 py-1">
              <div className="col">Z-score</div>
              <div className="col">{userInputData.zScore}</div>
            </div>
            <div className="row px-2 py-1">
              <div className="col">A/L Year</div>
              <div className="col">{userInputData.year}</div>
            </div>
            <div className="row px-2 py-1">
              <div className="col">District</div>
              <div className="col">{userInputData.district}</div>
            </div>
            <div className="pt-4">
            <div className="table-responsive" style={{ overflowX: 'auto' }}>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">No.</th>
                    <th scope="col">Unicode</th>
                    <th scope="col">Course</th>
                    <th scope="col">University</th>
                    <th scope="col">Previous Year</th>
                    <th scope="col">This Year (Prediction)</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered
                    ? filteredResponse.length > 0
                      ? filteredResponse.map((result, index) => (
                          <tr key={index}>
                            <th scope="row">{index + 1}</th>
                            <td>{result.unicode}</td>
                            <td>{result.course}</td>
                            <td>{result.university}</td>
                            <td>{result.previous_year}</td>
                            <td>{result.this_year_predicted}</td>
                          </tr>
                        ))
                      : (
                        <tr>
                          <td colSpan="6" className="text-center">
                            No courses found
                          </td>
                        </tr>
                      )
                    : response.length > 0
                    ? response.map((result, index) => (
                        <tr key={index}>
                          <th scope="row">{index + 1}</th>
                          <td>{result.unicode}</td>
                          <td>{result.course}</td>
                          <td>{result.university}</td>
                          <td>{result.previous_year}</td>
                          <td>{result.this_year_predicted}</td>
                        </tr>
                      ))
                    : (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No courses found
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setFiltered(!filtered)}
            >
              {filtered ? "All Courses" : "Suitable Courses"}
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
