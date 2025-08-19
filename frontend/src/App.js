import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import StudentDashboard from "./pages/student/StudentDashboard";
import ExamPage from "./pages/student/ExamPage";
import ExamConfirmation from "./pages/student/ExamConfirmation";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import CreateExamPage from "./pages/teacher/CreateExamPage";
import ExamResultsPage from "./pages/teacher/ExamResultsPage";
import ExamStatisticsPage from "./pages/teacher/ExamStatisticsPage";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Student */}
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/exam/:id" element={<ExamPage />} />
          <Route path="/student/exam/:id/confirmation" element={<ExamConfirmation />} />

          {/* Teacher */}
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/create-exam" element={<CreateExamPage />} />
          <Route path="/teacher/exam/:id/results" element={<ExamResultsPage />} />
          <Route path="/teacher/exam/:id/stats" element={<ExamStatisticsPage />} />

          {/* Default */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
