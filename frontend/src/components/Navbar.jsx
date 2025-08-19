import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
//  console.log("Sending token:", token);

  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/">🎓 Student Grouping</Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ms-auto">
          {!token && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">Register</Link>
              </li>
            </>
          )}
          {token && role === "student" && (
            <li className="nav-item">
              <Link className="nav-link" to="/student/dashboard">Dashboard</Link>
            </li>
          )}
          {token && role === "teacher" && (
            <li className="nav-item">
              <Link className="nav-link" to="/teacher/dashboard">Dashboard</Link>
            </li>
          )}
          {token && (
            <li className="nav-item">
              <button onClick={handleLogout} className="btn btn-danger btn-sm ms-2">Logout</button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
