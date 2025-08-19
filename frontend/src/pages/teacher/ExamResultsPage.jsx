import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAnswers } from "../../services/answerService";
import { makeGroups } from "../../services/groupService";

const ExamResultsPage = () => {
  const { id } = useParams();
  const [answers, setAnswers] = useState([]);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const res = await getAnswers(id);
        setAnswers(res.data);
      } catch (err) {
        alert("Error loading answers");
      }
    };
    fetchAnswers();
  }, [id]);

  const handleGroup = async () => {
    try {
      const res = await makeGroups({ examId: id, numGroups: 3 });
      setGroups(res.data);
    } catch (err) {
      alert("Error grouping students");
    }
  };

  return (
    <div>
      <h2>Exam Results</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Student</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {answers.map((a) => (
            <tr key={a._id}>
              <td>{a.student?.name}</td>
              <td>{a.score}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="btn btn-primary" onClick={handleGroup}>Make Groups</button>

      {groups.length > 0 && (
        <div className="mt-4">
          <h3>Groups</h3>
          {groups.map((g) => (
            <div key={g._id} className="card mb-2 p-2">
              <h5>Group {g.groupNumber}</h5>
              <ul>
                {g.students.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExamResultsPage;
