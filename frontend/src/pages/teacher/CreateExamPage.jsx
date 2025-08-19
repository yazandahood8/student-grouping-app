import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createExam } from "../../services/examService";

const CreateExamPage = () => {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([{ text: "", options: ["", "", "", ""], correctAnswer: 0 }]);
  const navigate = useNavigate();

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    if (field === "text") newQuestions[index].text = value;
    if (field.startsWith("option")) {
      const optIndex = parseInt(field.replace("option", ""), 10);
      newQuestions[index].options[optIndex] = value;
    }
    if (field === "correctAnswer") newQuestions[index].correctAnswer = parseInt(value, 10);
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { text: "", options: ["", "", "", ""], correctAnswer: 0 }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createExam({ title, questions });
      alert("Exam created!");
      navigate("/teacher/dashboard");
    } catch (err) {
      alert("Error creating exam");
    }
  };

  return (
    <div>
      <h2>Create Exam</h2>
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-3"
          placeholder="Exam Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {questions.map((q, i) => (
          <div key={i} className="card mb-3 p-3">
            <h5>Question {i + 1}</h5>
            <input
              className="form-control mb-2"
              placeholder="Question text"
              value={q.text}
              onChange={(e) => handleQuestionChange(i, "text", e.target.value)}
            />
            {q.options.map((opt, oi) => (
              <input
                key={oi}
                className="form-control mb-2"
                placeholder={`Option ${oi + 1}`}
                value={opt}
                onChange={(e) => handleQuestionChange(i, `option${oi}`, e.target.value)}
              />
            ))}
            <select
              className="form-control"
              value={q.correctAnswer}
              onChange={(e) => handleQuestionChange(i, "correctAnswer", e.target.value)}
            >
              <option value={0}>Option 1</option>
              <option value={1}>Option 2</option>
              <option value={2}>Option 3</option>
              <option value={3}>Option 4</option>
            </select>
          </div>
        ))}
        <button type="button" className="btn btn-secondary me-2" onClick={addQuestion}>+ Add Question</button>
        <button type="submit" className="btn btn-primary">Save Exam</button>
      </form>
    </div>
  );
};

export default CreateExamPage;
