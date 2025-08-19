// src/pages/student/ExamPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { submitAnswers } from "../../services/answerService";

const ExamPage = () => {
  const { id } = useParams(); // examId
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await api.get(`/exams/${id}`); // ✅ fetch one exam
        const examData = res.data;

        if (!examData || !examData.questions) {
          throw new Error("Exam not found or invalid structure");
        }

        setExam(examData);
        setAnswers(examData.questions.map(() => ({ selectedOption: null })));
      } catch (err) {
        console.error("Error loading exam:", err);
        alert("Error loading exam: " + err.message);
      }
    };
    fetchExam();
  }, [id]);

  const handleSelect = (qIndex, optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[qIndex] = {
      question: exam.questions[qIndex]._id,
      selectedOption: optionIndex,
    };
    setAnswers(newAnswers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitAnswers({ examId: id, answers });
      navigate(`/student/exam/${id}/confirmation`);
    } catch (err) {
      alert("Error submitting answers");
    }
  };

  if (!exam) return <p>Loading exam...</p>;

  return (
    <div>
      <h2>{exam.title}</h2>
      <form onSubmit={handleSubmit}>
        {exam.questions.map((q, qIndex) => (
          <div key={q._id} className="mb-3">
            <p><b>{q.text}</b></p>
            {q.options.map((opt, oIndex) => (
              <div key={oIndex} className="form-check">
                <input
                  type="radio"
                  name={`q${qIndex}`}
                  className="form-check-input"
                  checked={answers[qIndex]?.selectedOption === oIndex}
                  onChange={() => handleSelect(qIndex, oIndex)}
                />
                <label className="form-check-label">{opt}</label>
              </div>
            ))}
          </div>
        ))}
        <button className="btn btn-success">Submit</button>
      </form>
    </div>
  );
};

export default ExamPage;
