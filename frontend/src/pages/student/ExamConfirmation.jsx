import React from "react";
import { Link, useParams } from "react-router-dom";

const ExamConfirmation = () => {
  const { id } = useParams();

  return (
    <div className="text-center">
      <h2>✅ Your answers have been submitted!</h2>
      <p>Exam ID: {id}</p>
      <Link to="/student/dashboard" className="btn btn-primary mt-3">
        Back to Dashboard
      </Link>
    </div>
  );
};

export default ExamConfirmation;
