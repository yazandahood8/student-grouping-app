import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAnswers } from "../../services/answerService";

const ExamStatisticsPage = () => {
  const { id } = useParams();
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const res = await getAnswers(id);
        setAnswers(res.data);
      } catch (err) {
        alert("Error loading statistics");
      }
    };
    fetchAnswers();
  }, [id]);

  if (!answers.length) return <p>No data yet...</p>;

  const avgScore = answers.reduce((sum, a) => sum + a.score, 0) / answers.length;

  return (
    <div>
      <h2>Exam Statistics</h2>
      <p>Number of Students: {answers.length}</p>
      <p>Average Score: {avgScore.toFixed(2)}</p>
    </div>
  );
};

export default ExamStatisticsPage;
