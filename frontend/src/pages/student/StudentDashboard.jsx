import React, { useEffect, useState } from "react";
import { getExams } from "../../services/examService";
import { Link } from "react-router-dom";

const StudentDashboard = () => {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await getExams();
        setExams(res.data);
      } catch (err) {
        alert("Error loading exams");
      }
    };
    fetchExams();
  }, []);

  return (
    <div>
      <h2>Available Exams</h2>
      <div className="row">
        {exams.map((exam) => (
          <div className="col-md-4 mb-3" key={exam._id}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{exam.title}</h5>
                <p className="card-text">
                  Teacher: {exam.teacher?.name} <br />
                  Exam ID: {exam._id}
                </p>
                <Link to={`/student/exam/${exam._id}`} className="btn btn-primary">
                  Start Exam
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard;
