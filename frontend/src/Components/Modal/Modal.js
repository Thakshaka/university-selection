import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';

export default function Modal({ userInputData, response, filteredResponse, category }) {
  const { t } = useTranslation();  // Translation hook
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
                ? t('modal.suitableCourses')
                : t('modal.allCourses')}
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
              <div className="col fw-bold fs-4 pb-4">{t('modal.examTitle', { year: userInputData.year })}</div>
            </div>
            
            <div className="row px-2 py-1">
              <div className="col">{t('modal.stream')}</div>
              <div className="col">{category}</div>
            </div>
            <div className="row px-2 py-1">
              <div className="col">{t('modal.zScore')}</div>
              <div className="col">{userInputData.zScore}</div>
            </div>
            <div className="row px-2 py-1">
              <div className="col">{t('modal.alYear')}</div>
              <div className="col">{userInputData.year}</div>
            </div>
            <div className="row px-2 py-1">
              <div className="col">{t('modal.district')}</div>
              <div className="col">{userInputData.district}</div>
            </div>
            <div className="pt-4">
            <div className="table-responsive" style={{ overflowX: 'auto' }}>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">No.</th>
                    <th scope="col">Unicode</th>
                    <th scope="col">{t('modal.course')}</th>
                    <th scope="col">{t('modal.university')}</th>
                    <th scope="col">{t('modal.previousYear')}</th>
                    <th scope="col">{t('modal.thisYearPrediction')}</th>
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
                            {t('modal.noCoursesFound')}
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
                          {t('modal.noCoursesFound')}
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
              {filtered ? t('modal.allCourses') : t('modal.suitableCourses')}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              {t('modal.close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
