import React, { useEffect, useState } from "react";
import { getMyExams } from "../../services/examService";
import { Link } from "react-router-dom";

const TeacherDashboard = () => {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await getMyExams();
        setExams(res.data);
      } catch (err) {
        alert("Error loading exams");
      }
    };
    fetchExams();
  }, []);

  return (
    <div>
      <h2>My Exams</h2>
      <Link to="/teacher/create-exam" className="btn btn-success mb-3">+ Create Exam</Link>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Exam Title</th>
            <th>Exam ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {exams.map((exam) => (
            <tr key={exam._id}>
              <td>{exam.title}</td>
              <td>{exam._id}</td>
              <td>
                <Link to={`/teacher/exam/${exam._id}/results`} className="btn btn-primary btn-sm me-2">Results</Link>
                <Link to={`/teacher/exam/${exam._id}/stats`} className="btn btn-info btn-sm">Statistics</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherDashboard;
