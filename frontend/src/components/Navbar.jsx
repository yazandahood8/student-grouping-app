import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Badge,
  Button,
  Container,
  Nav,
  Navbar as RBNavbar,
  Offcanvas,
} from "react-bootstrap";
import styles from "./Navbar.module.scss";

const readAuth = () => ({
  token: localStorage.getItem("token"),
  role: localStorage.getItem("role"),
  name: localStorage.getItem("name") || "",
});

const AppNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [auth, setAuth] = useState(readAuth);

  // Keep navbar in sync when:
  // - another part of the app signals an auth change (same tab)
  // - the tab regains focus (user might have logged in a popup)
  // - the route changes (safe periodic sync)
  useEffect(() => {
    const sync = () => setAuth(readAuth());
    window.addEventListener("auth-changed", sync);
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener("auth-changed", sync);
      window.removeEventListener("focus", sync);
    };
  }, []);

  useEffect(() => {
    // sync on route changes too
    setAuth(readAuth());
  }, [location.key]);

  const isAuthed = Boolean(auth.token);
  const roleLabel =
    auth.role === "teacher" ? "Teacher" :
    auth.role === "student" ? "Student" : "";

  const handleLogout = () => {
    localStorage.clear();
    setAuth({ token: null, role: null, name: "" });
    // notify the rest of the app
    window.dispatchEvent(new Event("auth-changed"));
    navigate("/login");
  };

  const brand = useMemo(
    () => (
      <Link to="/" className={`navbar-brand ${styles.brand}`}>
        <span aria-hidden className="me-2">🎓</span>
        <span className="fw-semibold">Student Grouping</span>
      </Link>
    ),
    []
  );

  return (
    <RBNavbar
      expand="lg"
      bg="dark"
      data-bs-theme="dark"
      variant="dark"
      className={styles.navbar}
      role="navigation"
      aria-label="Main navigation"
    >
      <Container fluid="xl">
        {brand}

        <RBNavbar.Toggle aria-controls="main-offcanvas" />

        <RBNavbar.Offcanvas
          id="main-offcanvas"
          aria-labelledby="main-offcanvas-label"
          placement="end"
          className="bg-dark text-white"
          data-bs-theme="dark"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id="main-offcanvas-label">
              Navigation
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="ms-auto align-items-lg-center gap-lg-2">
              {!isAuthed && (
                <>
                  <Nav.Item>
                    <Link to="/login" className={`nav-link ${styles.navLink}`}>
                      Login
                    </Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Link to="/register" className={`nav-link ${styles.navLink}`}>
                      Register
                    </Link>
                  </Nav.Item>
                </>
              )}

              {isAuthed && auth.role === "student" && (
                <Nav.Item>
                  <Link to="/student/dashboard" className={`nav-link ${styles.navLink}`}>
                    Dashboard
                  </Link>
                </Nav.Item>
              )}

              {isAuthed && auth.role === "teacher" && (
                <Nav.Item>
                  <Link to="/teacher/dashboard" className={`nav-link ${styles.navLink}`}>
                    Dashboard
                  </Link>
                </Nav.Item>
              )}

              {isAuthed && (
                <>
                  {roleLabel && (
                    <span className="ms-lg-2 my-2 my-lg-0">
                      <Badge bg="info" className={styles.roleBadge} aria-label={`Role ${roleLabel}`}>
                        {roleLabel}
                      </Badge>
                    </span>
                  )}
                  <Nav.Item className="ms-lg-2 my-2 my-lg-0">
                    <Button
                      size="sm"
                      variant="outline-light"
                      onClick={handleLogout}
                      className={styles.logoutBtn}
                      aria-label="Log out"
                    >
                      Logout
                    </Button>
                  </Nav.Item>
                </>
              )}
            </Nav>
          </Offcanvas.Body>
        </RBNavbar.Offcanvas>
      </Container>
    </RBNavbar>
  );
};

export default AppNavbar;
